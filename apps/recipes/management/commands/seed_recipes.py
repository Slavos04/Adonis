from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decimal import Decimal
from datetime import date, timedelta
from apps.authentication.models import UserRole, PatientProfile
from apps.recipes.models import Product, Recipe, RecipeIngredient, StoreChoice, MealCategory
from apps.recipes.fixtures_data import PRODUCTS_CATALOG, generate_fitness_recipes
from apps.diet_plans.models import DailyMealPlan, PlannedMeal, DietPlanTemplate
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

        # Profil pacjenta
        profile, _ = PatientProfile.objects.get_or_create(
            user=patient_user,
            defaults={
                'current_weight': Decimal('85.5'),
                'target_weight': Decimal('75.0'),
                'height': Decimal('180.0'),
                'daily_calories_goal': 2100,
                'protein_goal_g': Decimal('150.0'),
                'fat_goal_g': Decimal('65.0'),
                'carbs_goal_g': Decimal('230.0'),
                'meals_per_day': 4,
                'official_recommendations': '1. Regularne posiłki co 3.5h.\n2. Minimum 2.5 l wody.\n3. Pilnowanie gramatury mięsa i ryżu.',
            }
        )

        self.stdout.write(self.style.SUCCESS("[OK] Utworzono konta testowe (admin@adonis.app, dietetyk@adonis.app, pacjent@adonis.app)"))

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
                    RecipeIngredient.objects.create(
                        recipe=recipe,
                        product=prod,
                        amount_g=Decimal(str(amount)),
                        unit=prod.unit
                    )
            recipe.recalculate_macros_from_ingredients()
            created_recipes_count += 1

        self.stdout.write(self.style.SUCCESS(f"[OK] Zaktualizowano i przeliczono makroskładniki dla {created_recipes_count} przepisów ze zdjęciami"))

        # 4. Przykładowy 7-dniowy jadłospis dla pacjenta
        all_breakfasts = list(Recipe.objects.filter(category=MealCategory.BREAKFAST))
        all_second = list(Recipe.objects.filter(category=MealCategory.SECOND_BREAKFAST))
        all_lunches = list(Recipe.objects.filter(category=MealCategory.LUNCH))
        all_dinners = list(Recipe.objects.filter(category=MealCategory.DINNER))

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

        def build_template_days(b_list, s_list, l_list, d_list):
            days = []
            for i in range(7):
                meals = []
                if b_list:
                    meals.append({"meal_type": MealCategory.BREAKFAST, "recipe_id": b_list[i % len(b_list)].id, "portions": 1.0})
                if s_list:
                    meals.append({"meal_type": MealCategory.SECOND_BREAKFAST, "recipe_id": s_list[i % len(s_list)].id, "portions": 1.0})
                if l_list:
                    meals.append({"meal_type": MealCategory.LUNCH, "recipe_id": l_list[i % len(l_list)].id, "portions": 1.0})
                if d_list:
                    meals.append({"meal_type": MealCategory.DINNER, "recipe_id": d_list[i % len(d_list)].id, "portions": 1.0})
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

        # Tworzenie szablonów pakietów diet
        all_snacks = list(Recipe.objects.filter(category=MealCategory.SNACK))
        wzjg_lf_b = [r for r in all_breakfasts if '(wzjg)' in r.title.lower()]
        wzjg_lf_s = [r for r in all_second if '(wzjg)' in r.title.lower()]
        wzjg_lf_l = [r for r in all_lunches if '(wzjg)' in r.title.lower()]
        wzjg_lf_sn = [r for r in all_snacks if '(wzjg)' in r.title.lower()]
        wzjg_lf_d = [r for r in all_dinners if '(wzjg)' in r.title.lower()]

        def build_template_days_5(b_list, s_list, l_list, sn_list, d_list):
            days = []
            for i in range(7):
                meals = []
                if b_list:
                    meals.append({"meal_type": MealCategory.BREAKFAST, "recipe_id": b_list[i % len(b_list)].id, "portions": 1.0})
                if s_list:
                    meals.append({"meal_type": MealCategory.SECOND_BREAKFAST, "recipe_id": s_list[i % len(s_list)].id, "portions": 1.0})
                if l_list:
                    meals.append({"meal_type": MealCategory.LUNCH, "recipe_id": l_list[i % len(l_list)].id, "portions": 1.0})
                if sn_list:
                    meals.append({"meal_type": MealCategory.SNACK, "recipe_id": sn_list[i % len(sn_list)].id, "portions": 1.0})
                if d_list:
                    meals.append({"meal_type": MealCategory.DINNER, "recipe_id": d_list[i % len(d_list)].id, "portions": 1.0})
                days.append({
                    "day_number": i + 1,
                    "day_name": days_names[i],
                    "meals": meals
                })
            return days

        DietPlanTemplate.objects.update_or_create(
            name="Dieta dla osób z WZJG z nabiałem bez laktozy (Colitis ulcerosa)",
            defaults={
                "dietitian": dietitian_user,
                "category": "Colitis ulcerosa - Bez laktozy",
                "description": "Specjalistyczny 7-dniowy jadłospis dla pacjentów z wrzodziejącym zapaleniem jelita grubego (WZJG), w którym tradycyjny nabiał zastąpiono produktami bezlaktozowymi (mleko, twaróg, serek wiejski, kefir, jogurt bez laktozy). Potrawy lekkostrawne, o obniżonej zawartości błonnika nierozpuszczalnego, wspierające gojenie śluzówki jelit bez fermentacji i wzdęć.",
                "target_calories": 2000,
                "meals_per_day": 5,
                "days_data": build_template_days_5(wzjg_lf_b or cu_b or all_breakfasts, wzjg_lf_s or cu_s or all_second, wzjg_lf_l or cu_l or all_lunches, wzjg_lf_sn or all_snacks, wzjg_lf_d or cu_d or all_dinners)
            }
        )

        DietPlanTemplate.objects.update_or_create(
            name="Dieta lekkostrawna (regeneracyjna)",
            defaults={
                "dietitian": dietitian_user,
                "category": "Dieta lekkostrawna",
                "description": "Zrównoważony, łagodny jadłospis oparty na gotowaniu na parze i duszeniu, nieobciążający żołądka ani jelit.",
                "target_calories": 1900,
                "meals_per_day": 4,
                "days_data": build_template_days(lek_b or all_breakfasts, lek_s or all_second, lek_l or all_lunches, lek_d or all_dinners)
            }
        )

        DietPlanTemplate.objects.update_or_create(
            name="Dieta płynna i półpłynna (odżywcza)",
            defaults={
                "dietitian": dietitian_user,
                "category": "Dieta płynna",
                "description": "Aksamitne zupy kremy, odżywcze koktajle białkowe i gładkie musy dla pacjentów po zabiegach lub z trudnościami w połykaniu.",
                "target_calories": 1850,
                "meals_per_day": 4,
                "days_data": build_template_days(plyn_b or all_breakfasts, plyn_s or all_second, plyn_l or all_lunches, plyn_d or all_dinners)
            }
        )

        DietPlanTemplate.objects.update_or_create(
            name="Dieta dla osób z Colitis ulcerosa (Wrzodziejące zapalenie jelita)",
            defaults={
                "dietitian": dietitian_user,
                "category": "Colitis ulcerosa",
                "description": "Dieta łatwostrawna z ograniczeniem błonnika nierozpuszczalnego, bez pestek i skórki, bogata w przeciwzapalne kwasy Omega-3 i łagodne białko.",
                "target_calories": 1950,
                "meals_per_day": 4,
                "days_data": build_template_days(cu_b or all_breakfasts, cu_s or all_second, cu_l or all_lunches, cu_d or all_dinners)
            }
        )

        DietPlanTemplate.objects.update_or_create(
            name="Pakiet Redukcyjny 1800 kcal (Biedronka & Lidl)",
            defaults={
                "dietitian": dietitian_user,
                "category": "Dieta niskokaloryczna",
                "description": "Zbilansowana dieta z deficytem kalorycznym oparta na tanich i łatwo dostępnych produktach z dyskontów.",
                "target_calories": 1800,
                "meals_per_day": 4,
                "days_data": build_template_days(all_breakfasts[:7], all_second[:7], all_lunches[:7], all_dinners[:7])
            }
        )

        DietPlanTemplate.objects.update_or_create(
            name="Pakiet Wysokobiałkowy Fit 2200 kcal",
            defaults={
                "dietitian": dietitian_user,
                "category": "Dieta wysokobiałkowa",
                "description": "Bogaty w białko plan (powyżej 150g białka/dzień) do budowy beztłuszczowej masy mięśniowej i regeneracji.",
                "target_calories": 2200,
                "meals_per_day": 4,
                "days_data": build_template_days(all_breakfasts, all_second, all_lunches, all_dinners)
            }
        )

        self.stdout.write(self.style.SUCCESS("[OK] Utworzono i zaktualizowano gotowe pakiety diet (WZJG bez laktozy, Lekkostrawna, Płynna, Colitis ulcerosa, Redukcyjna, Wysokobiałkowa)"))


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
