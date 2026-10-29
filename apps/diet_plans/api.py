from ninja import Router, File, Form, UploadedFile
from datetime import date, datetime, timedelta
from typing import List, Optional
from ninja.errors import HttpError
from django.db import transaction

from .models import DailyMealPlan, PlannedMeal, ShoppingListItem, DietPlanTemplate, DietPlanTemplateAssignment
from .pdf_importer import import_diet_from_pdf
from .schemas import (
    DailyMealPlanOutSchema, AssignDailyPlanSchema,
    ShoppingListItemOutSchema, ToggleShoppingItemStatusSchema,
    BulkToggleShoppingItemsSchema,
    WeeklyMealPlanOutSchema, DietPlanTemplateCreateSchema,
    DietPlanTemplateOutSchema, ApplyTemplateToPatientSchema,
    AssignmentHistoryOutSchema, PatientLoadPackageSchema
)
from .services import generate_smart_shopping_list
from apps.recipes.models import Recipe
from apps.authentication.models import User, UserRole
from apps.authentication.security import JWTAuth
from apps.chat.models import Notification

router = Router(tags=["Jadłospisy i Lista Zakupów"])

POLISH_DAYS = [
    "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"
]

def populate_day_from_template(patient, target_date: date, template: DietPlanTemplate, dietitian=None, notes=None):
    """Pomocniczo wypełnia posiłki dla konkretnego dnia na podstawie szablonu."""
    days_data = template.days_data or []
    if not days_data:
        return None
    # Indeks dnia: 0 = poniedziałek, ..., 6 = niedziela
    day_idx = target_date.weekday()
    if day_idx < len(days_data):
        day_info = days_data[day_idx]
    else:
        day_info = days_data[day_idx % len(days_data)]

    if not day_info:
        return None

    daily_plan, _ = DailyMealPlan.objects.get_or_create(
        patient=patient,
        date=target_date,
        defaults={
            'dietitian': dietitian,
            'notes': notes or f"Pakiet: {template.name} ({template.category})"
        }
    )
    if dietitian and not daily_plan.dietitian:
        daily_plan.dietitian = dietitian
    if notes and not daily_plan.notes:
        daily_plan.notes = notes
    daily_plan.save()

    # Jeśli plan nie ma jeszcze posiłków, dodaj je z szablonu
    if daily_plan.meals.count() == 0:
        meals_list = day_info.get('meals', [])
        for order_idx, m_item in enumerate(meals_list, start=1):
            recipe = Recipe.objects.filter(id=m_item.get('recipe_id')).first()
            if recipe:
                PlannedMeal.objects.create(
                    daily_plan=daily_plan,
                    recipe=recipe,
                    meal_type=m_item.get('meal_type', 'obiad'),
                    portions=m_item.get('portions', 1.0),
                    order=order_idx
                )
    return daily_plan

