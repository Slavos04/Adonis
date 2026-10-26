## ==============================================================================
## MODUŁ UWIERZYTELNIANIA, PROFILU I BEZPIECZEŃSTWA (RBAC & JWT)
## Zarządza logowaniem, rejestracją, odświeżaniem sesji (Dual-layer JWT: Cookies/Bearer),
## profilami pacjentów, celami kalorycznymi i procedurą bezpiecznego resetu hasła.
## ==============================================================================

from ninja import Router
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.utils import timezone
from ninja.errors import HttpError
from typing import List

from .models import (
    User, UserRole, PatientProfile, PatientRecommendation,
    UserNotificationSettings, PasswordResetToken
)
from .schemas import (
    LoginSchema, RegisterSchema, UserOutSchema,
    PatientProfileOutSchema, PatientProfileUpdateSchema, AuthResponseSchema,
    PatientRecommendationOutSchema, AddRecommendationSchema, AdminUpdateUserSchema,
    UserNotificationSettingsSchema, ChangePasswordSchema, ForgotPasswordSchema, ResetPasswordSchema
)
from .security import (
    generate_jwt_token, set_auth_cookie, clear_auth_cookie, JWTAuth
)

router = Router(tags=["Uwierzytelnianie"])

def serialize_user(user: User) -> dict:
    dietitian_name = None
    if user.assigned_dietitian:
        dietitian_name = user.assigned_dietitian.get_full_name() or user.assigned_dietitian.email
        
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role,
        "avatar_url": user.avatar_url,
        "phone_number": user.phone_number,
        "assigned_dietitian_id": user.assigned_dietitian_id,
        "assigned_dietitian_name": dietitian_name,
        "is_active": user.is_active,
    }

def serialize_profile(profile: PatientProfile) -> dict:
    if not profile:
        return None
    return {
        "current_weight": float(profile.current_weight),
        "target_weight": float(profile.target_weight),
        "height": float(profile.height),
        "birth_date": profile.birth_date,
        "gender": profile.gender,
        "activity_level": profile.activity_level,
        "daily_calories_goal": profile.daily_calories_goal,
        "protein_goal_g": float(profile.protein_goal_g),
        "fat_goal_g": float(profile.fat_goal_g),
        "carbs_goal_g": float(profile.carbs_goal_g),
        "meals_per_day": profile.meals_per_day,
        "official_recommendations": profile.official_recommendations,
        "recommendations_updated_at": profile.recommendations_updated_at,
    }

@router.post("/login", response=AuthResponseSchema, auth=None)
def login(request, payload: LoginSchema, response: HttpResponse):
    """
    Logowanie tradycyjne (Email/Login i Hasło).
    Ustawia bezpieczne ciasteczko HttpOnly dla Weba oraz zwraca token w JSON dla aplikacji Android.
    """
    # Sprawdzenie po emailu lub username (case-insensitive i strip whitespace)
    clean_login = (payload.email or "").strip()
    clean_password = (payload.password or "").strip()
    user = User.objects.filter(email__iexact=clean_login).first()
    if not user:
        user = User.objects.filter(username__iexact=clean_login).first()
        
    if not user or not (user.check_password(payload.password) or (clean_password and user.check_password(clean_password))):
        raise HttpError(401, "Nieprawidłowy adres e-mail lub hasło.")

    if not user.is_active:
        raise HttpError(403, "Konto zostało zablokowane.")

    token = generate_jwt_token(user)
    
    # Ustawienie ciasteczka HttpOnly dla aplikacji Webowej
    is_secure = not request.get_host().startswith("localhost") and not request.get_host().startswith("127.0.0.1")
    set_auth_cookie(response, token, secure=is_secure)

    profile_data = None
    if hasattr(user, 'patient_profile'):
        profile_data = serialize_profile(user.patient_profile)

    return {
        "token": token,
        "user": serialize_user(user),
        "profile": profile_data,
        "message": "Zalogowano pomyślnie."
    }

