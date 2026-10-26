import pytest
from decimal import Decimal
from django.test import Client
from apps.authentication.models import User, UserRole, PatientProfile
from apps.recipes.models import Recipe, MealCategory
from apps.diet_plans.models import DailyMealPlan, PlannedMeal, DietPlanTemplate
from apps.measurements.models import Measurement
from apps.chat.models import Notification, ChatMessage
from apps.authentication.security import generate_jwt_token

@pytest.mark.django_db
def test_admin_clean_user_and_self_delete():
    admin = User.objects.create(email='admin_clean@adonis.app', username='adm_clean', role=UserRole.ADMIN)
    patient = User.objects.create(email='patient_clean@adonis.app', username='pat_clean', role=UserRole.PATIENT)
    PatientProfile.objects.create(user=patient, daily_calories_goal=1800, current_weight=80.0)

    from datetime import date
    # Add measurement, notification, chat message
    Measurement.objects.create(patient=patient, date=date.today(), weight=Decimal('80.0'))
    Notification.objects.create(recipient=patient, title='Test', message='Msg')
    ChatMessage.objects.create(sender=patient, receiver=admin, content='Cześć admin')

    client = Client()
    admin_token = generate_jwt_token(admin)
    patient_token = generate_jwt_token(patient)

    # 1. Admin cleans patient data
    clean_resp = client.post(
        f'/api/auth/admin/users/{patient.id}/clean',
        HTTP_AUTHORIZATION=f'Bearer {admin_token}'
    )
    assert clean_resp.status_code == 200
    assert Measurement.objects.filter(patient=patient).count() == 0
    assert Notification.objects.filter(recipient=patient).count() == 0
    assert ChatMessage.objects.filter(sender=patient).count() == 0
    # User still exists
    assert User.objects.filter(id=patient.id).exists()

    # 2. Patient deletes own account
    del_resp = client.delete(
        '/api/auth/me',
        HTTP_AUTHORIZATION=f'Bearer {patient_token}'
    )
    assert del_resp.status_code == 200
    assert not User.objects.filter(id=patient.id).exists()