def deploy_template_to_patient_days(template: DietPlanTemplate, patient: User, start_date: date, dietitian=None, notes=""):
    """Wdraża wszystkie dni z szablonu do bazy i rejestruje przypisanie."""
    days_data = template.days_data or []
    if not days_data:
        return 0, start_date, start_date

    with transaction.atomic():
        for i, day_info in enumerate(days_data):
            target_date = start_date + timedelta(days=i)
            daily_plan, _ = DailyMealPlan.objects.get_or_create(
                patient=patient,
                date=target_date,
                defaults={
                    'dietitian': dietitian,
                    'notes': notes or f"Pakiet: {template.name} ({template.category})"
                }
            )
            if dietitian:
                daily_plan.dietitian = dietitian
            if notes:
                daily_plan.notes = notes
            daily_plan.save()

            daily_plan.meals.all().delete()
            meals_list = day_info.get('meals', [])
            for order_idx, m_item in enumerate(meals_list, start=1):
                recipe = Recipe.objects.filter(id=m_item.get('recipe_id')).first()
                if recipe:
                    PlannedMeal.objects.create(
                        daily_plan=daily_plan,
                        recipe=recipe,
                        meal_type=m_item.get('meal_type', 'obiad'),
                        portions=m_item.get('portions', 1.0),
                        order=order_idx
                    )

        end_date = start_date + timedelta(days=len(days_data) - 1)
        DietPlanTemplateAssignment.objects.create(
            template=template,
            patient=patient,
            dietitian=dietitian,
            start_date=start_date,
            end_date=end_date,
            notes=notes or f"Wdrożono pakiet {template.name}"
        )

        # Wymóg 10: w zaleceniach zapisz tytuł bieżącego jadłospisu i date wprowadzenia, oraz historię przesłanych jadlospisów
        try:
            from apps.authentication.models import PatientRecommendation
            intro_date_str = start_date.strftime("%d.%m.%Y")
            end_date_str = end_date.strftime("%d.%m.%Y")

            assignments = DietPlanTemplateAssignment.objects.filter(
                patient=patient
            ).select_related('template', 'dietitian').order_by('-created_at')[:10]

            history_lines = []
            for a in assignments:
                created_str = a.created_at.strftime("%d.%m.%Y") if hasattr(a, 'created_at') and a.created_at else a.start_date.strftime("%d.%m.%Y")
                dietitian_info = f" (przesłał: {a.dietitian.get_full_name() or a.dietitian.email})" if a.dietitian else ""
                history_lines.append(f"• {a.template.name} — od {a.start_date.strftime('%d.%m.%Y')} do {a.end_date.strftime('%d.%m.%Y')} [wprowadzono: {created_str}]{dietitian_info}")

            history_block = "\n".join(history_lines) if history_lines else f"• {template.name} (od {intro_date_str})"

            header_block = (
                f"📌 BIEŻĄCY JADŁOSPIS: {template.name}\n"
                f"📅 Data wprowadzenia: {intro_date_str} (obowiązuje do: {end_date_str})\n"
                f"----------------------------------------"
            )

            if hasattr(patient, 'patient_profile') and patient.patient_profile:
                prof = patient.patient_profile
                current_text = prof.official_recommendations or ""
                import re
                cleaned = re.sub(r'📌 BIEŻĄCY JADŁOSPIS:.*?(?=\n\n|\n💡|\Z)', '', current_text, flags=re.DOTALL)
                cleaned = re.sub(r'📜 HISTORIA PRZESŁANYCH JADŁOSPISÓW:.*', '', cleaned, flags=re.DOTALL).strip()
                if not cleaned:
                    cleaned = "💡 ZALECENIA DIETETYKA:\n1. Regularne posiłki co 3-4 godziny.\n2. Pij minimum 2-2.5 l wody dziennie.\n3. Posiłki zoptymalizowane pod minimalny czas przygotowania."

                prof.official_recommendations = (
                    f"{header_block}\n\n"
                    f"{cleaned}\n\n"
                    f"📜 HISTORIA PRZESŁANYCH JADŁOSPISÓW:\n"
                    f"{history_block}"
                )
                prof.save(update_fields=['official_recommendations'])

            PatientRecommendation.objects.create(
                patient=patient,
                dietitian=dietitian,
                title=f"Wdrożenie: {template.name}",
                content=f"Wdrożono jadłospis '{template.name}' ({template.category}) z datą wprowadzenia: {intro_date_str}. Okres ważności do {end_date_str}."
            )
        except Exception as e:
            import logging
            logging.getLogger(__name__).warning(f"Błąd zapisu zaleceń po wdrożeniu pakietu: {e}")

    return len(days_data), start_date, end_date