@router.post("/register", response=AuthResponseSchema, auth=None)
def register(request, payload: RegisterSchema, response: HttpResponse):
    """Rejestracja nowego użytkownika z automatycznym utworzeniem profilu pacjenta."""
    clean_email = (payload.email or "").strip().lower()
    if User.objects.filter(email__iexact=clean_email).exists():
        raise HttpError(400, "Użytkownik o podanym adresie e-mail już istnieje.")

    username = payload.username or clean_email.split('@')[0]
    # Unikalny username
    base_username = username
    counter = 1
    while User.objects.filter(username__iexact=username).exists():
        username = f"{base_username}{counter}"
        counter += 1

    role = payload.role if payload.role in [UserRole.PATIENT, UserRole.DIETITIAN, UserRole.ADMIN] else UserRole.PATIENT

    user = User.objects.create_user(
        email=clean_email,
        username=username,
        password=payload.password,
        first_name=payload.first_name or "",
        last_name=payload.last_name or "",
        role=role
    )

    profile_data = None
    if role == UserRole.PATIENT:
        profile = PatientProfile.objects.create(
            user=user,
            current_weight=75.0,
            target_weight=70.0,
            height=175.0,
            daily_calories_goal=2000,
            protein_goal_g=140.0,
            fat_goal_g=60.0,
            carbs_goal_g=220.0,
            meals_per_day=4,
            official_recommendations="Witaj w Adonis! Twój dietetyk wkrótce przygotuje spersonalizowane zalecenia."
        )
        profile_data = serialize_profile(profile)

    token = generate_jwt_token(user)
    is_secure = not request.get_host().startswith("localhost") and not request.get_host().startswith("127.0.0.1")
    set_auth_cookie(response, token, secure=is_secure)

    return {
        "token": token,
        "user": serialize_user(user),
        "profile": profile_data,
        "message": "Konto zostało pomyślnie utworzone."
    }

@router.post("/logout", auth=None)
def logout(request, response: HttpResponse):
    """Wylogowanie - czyści ciasteczko sesyjne HttpOnly."""
    clear_auth_cookie(response)
    return {"message": "Wylogowano pomyślnie."}

@router.get("/me", auth=JWTAuth())
def get_current_user_profile(request):
    """Zwraca dane aktualnie zalogowanego użytkownika na podstawie ciasteczka lub Bearer tokenu."""
    user = request.auth_user
    profile_data = None
    if hasattr(user, 'patient_profile'):
        profile_data = serialize_profile(user.patient_profile)
    return {
        "user": serialize_user(user),
        "profile": profile_data
    }

@router.get("/patients", response=List[UserOutSchema], auth=JWTAuth())
def list_patients(request):
    """Dla dietetyków i administratorów: lista przypisanych pacjentów."""
    user = request.auth_user
    if user.role == UserRole.ADMIN:
        patients = User.objects.filter(role=UserRole.PATIENT)
    elif user.role == UserRole.DIETITIAN:
        patients = User.objects.filter(role=UserRole.PATIENT, assigned_dietitian=user)
    else:
        raise HttpError(403, "Brak uprawnień do przeglądania listy pacjentów.")

    return [serialize_user(p) for p in patients]

@router.get("/dietitians", response=List[UserOutSchema], auth=JWTAuth())
def list_dietitians(request):
    """Lista aktywnych dietetyków w systemie."""
    dietitians = User.objects.filter(role=UserRole.DIETITIAN, is_active=True)
    return [serialize_user(d) for d in dietitians]

