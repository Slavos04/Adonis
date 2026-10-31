from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decimal import Decimal
from datetime import date, timedelta
from apps.authentication.models import UserRole, PatientProfile
from apps.recipes.models import Product, Recipe, RecipeIngredient, StoreChoice, MealCategory
from apps.recipes.fixtures_data import PRODUCTS_CATALOG, generate_fitness_recipes
from apps.diet_plans.models import DailyMealPlan, PlannedMeal, DietPlanTemplate, DietPlanTemplateAssignment
from apps.measurements.models import Measurement, MeasurementAuditLog

User = get_user_model()

class Command(BaseCommand):
    help = 'Inicjalizuje bazę danych Adonis: tworzy role, użytkowników, bazę produktów Lidl/Biedronka, 130 przepisów fitness ze zdjęciami oraz pakiety diet dla dietetyka.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("=== Rozpoczynanie inicjalizacji bazy Adonis ==="))

        # 1. Użytkownicy i Role
        admin_user, _ = User.objects.get_or_create(
            email='admin@adonis.app',
            defaults={
                'username': 'admin',
                'first_name': 'Główny',
                'last_name': 'Administrator',
                'role': UserRole.ADMIN,
                'is_staff': True,
                'is_superuser': True
            }
        )
        admin_user.set_password('Admin123!')
        admin_user.save()

        dietitian_user, _ = User.objects.get_or_create(
            email='dietetyk@adonis.app',
            defaults={
                'username': 'dietetyk',
                'first_name': 'Katarzyna',
                'last_name': 'Kowalska',
                'role': UserRole.DIETITIAN,
                'is_staff': True
            }
        )
        dietitian_user.set_password('Dietetyk123!')
        dietitian_user.save()

        patient_user, _ = User.objects.get_or_create(
            email='pacjent@adonis.app',
            defaults={
                'username': 'pacjent',
                'first_name': 'Marek',
                'last_name': 'Nowak',
                'role': UserRole.PATIENT,
                'assigned_dietitian': dietitian_user
            }
        )
        patient_user.set_password('Pacjent123!')
        patient_user.assigned_dietitian = dietitian_user
        patient_user.save()

        # Profil pacjenta (Mężczyzna)
        profile, _ = PatientProfile.objects.get_or_create(
            user=patient_user,
            defaults={
                'current_weight': Decimal('85.5'),
                'target_weight': Decimal('75.0'),
                'height': Decimal('180.0'),
                'gender': 'male',
                'daily_calories_goal': 2100,
                'protein_goal_g': Decimal('150.0'),
                'fat_goal_g': Decimal('65.0'),
                'carbs_goal_g': Decimal('230.0'),
                'meals_per_day': 4,
                'official_recommendations': '1. Regularne posiłki co 3.5h.\n2. Minimum 2.5 l wody.\n3. Pilnowanie gramatury mięsa i ryżu.',
            }
        )
        profile.gender = 'male'
        profile.save()

        # Pacjentka testowa (Kobieta)
        pacjentka_user, _ = User.objects.get_or_create(
            email='pacjentka@adonis.app',
            defaults={
                'username': 'pacjentka',
                'first_name': 'Anna',
                'last_name': 'Nowak',
                'role': UserRole.PATIENT,
                'assigned_dietitian': dietitian_user
            }
        )
        pacjentka_user.set_password('Pacjent123!')
        pacjentka_user.assigned_dietitian = dietitian_user
        pacjentka_user.save()

        pacjentka_profile, _ = PatientProfile.objects.get_or_create(
            user=pacjentka_user,
            defaults={
                'current_weight': Decimal('62.0'),
                'target_weight': Decimal('58.0'),
                'height': Decimal('168.0'),
                'gender': 'female',
                'daily_calories_goal': 1600,
                'protein_goal_g': Decimal('110.0'),
                'fat_goal_g': Decimal('50.0'),
                'carbs_goal_g': Decimal('180.0'),
                'meals_per_day': 4,
                'official_recommendations': '1. Picie minimum 2 l wody mineralnej dziennie.\n2. Lekkostrawne kolacje do 19:30.',
            }
        )
        pacjentka_profile.gender = 'female'
        pacjentka_profile.save()

        self.stdout.write(self.style.SUCCESS("[OK] Utworzono konta testowe (admin@adonis.app, dietetyk@adonis.app, pacjent@adonis.app [Mężczyzna], pacjentka@adonis.app [Kobieta])"))

        # 2. Baza produktów Lidl i Biedronka
        products_map = {}
        for item in PRODUCTS_CATALOG:
            prod, _ = Product.objects.update_or_create(
                barcode=item["barcode"],
                defaults={
                    "name": item["name"],
                    "store": item["store"],
                    "brand": item["brand"],
                    "calories_per_100g": Decimal(str(item["calories"])),
                    "protein_per_100g": Decimal(str(item["protein"])),
                    "fat_per_100g": Decimal(str(item["fat"])),
                    "carbs_per_100g": Decimal(str(item["carbs"])),
                    "unit": item["unit"],
                    "category": item["category"],
                    "source": "local"
                }
            )
            products_map[item["name"]] = prod

        self.stdout.write(self.style.SUCCESS(f"[OK] Wgrano {len(products_map)} produktów z sieci Lidl i Biedronka"))

        # 3. Przepisy fitness i diety specjalistyczne ze zdjęciami
        # Usuwamy sztucznie numerowane powtarzające się receptury z '#' w tytule
        del_count, _ = Recipe.objects.filter(title__contains='#').delete()
        if del_count > 0:
            self.stdout.write(self.style.NOTICE(f"[OK] Usunięto {del_count} powtarzających się sztucznych receptur (#)"))

        recipes_data = generate_fitness_recipes()
        created_recipes_count = 0

        for r_data in recipes_data:
            recipe, created = Recipe.objects.update_or_create(
                title=r_data["title"],
                defaults={
                    "category": r_data["category"],
                    "preparation_time_minutes": r_data["prep_time"],
                    "instructions": r_data["instructions"],
                    "default_portions": Decimal('1.0'),
                    "image_url": r_data.get("image_url", ""),
                    "created_by": dietitian_user,
                    "is_verified": True
                }
            )

            recipe.ingredients.all().delete()
            for ing_name, amount in r_data["ingredients"]:
                prod = products_map.get(ing_name)
                if prod:
                    amt_base = float(amount)
                    amt_f = round(amt_base * 0.82 / 5.0) * 5.0
                    if amt_f < 5.0 and amt_base >= 5.0:
                        amt_f = 5.0
                    amt_m = round(amt_base * 1.18 / 5.0) * 5.0
                    if amt_m < 5.0 and amt_base >= 5.0:
                        amt_m = 5.0

                    RecipeIngredient.objects.create(
                        recipe=recipe,
                        product=prod,
                        amount_g=Decimal(str(amt_base)),
                        amount_female_g=Decimal(str(amt_f)),
                        amount_male_g=Decimal(str(amt_m)),
                        unit=prod.unit
                    )
            recipe.recalculate_macros_from_ingredients()
            created_recipes_count += 1

        self.stdout.write(self.style.SUCCESS(f"[OK] Zaktualizowano i przeliczono makroskładniki (z podziałem na płeć) dla {created_recipes_count} przepisów ze zdjęciami"))

        # 4. Przykładowy 7-dniowy jadłospis dla pacjenta (zminimalizowany czas gotowania)
        all_breakfasts = list(Recipe.objects.filter(category=MealCategory.BREAKFAST).order_by('preparation_time_minutes', 'id'))
        all_second = list(Recipe.objects.filter(category=MealCategory.SECOND_BREAKFAST).order_by('preparation_time_minutes', 'id'))
        all_lunches = list(Recipe.objects.filter(category=MealCategory.LUNCH).order_by('preparation_time_minutes', 'id'))
        all_dinners = list(Recipe.objects.filter(category=MealCategory.DINNER).order_by('preparation_time_minutes', 'id'))

        today = date.today()
        # Monday of current week
        week_start = today - timedelta(days=today.weekday())
        for offset in range(7):
            plan_date = week_start + timedelta(days=offset)
            daily_plan, _ = DailyMealPlan.objects.get_or_create(
                patient=patient_user,
                date=plan_date,
                defaults={
                    'dietitian': dietitian_user,
                    'notes': f'Jadłospis na {plan_date.strftime("%A, %d.%m.%Y")}.'
                }
            )
            if daily_plan.meals.count() == 0:
                idx = offset
                if all_breakfasts:
                    PlannedMeal.objects.create(daily_plan=daily_plan, recipe=all_breakfasts[idx % len(all_breakfasts)], meal_type=MealCategory.BREAKFAST, portions=1.0, order=1)
                if all_second:
                    PlannedMeal.objects.create(daily_plan=daily_plan, recipe=all_second[idx % len(all_second)], meal_type=MealCategory.SECOND_BREAKFAST, portions=1.0, order=2)
                if all_lunches:
                    PlannedMeal.objects.create(daily_plan=daily_plan, recipe=all_lunches[idx % len(all_lunches)], meal_type=MealCategory.LUNCH, portions=1.2, order=3)
                if all_dinners:
                    PlannedMeal.objects.create(daily_plan=daily_plan, recipe=all_dinners[idx % len(all_dinners)], meal_type=MealCategory.DINNER, portions=1.0, order=4)

        self.stdout.write(self.style.SUCCESS("[OK] Przypisano bieżący 7-dniowy jadłospis dla pacjent@adonis.app"))

        # 5. Pakiety i Szablony Diet (Dla Dietetyka)
        days_names = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"]

        def build_template_days(b_list, s_list, l_list, d_list, portion_mult=1.0):
            days = []
            for i in range(7):
                meals = []
                if b_list:
                    meals.append({"meal_type": MealCategory.BREAKFAST, "recipe_id": b_list[i % len(b_list)].id, "portions": portion_mult})
                if s_list:
                    meals.append({"meal_type": MealCategory.SECOND_BREAKFAST, "recipe_id": s_list[i % len(s_list)].id, "portions": portion_mult})
                if l_list:
                    meals.append({"meal_type": MealCategory.LUNCH, "recipe_id": l_list[i % len(l_list)].id, "portions": portion_mult})
                if d_list:
                    meals.append({"meal_type": MealCategory.DINNER, "recipe_id": d_list[i % len(d_list)].id, "portions": portion_mult})
                days.append({
                    "day_number": i + 1,
                    "day_name": days_names[i],
                    "meals": meals
                })
            return days

        # Filtrowanie przepisów pod diety specjalistyczne
        lek_b = [r for r in all_breakfasts if any(k in r.title.lower() for k in ['delikatna', 'jajecznica', 'jaglanka', 'owsianka'])]
        lek_s = [r for r in all_second if any(k in r.title.lower() for k in ['jabłko', 'wiejski', 'chia'])]
        lek_l = [r for r in all_lunches if any(k in r.title.lower() for k in ['parze', 'dorsz', 'pulpety', 'indyk', 'kurczak'])]
        lek_d = [r for r in all_dinners if any(k in r.title.lower() for k in ['krem', 'pszen', 'jajkiem', 'twarożek'])]

        plyn_b = [r for r in all_breakfasts if any(k in r.title.lower() for k in ['koktajl', 'kleik', 'smoothie'])]
        plyn_s = [r for r in all_second if any(k in r.title.lower() for k in ['koktajl', 'mus', 'shake', 'jogurt'])]
        plyn_l = [r for r in all_lunches if any(k in r.title.lower() for k in ['krem', 'blendowan'])]
        plyn_d = [r for r in all_dinners if any(k in r.title.lower() for k in ['krem', 'shake', 'zupa'])]

        cu_b = [r for r in all_breakfasts if any(k in r.title.lower() for k in ['colitis', 'miękko', 'manna', 'ryżowy'])]
        cu_s = [r for r in all_second if any(k in r.title.lower() for k in ['colitis', 'bananem', 'kisiel', 'jabłko'])]
        cu_l = [r for r in all_lunches if any(k in r.title.lower() for k in ['białym ryżem', 'purée', 'pergaminie'])]
        cu_d = [r for r in all_dinners if any(k in r.title.lower() for k in ['dyni', 'marchewki', 'ryżu'])]

        # Przepisy WZJG bez laktozy
        all_snacks = list(Recipe.objects.filter(category=MealCategory.SNACK))
        wzjg_lf_b = [r for r in all_breakfasts if '(wzjg)' in r.title.lower()]
        wzjg_lf_s = [r for r in all_second if '(wzjg)' in r.title.lower()]
        wzjg_lf_l = [r for r in all_lunches if '(wzjg)' in r.title.lower()]
        wzjg_lf_sn = [r for r in all_snacks if '(wzjg)' in r.title.lower()]
        wzjg_lf_d = [r for r in all_dinners if '(wzjg)' in r.title.lower()]

        def build_template_days_5(b_list, s_list, l_list, sn_list, d_list, portion_mult=1.0):
            days = []
            for i in range(7):
                meals = []
                if b_list:
                    meals.append({"meal_type": MealCategory.BREAKFAST, "recipe_id": b_list[i % len(b_list)].id, "portions": portion_mult})
                if s_list:
                    meals.append({"meal_type": MealCategory.SECOND_BREAKFAST, "recipe_id": s_list[i % len(s_list)].id, "portions": portion_mult})
                if l_list:
                    meals.append({"meal_type": MealCategory.LUNCH, "recipe_id": l_list[i % len(l_list)].id, "portions": portion_mult})
                if sn_list:
                    meals.append({"meal_type": MealCategory.SNACK, "recipe_id": sn_list[i % len(sn_list)].id, "portions": portion_mult})
                if d_list:
                    meals.append({"meal_type": MealCategory.DINNER, "recipe_id": d_list[i % len(d_list)].id, "portions": portion_mult})
                days.append({
                    "day_number": i + 1,
                    "day_name": days_names[i],
                    "meals": meals
                })
            return days

        templates_list = []

        # --- PAKIETY DLA KOBIET (target_gender='female') ---
        t_f1, _ = DietPlanTemplate.objects.update_or_create(
            name="[KOBIETA] Dieta Redukcyjna 1500 kcal",
            defaults={
                "dietitian": dietitian_user,
                "category": "Dieta redukcyjna",
                "target_gender": "female",
                "description": "Zbilansowany jadłospis redukcyjny dedykowany dla kobiet z porcjami dostosowanymi do niższego zapotrzebowania energetycznego (1500 kcal). Bogaty w warzywa, pełnoziarniste produkty i lekkie źródła białka.",
                "target_calories": 1500,
                "meals_per_day": 4,
                "days_data": build_template_days(all_breakfasts[:7], all_second[:7], all_lunches[:7], all_dinners[:7], portion_mult=0.85)
            }
        )
        templates_list.append((t_f1, "female"))

        t_f2, _ = DietPlanTemplate.objects.update_or_create(
            name="[KOBIETA] Dieta Lekkostrawna 1600 kcal",
            defaults={
                "dietitian": dietitian_user,
                "category": "Dieta lekkostrawna",
                "target_gender": "female",
                "description": "Łagodna, regeneracyjna dieta dla kobiet oparta na gotowaniu na parze i duszeniu. Nie obciąża żołądka, wspomaga witalność i lekkość po posiłkach.",
                "target_calories": 1600,
                "meals_per_day": 4,
                "days_data": build_template_days(lek_b or all_breakfasts, lek_s or all_second, lek_l or all_lunches, lek_d or all_dinners, portion_mult=0.85)
            }
        )
        templates_list.append((t_f2, "female"))

        t_f3, _ = DietPlanTemplate.objects.update_or_create(
            name="[KOBIETA] Dieta WZJG / Colitis Ulcerosa (Bez Laktozy) 1650 kcal",
            defaults={
                "dietitian": dietitian_user,
                "category": "Colitis ulcerosa - Bez laktozy",
                "target_gender": "female",
                "description": "Specjalistyczny 5-posiłkowy jadłospis dla kobiet z wrzodziejącym zapaleniem jelita grubego z nabiałem bezlaktozowym. Ograniczony błonnik nierozpuszczalny, łagodne posiłki chroniące śluzówkę jelit.",
                "target_calories": 1650,
                "meals_per_day": 5,
                "days_data": build_template_days_5(wzjg_lf_b or cu_b or all_breakfasts, wzjg_lf_s or cu_s or all_second, wzjg_lf_l or cu_l or all_lunches, wzjg_lf_sn or all_snacks, wzjg_lf_d or cu_d or all_dinners, portion_mult=0.85)
            }
        )
        templates_list.append((t_f3, "female"))

        t_f4, _ = DietPlanTemplate.objects.update_or_create(
            name="[KOBIETA] Pakiet Fit & Active 1750 kcal",
            defaults={
                "dietitian": dietitian_user,
                "category": "Dieta zbilansowana",
                "target_gender": "female",
                "description": "Energetyczny pakiet dla aktywnych kobiet uprawiających fitness, bieganie lub jogę. Zapewnia optymalną regenerację i stabilny poziom cukru we krwi.",
                "target_calories": 1750,
                "meals_per_day": 4,
                "days_data": build_template_days(all_breakfasts, all_second, all_lunches, all_dinners, portion_mult=0.9)
            }
        )
        templates_list.append((t_f4, "female"))

        # --- PAKIETY DLA MĘŻCZYZN (target_gender='male') ---
        t_m1, _ = DietPlanTemplate.objects.update_or_create(
            name="[MĘŻCZYZNA] Dieta Redukcyjna 2000 kcal",
            defaults={
                "dietitian": dietitian_user,
                "category": "Dieta redukcyjna",
                "target_gender": "male",
                "description": "Męski jadłospis redukcyjny z powiększoną gramaturą chudego mięsa i ryb (2000 kcal). Skutecznie spala tkankę tłuszczową bez utraty wypracowanej tkanki mięśniowej.",
                "target_calories": 2000,
                "meals_per_day": 4,
                "days_data": build_template_days(all_breakfasts[:7], all_second[:7], all_lunches[:7], all_dinners[:7], portion_mult=1.15)
            }
        )
        templates_list.append((t_m1, "male"))

        t_m2, _ = DietPlanTemplate.objects.update_or_create(
            name="[MĘŻCZYZNA] Dieta Lekkostrawna 2100 kcal",
            defaults={
                "dietitian": dietitian_user,
                "category": "Dieta lekkostrawna",
                "target_gender": "male",
                "description": "Regeneracyjna dieta lekkostrawna dla mężczyzn. Zapewnia wysoką gęstość odżywczą i 2100 kcal przy maksymalnym oszczędzaniu układu pokarmowego.",
                "target_calories": 2100,
                "meals_per_day": 4,
                "days_data": build_template_days(lek_b or all_breakfasts, lek_s or all_second, lek_l or all_lunches, lek_d or all_dinners, portion_mult=1.15)
            }
        )
        templates_list.append((t_m2, "male"))

        t_m3, _ = DietPlanTemplate.objects.update_or_create(
            name="[MĘŻCZYZNA] Dieta WZJG / Colitis Ulcerosa (Bez Laktozy) 2150 kcal",
            defaults={
                "dietitian": dietitian_user,
                "category": "Colitis ulcerosa - Bez laktozy",
                "target_gender": "male",
                "description": "Specjalistyczny 5-posiłkowy jadłospis bezlaktozowy dla mężczyzn z WZJG (2150 kcal). Większe porcje białka bezlaktozowego wspomagają regenerację.",
                "target_calories": 2150,
                "meals_per_day": 5,
                "days_data": build_template_days_5(wzjg_lf_b or cu_b or all_breakfasts, wzjg_lf_s or cu_s or all_second, wzjg_lf_l or cu_l or all_lunches, wzjg_lf_sn or all_snacks, wzjg_lf_d or cu_d or all_dinners, portion_mult=1.15)
            }
        )
        templates_list.append((t_m3, "male"))

        t_m4, _ = DietPlanTemplate.objects.update_or_create(
            name="[MĘŻCZYZNA] Pakiet Wysokobiałkowy Siła & Masa 2400 kcal",
            defaults={
                "dietitian": dietitian_user,
                "category": "Dieta wysokobiałkowa",
                "target_gender": "male",
                "description": "Maksymalna budowa formy fizycznej: ponad 170g pełnowartościowego białka dziennie, węglowodany złożone i 2400 kcal dla aktywnych mężczyzn.",
                "target_calories": 2400,
                "meals_per_day": 4,
                "days_data": build_template_days(all_breakfasts, all_second, all_lunches, all_dinners, portion_mult=1.20)
            }
        )
        templates_list.append((t_m4, "male"))

        # --- PAKIETY UNIWERSALNE (target_gender='all') ---
        t_all1, _ = DietPlanTemplate.objects.update_or_create(
            name="Dieta płynna i półpłynna (odżywcza)",
            defaults={
                "dietitian": dietitian_user,
                "category": "Dieta płynna",
                "target_gender": "all",
                "description": "Aksamitne zupy kremy, odżywcze koktajle białkowe i gładkie musy dla pacjentów po zabiegach lub z trudnościami w połykaniu.",
                "target_calories": 1850,
                "meals_per_day": 4,
                "days_data": build_template_days(plyn_b or all_breakfasts, plyn_s or all_second, plyn_l or all_lunches, plyn_d or all_dinners, portion_mult=1.0)
            }
        )
        templates_list.append((t_all1, "all"))

        t_all2, _ = DietPlanTemplate.objects.update_or_create(
            name="Dieta dla osób z Colitis ulcerosa (Wrzodziejące zapalenie jelita)",
            defaults={
                "dietitian": dietitian_user,
                "category": "Colitis ulcerosa",
                "target_gender": "all",
                "description": "Dieta łatwostrawna z ograniczeniem błonnika nierozpuszczalnego, bez pestek i skórki, bogata w przeciwzapalne kwasy Omega-3 i łagodne białko.",
                "target_calories": 1950,
                "meals_per_day": 4,
                "days_data": build_template_days(cu_b or all_breakfasts, cu_s or all_second, cu_l or all_lunches, cu_d or all_dinners, portion_mult=1.0)
            }
        )
        templates_list.append((t_all2, "all"))

        # Rejestracja przypisań pakietów do pacjentów według płci
        start_d = today
        end_d = today + timedelta(days=28)
        for tpl, target_g in templates_list:
            if target_g in ("female", "all"):
                if not DietPlanTemplateAssignment.objects.filter(template=tpl, patient=pacjentka_user).exists():
                    DietPlanTemplateAssignment.objects.create(
                        template=tpl,
                        patient=pacjentka_user,
                        dietitian=dietitian_user,
                        start_date=start_d,
                        end_date=end_d,
                        notes=f"Pakiet przesłany przez dietetyka dla pacjentki: {tpl.name}"
                    )
            if target_g in ("male", "all"):
                if not DietPlanTemplateAssignment.objects.filter(template=tpl, patient=patient_user).exists():
                    DietPlanTemplateAssignment.objects.create(
                        template=tpl,
                        patient=patient_user,
                        dietitian=dietitian_user,
                        start_date=start_d,
                        end_date=end_d,
                        notes=f"Pakiet przesłany przez dietetyka dla pacjenta: {tpl.name}"
                    )

        self.stdout.write(self.style.SUCCESS(f"[OK] Utworzono {len(templates_list)} dedykowanych pakietów diet z podziałem na płeć (Kobiety, Mężczyźni, Uniwersalne) i przypisano je do kont pacjentów!"))

        # Wymóg 10: w zaleceniach zapisz tytuł bieżącego jadłospisu i date wprowadzenia, oraz historię przesłanych jadlospisów
        from apps.authentication.models import PatientRecommendation

        # Dla pacjenta (Marek Nowak)
        male_plan_title = "[MĘŻCZYZNA] Dieta Redukcyjna 2000 kcal"
        male_intro_date = start_d.strftime("%d.%m.%Y")
        male_history_text = "\n".join([f"• {t.name} (od {start_d.strftime('%d.%m.%Y')}, dodano: {today.strftime('%d.%m.%Y')})" for t, g in templates_list if g in ("male", "all")])
        profile.official_recommendations = (
            f"📌 BIEŻĄCY JADŁOSPIS: {male_plan_title}\n"
            f"📅 Data wprowadzenia: {male_intro_date} (obowiązuje od {start_d.strftime('%d.%m.%Y')} do {end_d.strftime('%d.%m.%Y')})\n"
            f"----------------------------------------\n"
            f"💡 ZALECENIA DIETETYKA:\n"
            f"1. Regularne posiłki co 3.5h – minimalny czas spędzony w kuchni!\n"
            f"2. Minimum 2.5 l wody mineralnej dziennie.\n"
            f"3. Pilnowanie gramatury mięsa, ryb i pieczywa zgodnie z rozpiską.\n\n"
            f"📜 HISTORIA PRZESŁANYCH JADŁOSPISÓW:\n"
            f"{male_history_text}"
        )
        profile.save(update_fields=['official_recommendations'])

        PatientRecommendation.objects.get_or_create(
            patient=patient_user,
            title=f"Wdrożenie: {male_plan_title}",
            defaults={
                'dietitian': dietitian_user,
                'content': f"Wdrożono jadłospis '{male_plan_title}' z datą wprowadzenia: {male_intro_date}. Minimalna ilość gotowania na co dzień."
            }
        )

        # Dla pacjentki (Anna Nowak)
        female_plan_title = "[KOBIETA] Dieta Redukcyjna 1500 kcal"
        female_intro_date = start_d.strftime("%d.%m.%Y")
        female_history_text = "\n".join([f"• {t.name} (od {start_d.strftime('%d.%m.%Y')}, dodano: {today.strftime('%d.%m.%Y')})" for t, g in templates_list if g in ("female", "all")])
        pacjentka_profile.official_recommendations = (
            f"📌 BIEŻĄCY JADŁOSPIS: {female_plan_title}\n"
            f"📅 Data wprowadzenia: {female_intro_date} (obowiązuje od {start_d.strftime('%d.%m.%Y')} do {end_d.strftime('%d.%m.%Y')})\n"
            f"----------------------------------------\n"
            f"💡 ZALECENIA DIETETYKA:\n"
            f"1. Picie minimum 2 l wody mineralnej dziennie.\n"
            f"2. Szybkie, lekkostrawne posiłki – minimalny nakład czasu na gotowanie.\n"
            f"3. Kolacje najpóźniej do 19:30.\n\n"
            f"📜 HISTORIA PRZESŁANYCH JADŁOSPISÓW:\n"
            f"{female_history_text}"
        )
        pacjentka_profile.save(update_fields=['official_recommendations'])

        PatientRecommendation.objects.get_or_create(
            patient=pacjentka_user,
            title=f"Wdrożenie: {female_plan_title}",
            defaults={
                'dietitian': dietitian_user,
                'content': f"Wdrożono jadłospis '{female_plan_title}' z datą wprowadzenia: {female_intro_date}. Szybkie posiłki z minimalnym czasem w kuchni."
            }
        )



        # 6. Pomiary i Audit Log
        m1, _ = Measurement.objects.get_or_create(
            patient=patient_user,
            date=today - timedelta(days=7),
            defaults={'weight': Decimal('87.0'), 'waist_cm': Decimal('94.0'), 'notes': 'Pomiary startowe'}
        )
        m2, _ = Measurement.objects.get_or_create(
            patient=patient_user,
            date=today,
            defaults={'weight': Decimal('85.5'), 'waist_cm': Decimal('92.5'), 'notes': 'Ważenie poranne na czczo'}
        )
        MeasurementAuditLog.objects.get_or_create(
            measurement=m1,
            field_name='weight',
            defaults={
                'changed_by': dietitian_user,
                'old_value': '88.0',
                'new_value': '87.0',
                'reason': 'Korekta błędu wpisania wagi przez pacjenta po kalibracji wagi'
            }
        )

        self.stdout.write(self.style.SUCCESS("[OK] Wgrano historię pomiarów ciała oraz wpisy historii audytu (Audit Log)"))
        self.stdout.write(self.style.SUCCESS("=== Inicjalizacja Adonis zakończona pełnym sukcesem! ==="))