def serialize_daily_plan(plan: DailyMealPlan) -> dict:
    meals_out = []
    tot_cal = 0.0
    tot_p = 0.0
    tot_f = 0.0
    tot_c = 0.0

    # Płeć pacjenta do kalibracji wielkości porcji i makroskładników
    patient_gender = 'all'
    if hasattr(plan.patient, 'patient_profile') and plan.patient.patient_profile and plan.patient.patient_profile.gender:
        patient_gender = plan.patient.patient_profile.gender.lower()

    for m in plan.meals.select_related('recipe').all():
        recipe = m.recipe
        multiplier = float(m.portions) / float(recipe.default_portions or 1.0)
        
        # Pobranie makro z uwzględnieniem płci pacjenta
        if patient_gender in ('female', 'male'):
            macros = recipe.get_macros_for_gender(patient_gender)
            cal = float(macros['calories']) * multiplier
            p = float(macros['protein_g']) * multiplier
            f = float(macros['fat_g']) * multiplier
            c = float(macros['carbs_g']) * multiplier
        else:
            cal = float(recipe.calories) * multiplier
            p = float(recipe.protein_g) * multiplier
            f = float(recipe.fat_g) * multiplier
            c = float(recipe.carbs_g) * multiplier

        tot_cal += cal
        tot_p += p
        tot_f += f
        tot_c += c

        ing_list = []
        for ing in recipe.ingredients.select_related('product').all():
            base_amt = ing.get_amount_for_gender(patient_gender)
            scaled_amt = round(base_amt * multiplier, 1)
            f_amt = float(ing.amount_female_g) if ing.amount_female_g else round(float(ing.amount_g) * 0.82, 1)
            m_amt = float(ing.amount_male_g) if ing.amount_male_g else round(float(ing.amount_g) * 1.18, 1)

            ing_list.append({
                "id": ing.id,
                "product": {
                    "id": ing.product.id,
                    "name": ing.product.name,
                    "store": ing.product.store,
                    "brand": ing.product.brand,
                    "unit": ing.product.unit,
                    "category": ing.product.category,
                    "calories_per_100g": float(ing.product.calories_per_100g),
                    "protein_per_100g": float(ing.product.protein_per_100g),
                    "fat_per_100g": float(ing.product.fat_per_100g),
                    "carbs_per_100g": float(ing.product.carbs_per_100g),
                },
                "amount_g": scaled_amt,
                "amount_female_g": round(f_amt * multiplier, 1),
                "amount_male_g": round(m_amt * multiplier, 1),
                "unit": ing.unit,
            })

        meals_out.append({
            "id": m.id,
            "meal_type": m.meal_type,
            "portions": float(m.portions),
            "order": m.order,
            "is_completed": m.is_completed,
            "recipe": {
                "id": recipe.id,
                "title": recipe.title,
                "category": recipe.category,
                "instructions": recipe.instructions or "Wskazówki przygotowania: Połącz składniki i przygotuj zgodnie z instrukcją szefa kuchni.",
                "preparation_time_minutes": recipe.preparation_time_minutes,
                "default_portions": float(recipe.default_portions),
                "calories": round(cal, 1),
                "protein_g": round(p, 1),
                "fat_g": round(f, 1),
                "carbs_g": round(c, 1),
                "calories_female": round(float(recipe.calories_female) * multiplier, 1),
                "calories_male": round(float(recipe.calories_male) * multiplier, 1),
                "protein_female_g": round(float(recipe.protein_female_g) * multiplier, 1),
                "protein_male_g": round(float(recipe.protein_male_g) * multiplier, 1),
                "fat_female_g": round(float(recipe.fat_female_g) * multiplier, 1),
                "fat_male_g": round(float(recipe.fat_male_g) * multiplier, 1),
                "carbs_female_g": round(float(recipe.carbs_female_g) * multiplier, 1),
                "carbs_male_g": round(float(recipe.carbs_male_g) * multiplier, 1),
                "image_url": recipe.image_url,
                "is_verified": recipe.is_verified,
                "ingredients": ing_list,
            }
        })

    day_idx = plan.date.weekday()
    day_name = POLISH_DAYS[day_idx] if 0 <= day_idx < 7 else ""

    return {
        "id": plan.id,
        "date": plan.date,
        "day_name": day_name,
        "notes": plan.notes,
        "meals": meals_out,
        "total_calories": round(tot_cal, 1),
        "total_protein_g": round(tot_p, 1),
        "total_fat_g": round(tot_f, 1),
        "total_carbs_g": round(tot_c, 1),
    }