@router.put("/patients/{patient_id}/profile", auth=JWTAuth())
def update_patient_profile(request, patient_id: int, payload: PatientProfileUpdateSchema):
    """
    Panel dietetyka: zarządzanie parametrami i oficjalnymi zaleceniami dietetycznymi pacjenta.
    """
    current_user = request.auth_user
    target_user = User.objects.filter(id=patient_id, role=UserRole.PATIENT).first()
    if not target_user:
        raise HttpError(404, "Nie znaleziono pacjenta.")

    if current_user.role != UserRole.ADMIN and target_user.assigned_dietitian_id != current_user.id:
        raise HttpError(403, "Możesz edytować zalecenia wyłącznie swoich pacjentów.")

    profile, _ = PatientProfile.objects.get_or_create(user=target_user)

    if payload.current_weight is not None:
        profile.current_weight = payload.current_weight
    if payload.target_weight is not None:
        profile.target_weight = payload.target_weight
    if payload.height is not None:
        profile.height = payload.height
    if payload.daily_calories_goal is not None:
        profile.daily_calories_goal = payload.daily_calories_goal
    if payload.protein_goal_g is not None:
        profile.protein_goal_g = payload.protein_goal_g
    if payload.fat_goal_g is not None:
        profile.fat_goal_g = payload.fat_goal_g
    if payload.carbs_goal_g is not None:
        profile.carbs_goal_g = payload.carbs_goal_g
    if payload.meals_per_day is not None:
        profile.meals_per_day = payload.meals_per_day
    if payload.official_recommendations is not None:
        new_rec = payload.official_recommendations.strip()
        old_rec = (profile.official_recommendations or '').strip()
        profile.official_recommendations = payload.official_recommendations
        profile.recommendations_updated_at = timezone.now()
        if new_rec and new_rec != old_rec:
            dietitian = current_user if current_user.role == UserRole.DIETITIAN else (target_user.assigned_dietitian if hasattr(target_user, 'assigned_dietitian') else None)
            PatientRecommendation.objects.create(
                patient=target_user,
                dietitian=dietitian,
                title="Aktualizacja zaleceń dietetycznych",
                content=new_rec
            )
            from apps.chat.models import Notification
            Notification.objects.create(
                recipient=target_user,
                title="Nowe zalecenia dietetyczne!",
                message=f"Twój dietetyk zaktualizował oficjalne zalecenia żywieniowe: {new_rec[:150]}{'...' if len(new_rec) > 150 else ''}",
                notification_type=Notification.NotificationType.RECOMMENDATION
            )

    profile.save()

    return {
        "message": "Profil pacjenta i zalecenia dietetyczne zostały zaktualizowane.",
        "profile": serialize_profile(profile)
    }

@router.put("/me/profile", auth=JWTAuth())
def update_my_profile(request, payload: PatientProfileUpdateSchema):
    """
    Pozwala pacjentowi zaktualizować swoje podstawowe parametry (wzrost, docelową wagę, wagę bieżącą).
    """
    user = request.auth_user
    if user.role != UserRole.PATIENT:
        raise HttpError(403, "Tylko pacjent może edytować swój profil pacjenta.")

    profile, _ = PatientProfile.objects.get_or_create(user=user)
    if payload.height is not None:
        profile.height = payload.height
    if payload.current_weight is not None:
        profile.current_weight = payload.current_weight
    if payload.target_weight is not None:
        profile.target_weight = payload.target_weight
    profile.save()

    return {
        "message": "Profil pacjenta został pomyślnie zaktualizowany.",
        "profile": serialize_profile(profile)
    }

@router.get("/patients/{patient_id}/profile", auth=JWTAuth())
def get_patient_profile(request, patient_id: int):
    """Pobiera profil i parametry wskazanego pacjenta dla dietetyka lub admina."""
    current_user = request.auth_user
    target_user = User.objects.filter(id=patient_id, role=UserRole.PATIENT).first()
    if not target_user:
        raise HttpError(404, "Nie znaleziono pacjenta.")
    if current_user.role != UserRole.ADMIN and target_user.assigned_dietitian_id != current_user.id:
        raise HttpError(403, "Możesz przeglądać profil wyłącznie swoich pacjentów.")
    profile, _ = PatientProfile.objects.get_or_create(user=target_user)
    return {
        "user": serialize_user(target_user),
        "profile": serialize_profile(profile)
    }