@router.get("/daily", response=DailyMealPlanOutSchema, auth=JWTAuth())
def get_daily_plan(request, target_date: Optional[date] = None, patient_id: Optional[int] = None):
    """
    Pobiera jadłospis pacjenta na dany dzień.
    Dla pacjenta zwraca jego własny plan, dla dietetyka plan wybranego pacjenta.
    """
    current_user = request.auth_user
    day = target_date or date.today()

    if current_user.role == UserRole.PATIENT:
        target_patient = current_user
    else:
        if not patient_id:
            raise HttpError(400, "Wymagane ID pacjenta.")
        target_patient = User.objects.filter(id=patient_id, role=UserRole.PATIENT).first()
        if not target_patient:
            raise HttpError(404, "Nie znaleziono wskazanego pacjenta.")

    plan = DailyMealPlan.objects.prefetch_related('meals__recipe').filter(
        patient=target_patient,
        date=day
    ).first()

    if not plan or plan.meals.count() == 0:
        assignment = DietPlanTemplateAssignment.objects.filter(
            patient=target_patient,
            start_date__lte=day
        ).order_by('-start_date', '-id').first() or DietPlanTemplateAssignment.objects.filter(
            patient=target_patient
        ).order_by('-start_date', '-id').first()

        if assignment and assignment.template:
            plan = populate_day_from_template(
                patient=target_patient,
                target_date=day,
                template=assignment.template,
                dietitian=assignment.dietitian,
                notes=f"Pakiet: {assignment.template.name} (auto)"
            )
            if plan:
                plan = DailyMealPlan.objects.prefetch_related('meals__recipe').filter(id=plan.id).first()

    if not plan:
        plan = DailyMealPlan.objects.create(
            patient=target_patient,
            date=day,
            notes="Brak przypisanego jadłospisu na ten dzień."
        )

    return serialize_daily_plan(plan)

@router.get("/weekly", response=WeeklyMealPlanOutSchema, auth=JWTAuth())
def get_weekly_plan(request, start_date: Optional[date] = None, patient_id: Optional[int] = None):
    """
    Pobiera 7-dniowy widok jadłospisu (Poniedziałek - Niedziela)
    ze szczegółami posiłków do interaktywnego kalendarza i tooltipów.
    Automatycznie wczytuje pakiet od daty przypisania lub powtarza ostatni pakiet.
    """
    current_user = request.auth_user
    if current_user.role == UserRole.PATIENT:
        target_patient = current_user
    else:
        if not patient_id:
            raise HttpError(400, "Wymagane ID pacjenta.")
        target_patient = User.objects.filter(id=patient_id, role=UserRole.PATIENT).first()
        if not target_patient:
            raise HttpError(404, "Nie znaleziono wskazanego pacjenta.")

    if not start_date:
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
    else:
        week_start = start_date

    week_end = week_start + timedelta(days=6)

    plans = DailyMealPlan.objects.prefetch_related('meals__recipe').filter(
        patient=target_patient,
        date__range=[week_start, week_end]
    )
    plans_by_date = {p.date: p for p in plans}

    # Sprawdzenie czy w danym tygodniu brakuje posiłków i automatyczne załadowanie pakietu
    missing_days = [
        week_start + timedelta(days=i)
        for i in range(7)
        if (week_start + timedelta(days=i)) not in plans_by_date or plans_by_date[week_start + timedelta(days=i)].meals.count() == 0
    ]

    if missing_days:
        # Paczki wysłane przez dietetyka ładują się od podanej daty.
        # Jeżeli nie ma nowej paczki, to automatycznie ładuje się ostatnia paczka.
        assignment = DietPlanTemplateAssignment.objects.filter(
            patient=target_patient,
            start_date__lte=week_end
        ).order_by('-start_date', '-id').first()

        if not assignment:
            assignment = DietPlanTemplateAssignment.objects.filter(
                patient=target_patient
            ).order_by('-start_date', '-id').first()

        if assignment and assignment.template:
            for day in missing_days:
                populate_day_from_template(
                    patient=target_patient,
                    target_date=day,
                    template=assignment.template,
                    dietitian=assignment.dietitian,
                    notes=f"Pakiet: {assignment.template.name} (auto)"
                )
            # Przeładuj zaktualizowane plany
            plans = DailyMealPlan.objects.prefetch_related('meals__recipe').filter(
                patient=target_patient,
                date__range=[week_start, week_end]
            )
            plans_by_date = {p.date: p for p in plans}

    days_summary = []
    for i in range(7):
        current_day = week_start + timedelta(days=i)
        p = plans_by_date.get(current_day)
        day_name = POLISH_DAYS[current_day.weekday()]

        if not p:
            days_summary.append({
                "date": current_day,
                "day_name": day_name,
                "total_calories": 0.0,
                "total_protein_g": 0.0,
                "total_fat_g": 0.0,
                "total_carbs_g": 0.0,
                "meals_count": 0,
                "meals_preview": []
            })
            continue

        tot_cal = 0.0
        tot_p = 0.0
        tot_f = 0.0
        tot_c = 0.0
        meals_preview = []

        for m in p.meals.all():
            recipe = m.recipe
            multiplier = float(m.portions) / float(recipe.default_portions or 1.0)
            cal = float(recipe.calories) * multiplier
            p_val = float(recipe.protein_g) * multiplier
            f_val = float(recipe.fat_g) * multiplier
            c_val = float(recipe.carbs_g) * multiplier

            tot_cal += cal
            tot_p += p_val
            tot_f += f_val
            tot_c += c_val

            meals_preview.append({
                "id": m.id,
                "meal_type": m.meal_type,
                "recipe_title": recipe.title,
                "recipe_id": recipe.id,
                "portions": float(m.portions),
                "calories": round(cal, 1),
                "protein_g": round(p_val, 1),
                "fat_g": round(f_val, 1),
                "carbs_g": round(c_val, 1),
                "image_url": recipe.image_url or "",
                "preparation_time_minutes": recipe.preparation_time_minutes,
                "is_completed": m.is_completed,
            })

        days_summary.append({
            "date": current_day,
            "day_name": day_name,
            "total_calories": round(tot_cal, 1),
            "total_protein_g": round(tot_p, 1),
            "total_fat_g": round(tot_f, 1),
            "total_carbs_g": round(tot_c, 1),
            "meals_count": len(meals_preview),
            "meals_preview": meals_preview
        })

    return {
        "start_date": week_start,
        "end_date": week_end,
        "days": days_summary
    }