@router.get("/me/recommendations-history", response=List[PatientRecommendationOutSchema], auth=JWTAuth())
def get_my_recommendations_history(request):
    """Pobiera historię zaleceń dla zalogowanego pacjenta."""
    current_user = request.auth_user
    recs = PatientRecommendation.objects.filter(patient=current_user).select_related('dietitian').order_by('-created_at')
    result = []
    for r in recs:
        d_name = None
        if r.dietitian:
            d_name = r.dietitian.get_full_name() or r.dietitian.email
        result.append({
            "id": r.id,
            "patient_id": r.patient_id,
            "dietitian_id": r.dietitian_id,
            "dietitian_name": d_name,
            "title": r.title,
            "content": r.content,
            "created_at": r.created_at
        })
    return result

@router.get("/patients/{patient_id}/recommendations-history", response=List[PatientRecommendationOutSchema], auth=JWTAuth())
def get_patient_recommendations_history(request, patient_id: int):
    """Pobiera historię zaleceń wskazanego pacjenta (dla Dietetyka/Admina/Pacjenta)."""
    current_user = request.auth_user
    if current_user.role not in [UserRole.ADMIN, UserRole.DIETITIAN] and current_user.id != patient_id:
        raise HttpError(403, "Brak uprawnień.")

    patient = User.objects.filter(id=patient_id).first()
    if not patient:
        raise HttpError(404, "Nie znaleziono pacjenta.")

    recs = PatientRecommendation.objects.filter(patient=patient).select_related('dietitian').order_by('-created_at')
    result = []
    for r in recs:
        d_name = None
        if r.dietitian:
            d_name = r.dietitian.get_full_name() or r.dietitian.email
        result.append({
            "id": r.id,
            "patient_id": r.patient_id,
            "dietitian_id": r.dietitian_id,
            "dietitian_name": d_name,
            "title": r.title,
            "content": r.content,
            "created_at": r.created_at
        })
    return result

@router.post("/patients/{patient_id}/recommendations", response=PatientRecommendationOutSchema, auth=JWTAuth())
def add_patient_recommendation(request, patient_id: int, payload: AddRecommendationSchema):
    """Dodaje nowy wpis do historii zaleceń pacjenta i generuje powiadomienie."""
    current_user = request.auth_user
    if current_user.role not in [UserRole.ADMIN, UserRole.DIETITIAN]:
        raise HttpError(403, "Tylko dietetyk lub administrator może dodawać zalecenia.")

    patient = User.objects.filter(id=patient_id, role=UserRole.PATIENT).first()
    if not patient:
        raise HttpError(404, "Nie znaleziono pacjenta.")

    rec = PatientRecommendation.objects.create(
        patient=patient,
        dietitian=current_user if current_user.role == UserRole.DIETITIAN else None,
        title=payload.title or "Oficjalne zalecenia dietetyczne",
        content=payload.content
    )
    profile, _ = PatientProfile.objects.get_or_create(user=patient)
    profile.official_recommendations = payload.content
    profile.recommendations_updated_at = timezone.now()
    profile.save()

    from apps.chat.models import Notification
    Notification.objects.create(
        recipient=patient,
        title="Nowe zalecenia dietetyczne!",
        message=f"Twój dietetyk dodał nowe zalecenia: {payload.content[:150]}{'...' if len(payload.content) > 150 else ''}",
        notification_type=Notification.NotificationType.RECOMMENDATION
    )

    d_name = current_user.get_full_name() or current_user.email
    return {
        "id": rec.id,
        "patient_id": rec.patient_id,
        "dietitian_id": current_user.id,
        "dietitian_name": d_name,
        "title": rec.title,
        "content": rec.content,
        "created_at": rec.created_at
    }


@router.post("/patients/{patient_id}/assign-dietitian", auth=JWTAuth())
def assign_dietitian_to_patient(request, patient_id: int, dietitian_id: int):
    """Administrator lub Dietetyk przypisuje pacjenta."""
    current_user = request.auth_user
    if current_user.role not in [UserRole.ADMIN, UserRole.DIETITIAN]:
        raise HttpError(403, "Brak uprawnień.")

    patient = User.objects.filter(id=patient_id, role=UserRole.PATIENT).first()
    if not patient:
        raise HttpError(404, "Nie znaleziono pacjenta.")

    dietitian = User.objects.filter(id=dietitian_id, role=UserRole.DIETITIAN).first()
    if not dietitian:
        raise HttpError(404, "Nie znaleziono dietetyka.")

    patient.assigned_dietitian = dietitian
    patient.save()

    return {"message": f"Pacjent {patient.email} został pomyślnie przypisany do dietetyka {dietitian.email}."}