@router.post("/assign", response=DailyMealPlanOutSchema, auth=JWTAuth())
def assign_daily_plan(request, payload: AssignDailyPlanSchema):
    """
    Dietetyk lub Administrator przypisuje zestaw dań pacjentowi na dany dzień.
    """
    current_user = request.auth_user
    if current_user.role not in [UserRole.ADMIN, UserRole.DIETITIAN]:
        raise HttpError(403, "Tylko dietetyk może układać i przypisywać jadłospis.")

    patient = User.objects.filter(id=payload.patient_id, role=UserRole.PATIENT).first()
    if not patient:
        raise HttpError(404, "Nie znaleziono wskazanego pacjenta.")

    with transaction.atomic():
        plan, _ = DailyMealPlan.objects.get_or_create(
            patient=patient,
            date=payload.date,
            defaults={'dietitian': current_user, 'notes': payload.notes}
        )
        plan.dietitian = current_user
        plan.notes = payload.notes or plan.notes
        plan.save()

        plan.meals.all().delete()
        for item in payload.meals:
            recipe = Recipe.objects.filter(id=item.recipe_id).first()
            if recipe:
                PlannedMeal.objects.create(
                    daily_plan=plan,
                    recipe=recipe,
                    meal_type=item.meal_type,
                    portions=item.portions,
                    order=item.order
                )

    return serialize_daily_plan(plan)

# --- SZABLONY I PAKIETY DIET (DLA DIETETYKA) ---

def serialize_template(t: DietPlanTemplate) -> dict:
    assignments_data = []
    for a in t.assignments.select_related('patient', 'dietitian').all()[:15]:
        assignments_data.append({
            "id": a.id,
            "patient_id": a.patient.id,
            "patient_name": a.patient.get_full_name() or a.patient.email,
            "patient_email": a.patient.email,
            "dietitian_name": a.dietitian.get_full_name() or a.dietitian.email if a.dietitian else "Dietetyk",
            "start_date": a.start_date,
            "end_date": a.end_date,
            "notes": a.notes,
            "created_at": a.created_at,
        })

    # Wzbogacenie days_data o nazwy i parametry przepisów
    enriched_days = []
    recipe_ids = set()
    for d in (t.days_data or []):
        for m in d.get("meals", []):
            if m.get("recipe_id"):
                recipe_ids.add(m["recipe_id"])
    recipes_map = {r.id: r for r in Recipe.objects.filter(id__in=recipe_ids)} if recipe_ids else {}

    for d in (t.days_data or []):
        d_copy = dict(d)
        enriched_meals = []
        for m in d.get("meals", []):
            m_copy = dict(m)
            rec = recipes_map.get(m.get("recipe_id"))
            if rec:
                m_copy["recipe_title"] = rec.title
                m_copy["recipe_category"] = rec.category
                m_copy["recipe_calories"] = rec.calories
                m_copy["recipe_image"] = rec.image_url or ""
            enriched_meals.append(m_copy)
        d_copy["meals"] = enriched_meals
        enriched_days.append(d_copy)

    return {
        "id": t.id,
        "name": t.name,
        "category": t.category,
        "target_gender": t.target_gender,
        "description": t.description,
        "target_calories": t.target_calories,
        "meals_per_day": t.meals_per_day,
        "days_data": enriched_days,
        "created_at": t.created_at,
        "assignments": assignments_data
    }

@router.get("/templates", response=List[DietPlanTemplateOutSchema], auth=JWTAuth())
def list_diet_templates(request, category: Optional[str] = None, target_gender: Optional[str] = None):
    """
    Pobiera listę szablonów i pakietów diet.
    Dla pacjenta: zwraca WYŁĄCZNIE pakiety diet przesłane mu przez dietetyka (stare i nowo przesłane).
    Dla dietetyka i admina: zwraca wszystkie szablony.
    Opcjonalnie filtruje po kategorii oraz docelowej płci (target_gender).
    """
    current_user = request.auth_user
    if current_user.role == UserRole.PATIENT:
        # Pacjent widzi tylko pakiety przesłane mu przez dietetyka
        assigned_template_ids = DietPlanTemplateAssignment.objects.filter(
            patient=current_user,
            dietitian__isnull=False
        ).values_list('template_id', flat=True).distinct()
        qs = DietPlanTemplate.objects.filter(id__in=assigned_template_ids)
    else:
        qs = DietPlanTemplate.objects.all()

    qs = qs.prefetch_related('assignments__patient', 'assignments__dietitian').order_by('-created_at')
    if category:
        qs = qs.filter(category__icontains=category)
    if target_gender and target_gender != 'all':
        qs = qs.filter(Q(target_gender=target_gender) | Q(target_gender='all'))
    return [serialize_template(t) for t in qs]

@router.post("/templates", response=DietPlanTemplateOutSchema, auth=JWTAuth())
def create_diet_template(request, payload: DietPlanTemplateCreateSchema):
    """Dietetyk lub administrator tworzy nowy tygodniowy pakiet diety."""
    current_user = request.auth_user
    if current_user.role not in [UserRole.ADMIN, UserRole.DIETITIAN]:
        raise HttpError(403, "Tylko dietetyk lub administrator może tworzyć szablony diet.")

    template = DietPlanTemplate.objects.create(
        dietitian=current_user,
        name=payload.name,
        category=payload.category,
        target_gender=payload.target_gender or "all",
        description=payload.description or "",
        target_calories=payload.target_calories,
        meals_per_day=payload.meals_per_day,
        days_data=[d.dict() for d in payload.days_data]
    )
    return serialize_template(template)

@router.put("/templates/{template_id}", response=DietPlanTemplateOutSchema, auth=JWTAuth())
def update_diet_template(request, template_id: int, payload: DietPlanTemplateCreateSchema):
    """Aktualizacja szablonu/pakietu diety."""
    current_user = request.auth_user
    if current_user.role not in [UserRole.ADMIN, UserRole.DIETITIAN]:
        raise HttpError(403, "Brak uprawnień do edycji szablonów.")

    template = DietPlanTemplate.objects.filter(id=template_id).first()
    if not template:
        raise HttpError(404, "Nie znaleziono szablonu.")

    template.name = payload.name
    template.category = payload.category
    template.target_gender = payload.target_gender or "all"
    template.description = payload.description or ""
    template.target_calories = payload.target_calories
    template.meals_per_day = payload.meals_per_day
    template.days_data = [d.dict() for d in payload.days_data]
    template.save()
    return serialize_template(template)