# ─── Admin-only endpoints ─────────────────────────────────────────────────────

@router.get("/admin/users", auth=JWTAuth())
def admin_list_users(request, role: str = None):
    """Admin: pełna lista użytkowników systemu."""
    if not request.auth_user.is_admin:
        raise HttpError(403, "Tylko administrator ma dostęp do tej funkcji.")
    qs = User.objects.all().order_by('role', 'email')
    if role:
        qs = qs.filter(role=role)
    return [serialize_user(u) for u in qs]

@router.delete("/admin/users/{user_id}", auth=JWTAuth())
def admin_delete_user(request, user_id: int):
    """Admin: trwałe usunięcie konta użytkownika."""
    if not request.auth_user.is_admin:
        raise HttpError(403, "Tylko administrator ma dostęp do tej funkcji.")
    if request.auth_user.id == user_id:
        raise HttpError(400, "Nie możesz usunąć własnego konta tą metodą.")
    user = User.objects.filter(id=user_id).first()
    if not user:
        raise HttpError(404, "Nie znaleziono użytkownika.")
    email = user.email
    user.delete()
    return {"message": f"Konto {email} zostało trwale usunięte."}

@router.post("/admin/users/{user_id}/deactivate", auth=JWTAuth())
def admin_deactivate_user(request, user_id: int):
    """Admin: dezaktywacja / zablokowanie konta użytkownika."""
    if not request.auth_user.is_admin:
        raise HttpError(403, "Tylko administrator ma dostęp do tej funkcji.")
    user = User.objects.filter(id=user_id).first()
    if not user:
        raise HttpError(404, "Nie znaleziono użytkownika.")
    user.is_active = not user.is_active
    user.save(update_fields=['is_active'])
    status = "aktywowane" if user.is_active else "zablokowane"
    return {"message": f"Konto {user.email} zostało {status}.", "is_active": user.is_active}

@router.put("/admin/users/{user_id}", auth=JWTAuth())
def admin_update_user(request, user_id: int, payload: AdminUpdateUserSchema):
    """Admin: pełna edycja danych użytkownika (dane osobowe, e-mail, rola, status, przypisany dietetyk, hasło)."""
    if not request.auth_user.is_admin:
        raise HttpError(403, "Tylko administrator ma dostęp do tej funkcji.")
    user = User.objects.filter(id=user_id).first()
    if not user:
        raise HttpError(404, "Nie znaleziono użytkownika.")

    if payload.email and payload.email.strip().lower() != user.email.lower():
        new_email = payload.email.strip().lower()
        if User.objects.filter(email=new_email).exclude(id=user_id).exists():
            raise HttpError(400, "Podany adres e-mail jest już zajęty przez inne konto.")
        user.email = new_email

    if payload.first_name is not None:
        user.first_name = payload.first_name.strip()
    if payload.last_name is not None:
        user.last_name = payload.last_name.strip()
    if payload.is_active is not None:
        user.is_active = payload.is_active

    if payload.role and payload.role in [UserRole.PATIENT, UserRole.DIETITIAN, UserRole.ADMIN]:
        user.role = payload.role
        if payload.role == UserRole.PATIENT and not hasattr(user, 'patient_profile'):
            PatientProfile.objects.create(
                user=user, daily_calories_goal=2000, protein_goal_g=140, fat_goal_g=60, carbs_goal_g=220, meals_per_day=4
            )

    if payload.assigned_dietitian_id is not None:
        if payload.assigned_dietitian_id in [0, -1]:
            user.assigned_dietitian = None
        else:
            dietitian = User.objects.filter(id=payload.assigned_dietitian_id, role=UserRole.DIETITIAN).first()
            if dietitian:
                user.assigned_dietitian = dietitian

    if payload.password and len(payload.password.strip()) >= 6:
        user.set_password(payload.password.strip())

    user.save()
    return {"message": f"Konto {user.email} zostało zaktualizowane.", "user": serialize_user(user)}