@router.post("/import-pdf", auth=JWTAuth())
def import_diet_pdf(
    request,
    file: UploadedFile = File(...),
    template_name: str = Form("M_1500_cal"),
    target_gender: str = Form("male"),
    category: Optional[str] = Form("Bez grupy"),
    description: Optional[str] = Form(None)
):
    """
    Umożliwia dietetykowi wrzucenie pliku PDF z dietą (np. z portalu Diety NFZ).
    System automatycznie pobiera wszystkie niezbędne informacje (posiłki, kalorie, makroskładniki,
    miary domowe, gramatury, instrukcje ze źródłem https://diety.nfz.gov.pl/)
    i tworzy gotowy pakiet jadłospisu z inteligentną deduplikacją przepisów.
    """
    current_user = request.auth_user
    if current_user.role not in [UserRole.ADMIN, UserRole.DIETITIAN]:
        raise HttpError(403, "Tylko dietetyk lub administrator może importować jadłospisy z PDF.")

    if not file.name.lower().endswith('.pdf'):
        raise HttpError(400, "Wymagany jest plik w formacie PDF (.pdf).")

    try:
        content = file.read()
        res = import_diet_from_pdf(
            pdf_source=content,
            template_name=(template_name or "M_1500_cal").strip(),
            dietitian=current_user,
            target_gender=target_gender,
            category=(category or "").strip() or "Bez grupy",
            description=description
        )
        return res
    except Exception as e:
        raise HttpError(400, f"Błąd przetwarzania pliku PDF: {str(e)}")

@router.delete("/templates/{template_id}", auth=JWTAuth())
def delete_diet_template(request, template_id: int):
    """Usunięcie szablonu diety (dostępne dla Dietetyka i Admina)."""
    current_user = request.auth_user
    if current_user.role not in [UserRole.ADMIN, UserRole.DIETITIAN]:
        raise HttpError(403, "Brak uprawnień.")

    template = DietPlanTemplate.objects.filter(id=template_id).first()
    if not template:
        raise HttpError(404, "Nie znaleziono szablonu.")

    template.delete()
    return {"message": "Szablon diety został usunięty."}

@router.post("/templates/{template_id}/send-to-patient", auth=JWTAuth())
def send_template_to_patient(request, template_id: int, payload: ApplyTemplateToPatientSchema):
    """
    Wdraża cały 7-dniowy pakiet diety na konto pacjenta od wybranej daty,
    zapisuje potwierdzenie w historii przypisań i wysyła powiadomienie systemowe do pacjenta.
    """
    current_user = request.auth_user
    if current_user.role not in [UserRole.ADMIN, UserRole.DIETITIAN]:
        raise HttpError(403, "Tylko dietetyk lub administrator może przesyłać pakiety diet.")

    template = DietPlanTemplate.objects.filter(id=template_id).first()
    if not template:
        raise HttpError(404, "Nie znaleziono wybranego szablonu diety.")

    patient = User.objects.filter(id=payload.patient_id, role=UserRole.PATIENT).first()
    if not patient:
        raise HttpError(404, "Nie znaleziono wskazanego pacjenta.")

    days_assigned, start_d, end_d = deploy_template_to_patient_days(
        template=template,
        patient=patient,
        start_date=payload.start_date,
        dietitian=current_user,
        notes=payload.notes or f"Wdrożono pakiet {template.name}"
    )

    # Powiadomienie dla pacjenta
    Notification.objects.create(
        recipient=patient,
        title=f"Nowy pakiet diety: {template.name}",
        message=f"Twój dietetyk wdrożył dla Ciebie pakiet '{template.name}' ({template.category}) na okres od {payload.start_date} do {end_d}.",
        notification_type=Notification.NotificationType.PLAN_UPDATE
    )

    return {
        "message": f"Pakiet '{template.name}' został pomyślnie wdrożony do kalendarza pacjenta na {days_assigned} dni.",
        "days_assigned": days_assigned,
        "delivered_to": patient.get_full_name() or patient.email,
        "start_date": str(payload.start_date),
        "end_date": str(end_d)
    }