@router.post("/admin/create-user", auth=JWTAuth())
def admin_create_user(request, payload: RegisterSchema):
    """Admin: tworzenie użytkownika z dowolną rolą."""
    if not request.auth_user.is_admin:
        raise HttpError(403, "Tylko administrator ma dostęp do tej funkcji.")
    if User.objects.filter(email=payload.email).exists():
        raise HttpError(400, "Użytkownik o podanym adresie e-mail już istnieje.")
    username = payload.username or payload.email.split('@')[0]
    base_username = username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1
    role = payload.role if payload.role in [UserRole.PATIENT, UserRole.DIETITIAN, UserRole.ADMIN] else UserRole.PATIENT
    user = User.objects.create_user(
        email=payload.email, username=username, password=payload.password,
        first_name=payload.first_name or "", last_name=payload.last_name or "", role=role
    )
    if role == UserRole.PATIENT:
        PatientProfile.objects.create(user=user, daily_calories_goal=2000, protein_goal_g=140, fat_goal_g=60, carbs_goal_g=220, meals_per_day=4)
    return {"message": f"Konto {user.email} ({role}) zostało utworzone.", "user": serialize_user(user)}

@router.post("/admin/users/{user_id}/clean", auth=JWTAuth())
def admin_clean_user(request, user_id: int):
    """Admin: czyści wszystkie dane pacjenta (pomiary, jadłospisy, listę zakupów, powiadomienia, czaty), zachowując konto."""
    if not request.auth_user.is_admin:
        raise HttpError(403, "Tylko administrator ma dostęp do tej funkcji.")
    user = User.objects.filter(id=user_id).first()
    if not user:
        raise HttpError(404, "Nie znaleziono użytkownika.")

    from apps.measurements.models import Measurement, MeasurementAuditLog
    from apps.diet_plans.models import DailyMealPlan, ShoppingListItem, DietPlanTemplateAssignment
    from apps.chat.models import ChatMessage, Notification

    MeasurementAuditLog.objects.filter(measurement__patient=user).delete()
    Measurement.objects.filter(patient=user).delete()
    DailyMealPlan.objects.filter(patient=user).delete()
    ShoppingListItem.objects.filter(patient=user).delete()
    DietPlanTemplateAssignment.objects.filter(patient=user).delete()
    Notification.objects.filter(recipient=user).delete()
    ChatMessage.objects.filter(sender=user).delete()
    ChatMessage.objects.filter(receiver=user).delete()

    if hasattr(user, 'patient_profile'):
        prof = user.patient_profile
        prof.current_weight = 75.0
        prof.target_weight = 70.0
        prof.daily_calories_goal = 2000
        prof.protein_goal_g = 140.0
        prof.fat_goal_g = 60.0
        prof.carbs_goal_g = 220.0
        prof.meals_per_day = 4
        prof.official_recommendations = "Konto zostało zresetowane."
        prof.save()

    return {"message": f"Wszystkie dane konta {user.email} zostały pomyślnie wyczyszczone."}

@router.delete("/me", auth=JWTAuth())
def delete_own_account(request, response: HttpResponse):
    """Użytkownik usuwa swoje własne konto wraz ze wszystkimi danymi."""
    user = request.auth_user
    email = user.email
    clear_auth_cookie(response)
    user.delete()
    return {"message": f"Konto {email} zostało trwale usunięte."}

# ── Ustawienia powiadomień i motywów ─────────────────────────────────────────

@router.get("/settings", response=UserNotificationSettingsSchema, auth=JWTAuth())
def get_user_settings(request):
    """Pobiera ustawienia powiadomień i motywu dla zalogowanego użytkownika."""
    user = request.auth_user
    settings, _ = UserNotificationSettings.objects.get_or_create(user=user)
    return {
        "notify_new_diet_plan": settings.notify_new_diet_plan,
        "notify_recommendations": settings.notify_recommendations,
        "notify_chat_messages": settings.notify_chat_messages,
        "notify_upcoming_meals": settings.notify_upcoming_meals,
        "app_theme": settings.app_theme,
    }