@router.post("/patient/load-package", auth=JWTAuth())
def patient_load_package(request, payload: PatientLoadPackageSchema):
    """
    Pacjent samodzielnie ładuje wybrany pakiet diety do swojego kalendarza od wybranej daty.
    """
    current_user = request.auth_user
    template = DietPlanTemplate.objects.filter(id=payload.template_id).first()
    if not template:
        raise HttpError(404, "Nie znaleziono wybranego pakietu diety.")

    if current_user.role == UserRole.PATIENT:
        is_assigned_by_dietitian = DietPlanTemplateAssignment.objects.filter(
            patient=current_user,
            template=template,
            dietitian__isnull=False
        ).exists()
        if not is_assigned_by_dietitian:
            raise HttpError(403, "Dostęp zablokowany. Możesz załadować wyłącznie pakiety diet przesłane przez Twojego dietetyka.")

    # Domyślny start_date: jeśli brak, weź poniedziałek bieżącego tygodnia
    start_date = payload.start_date
    if not start_date:
        today = date.today()
        start_date = today - timedelta(days=today.weekday())

    days_assigned, s_date, e_date = deploy_template_to_patient_days(
        template=template,
        patient=current_user,
        start_date=start_date,
        dietitian=template.dietitian,
        notes=f"Pakiet '{template.name}' załadowany przez pacjenta"
    )

    Notification.objects.create(
        recipient=current_user,
        title=f"Załadowano pakiet: {template.name}",
        message=f"Pomyślnie załadowano pakiet '{template.name}' ({template.category}) na okres od {s_date} do {e_date}.",
        notification_type=Notification.NotificationType.PLAN_UPDATE
    )

    return {
        "message": f"Pakiet '{template.name}' został pomyślnie załadowany do Twojego kalendarza na {days_assigned} dni (od {s_date} do {e_date}).",
        "template_id": template.id,
        "template_name": template.name,
        "start_date": str(s_date),
        "end_date": str(e_date),
        "days_assigned": days_assigned
    }

@router.post("/meals/{meal_id}/toggle-complete", auth=JWTAuth())
def toggle_meal_completed(request, meal_id: int):
    """Pacjent oznacza posiłek jako zjedzony / niezjedzony."""
    meal = PlannedMeal.objects.select_related('daily_plan').filter(id=meal_id).first()
    if not meal:
        raise HttpError(404, "Nie znaleziono posiłku.")

    if meal.daily_plan.patient_id != request.auth_user.id and request.auth_user.role != UserRole.ADMIN:
        raise HttpError(403, "Brak uprawnień.")

    meal.is_completed = not meal.is_completed
    meal.save(update_fields=['is_completed'])
    return {"message": "Status posiłku zmieniony.", "is_completed": meal.is_completed}

@router.get("/shopping-list", response=List[ShoppingListItemOutSchema], auth=JWTAuth())
def get_shopping_list(
    request,
    start_date: date,
    end_date: date,
    meal_types: Optional[str] = None
):
    """
    Generuje inteligentną listę zakupów dla wybranego zakresu dat (np. od poniedziałku do piątku).
    Automatycznie sumuje powtarzające się produkty z Lidla i Biedronki oraz uwzględnia flagi pominięcia.
    """
    patient = request.auth_user
    types_list = [t.strip() for t in meal_types.split(",")] if meal_types else None

    items = generate_smart_shopping_list(
        patient=patient,
        start_date=start_date,
        end_date=end_date,
        meal_types=types_list,
        persist=True
    )
    return items

@router.post("/shopping-list/toggle", auth=JWTAuth())
def toggle_shopping_item_status(request, payload: ToggleShoppingItemStatusSchema):
    """Oznaczenie produktu jako kupiony lub pominięty (posiadany już w lodówce)."""
    item = ShoppingListItem.objects.filter(id=payload.item_id, patient=request.auth_user).first()
    if not item:
        raise HttpError(404, "Pozycja nie istnieje.")

    if payload.is_bought is not None:
        item.is_bought = payload.is_bought
    if payload.is_skipped is not None:
        item.is_skipped = payload.is_skipped

    item.save()
    return {
        "id": item.id,
        "is_bought": item.is_bought,
        "is_skipped": item.is_skipped,
        "message": "Zaktualizowano status pozycji."
    }

@router.post("/shopping-list/bulk-toggle", auth=JWTAuth())
def bulk_toggle_shopping_items(request, payload: BulkToggleShoppingItemsSchema):
    """Zbiorcze oznaczenie produktów jako kupione/niekupione."""
    patient = request.auth_user
    qs = ShoppingListItem.objects.filter(patient=patient)
    if payload.item_ids:
        qs = qs.filter(id__in=payload.item_ids)

    updated_count = qs.update(is_bought=payload.is_bought)
    return {
        "is_bought": payload.is_bought,
        "updated_count": updated_count,
        "message": f"Zaktualizowano {updated_count} pozycji."
    }