@router.put("/settings", response=UserNotificationSettingsSchema, auth=JWTAuth())
def update_user_settings(request, payload: UserNotificationSettingsSchema):
    """Aktualizuje suwaki powiadomień oraz motyw aplikacji."""
    user = request.auth_user
    settings, _ = UserNotificationSettings.objects.get_or_create(user=user)
    settings.notify_new_diet_plan = payload.notify_new_diet_plan
    settings.notify_recommendations = payload.notify_recommendations
    settings.notify_chat_messages = payload.notify_chat_messages
    settings.notify_upcoming_meals = payload.notify_upcoming_meals
    settings.app_theme = payload.app_theme
    settings.save()
    return {
        "notify_new_diet_plan": settings.notify_new_diet_plan,
        "notify_recommendations": settings.notify_recommendations,
        "notify_chat_messages": settings.notify_chat_messages,
        "notify_upcoming_meals": settings.notify_upcoming_meals,
        "app_theme": settings.app_theme,
    }

# ── Zmiana hasła ─────────────────────────────────────────────────────────────

@router.post("/change-password", auth=JWTAuth())
def change_password(request, payload: ChangePasswordSchema):
    """Zmiana hasła przez zalogowanego użytkownika z weryfikacją starego hasła."""
    user = request.auth_user
    if not user.check_password(payload.old_password):
        raise HttpError(400, "Aktualne hasło jest niepoprawne.")
    if len(payload.new_password) < 6:
        raise HttpError(400, "Nowe hasło musi mieć co najmniej 6 znaków.")
    user.set_password(payload.new_password)
    user.save()
    return {"message": "Hasło zostało pomyślnie zmienione."}

# ── Resetowanie zapomnianego hasła (email) ───────────────────────────────────

import random

@router.post("/forgot-password", auth=None)
def forgot_password(request, payload: ForgotPasswordSchema):
    """
    Generuje kod resetu hasła i wysyła na podany adres e-mail (w środowisku deweloperskim zwraca kod ułatwiający natychmiastowe wpisanie).
    """
    email = payload.email.strip().lower()
    user = User.objects.filter(email__iexact=email).first()
    if not user:
        # Bezpieczeństwo: nie zdradzamy czy email istnieje, ale dla wygody deweloperskiej informujemy
        raise HttpError(404, "Nie znaleziono konta z podanym adresem e-mail.")

    # Wygeneruj 6-cyfrowy kod
    code = f"{random.randint(100000, 999999)}"
    PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)
    PasswordResetToken.objects.create(user=user, code=code)

    # Wysłanie powiadomienia do konsoli i ewentualnie systemowej skrzynki
    print(f"\n[RESET HASŁA] Kod weryfikacyjny dla {user.email}: {code}\n")

    return {
        "message": f"Kod resetowania hasła został wysłany na adres {user.email}.",
        "dev_code": code  # Ułatwienie testowania w emulatorze i przeglądarce
    }

@router.post("/reset-password", auth=None)
def reset_password(request, payload: ResetPasswordSchema):
    """
    Resetuje hasło po podaniu adresu e-mail, kodu weryfikacyjnego i nowego hasła.
    """
    email = payload.email.strip().lower()
    user = User.objects.filter(email__iexact=email).first()
    if not user:
        raise HttpError(404, "Nie znaleziono użytkownika.")

    token_obj = PasswordResetToken.objects.filter(
        user=user, code=payload.code.strip(), is_used=False
    ).first()

    if not token_obj:
        raise HttpError(400, "Nieprawidłowy lub wygasły kod weryfikacyjny.")

    if len(payload.new_password) < 6:
        raise HttpError(400, "Nowe hasło musi mieć co najmniej 6 znaków.")

    user.set_password(payload.new_password)
    user.save()
    token_obj.is_used = True
    token_obj.save(update_fields=['is_used'])

    return {"message": "Hasło zostało pomyślnie zresetowane. Możesz się teraz zalogować nowym hasłem."}


