## ==============================================================================
## MODUŁ POMIARÓW CIAŁA, KALKULACJI BMI I REJESTRU AUDYTU (Audit Log)
## Obsługuje rejestrację wagi i obwodów przez pacjenta, automatyczną aktualizację
## wzrostu dla normy WHO BMI oraz audytowaną korektę danych przez dietetyka.
## ==============================================================================

from ninja import Router
from typing import List, Optional
from datetime import date
from decimal import Decimal
from ninja.errors import HttpError
from django.db import transaction

from .models import Measurement, MeasurementAuditLog
from .schemas import (
    MeasurementInputSchema, MeasurementOutSchema,
    DietitianMeasurementCorrectionSchema, AuditLogOutSchema
)
from apps.authentication.models import User, UserRole, PatientProfile
from apps.authentication.security import JWTAuth

router = Router(tags=["Pomiary Ciała i Audit Log"])

def serialize_measurement(m: Measurement) -> dict:
    logs = []
    for log in m.audit_logs.select_related('changed_by').all():
        logs.append({
            "id": log.id,
            "changed_by_name": log.changed_by.get_full_name() or log.changed_by.username if log.changed_by else "System",
            "changed_by_email": log.changed_by.email if log.changed_by else "system@adonis.app",
            "field_name": log.field_name,
            "old_value": log.old_value,
            "new_value": log.new_value,
            "reason": log.reason,
            "created_at": log.created_at,
        })

    return {
        "id": m.id,
        "date": m.date,
        "weight": float(m.weight),
        "waist_cm": float(m.waist_cm) if m.waist_cm is not None else None,
        "chest_cm": float(m.chest_cm) if m.chest_cm is not None else None,
        "hips_cm": float(m.hips_cm) if m.hips_cm is not None else None,
        "thigh_cm": float(m.thigh_cm) if m.thigh_cm is not None else None,
        "notes": m.notes,
        "audit_logs": logs,
    }

@router.get("/", response=List[MeasurementOutSchema], auth=JWTAuth())
def list_measurements(request, patient_id: Optional[int] = None):
    """Pobiera historię pomiarów ciała pacjenta wraz z kompletnym Audit Logiem."""
    user = request.auth_user
    if user.role == UserRole.PATIENT:
        target_patient = user
    else:
        if not patient_id:
            raise HttpError(400, "Wymagane ID pacjenta.")
        target_patient = User.objects.filter(id=patient_id, role=UserRole.PATIENT).first()
        if not target_patient:
            raise HttpError(404, "Nie znaleziono pacjenta.")

    measurements = Measurement.objects.prefetch_related('audit_logs__changed_by').filter(
        patient=target_patient
    ).order_by('-date')

    return [serialize_measurement(m) for m in measurements]

@router.post("/", response=MeasurementOutSchema, auth=JWTAuth())
def add_measurement(request, payload: MeasurementInputSchema):
    """Pacjent wprowadza codzienną wagę oraz obwody ciała."""
    user = request.auth_user
    entry_date = payload.date or date.today()

    with transaction.atomic():
        measurement, created = Measurement.objects.update_or_create(
            patient=user,
            date=entry_date,
            defaults={
                "weight": Decimal(str(payload.weight)),
                "waist_cm": Decimal(str(payload.waist_cm)) if payload.waist_cm is not None else None,
                "chest_cm": Decimal(str(payload.chest_cm)) if payload.chest_cm is not None else None,
                "hips_cm": Decimal(str(payload.hips_cm)) if payload.hips_cm is not None else None,
                "thigh_cm": Decimal(str(payload.thigh_cm)) if payload.thigh_cm is not None else None,
                "notes": payload.notes or ""
            }
        )

        ## Synchronizacja wagi bieżącej oraz wzrostu w profilu pacjenta (kluczowe do wyliczania BMI wg WHO)
        profile, _ = PatientProfile.objects.get_or_create(user=user)
        profile.current_weight = measurement.weight
        update_fields = ['current_weight']
        if payload.height is not None and payload.height > 0:
            profile.height = Decimal(str(payload.height))
            update_fields.append('height')
        profile.save(update_fields=update_fields)

    return serialize_measurement(measurement)

@router.put("/{measurement_id}/correct", response=MeasurementOutSchema, auth=JWTAuth())
def correct_measurement_by_dietitian(
    request,
    measurement_id: int,
    payload: DietitianMeasurementCorrectionSchema
):
    """
    Ręczna korekta wagi lub obwodów pacjenta przez dietetyka.
    Automatycznie generuje wpis w Audit Log z informacją: kto zmienił, kiedy i jaka była stara wartość.
    """
    dietitian = request.auth_user
    if dietitian.role not in [UserRole.ADMIN, UserRole.DIETITIAN]:
        raise HttpError(403, "Tylko dietetyk lub administrator ma prawo korygować pomiary w trybie audytu.")

    measurement = Measurement.objects.select_related('patient').filter(id=measurement_id).first()
    if not measurement:
        raise HttpError(404, "Nie znaleziono pomiaru.")

    if dietitian.role == UserRole.DIETITIAN and measurement.patient.assigned_dietitian_id != dietitian.id:
        raise HttpError(403, "Możesz korygować pomiary wyłącznie swoich pacjentów.")

    fields_to_check = [
        ("weight", payload.weight),
        ("waist_cm", payload.waist_cm),
        ("chest_cm", payload.chest_cm),
        ("hips_cm", payload.hips_cm),
        ("thigh_cm", payload.thigh_cm),
    ]

    with transaction.atomic():
        for field_name, new_val in fields_to_check:
            if new_val is not None:
                old_val = getattr(measurement, field_name)
                new_dec = Decimal(str(new_val))
                if old_val != new_dec:
                    ## Rejestracja w nieusuwalnym rejestrze zdarzeń (Audit Log) dla pełnej transparentności zmian
                    MeasurementAuditLog.objects.create(
                        measurement=measurement,
                        changed_by=dietitian,
                        field_name=field_name,
                        old_value=str(old_val) if old_val is not None else "brak",
                        new_value=str(new_dec),
                        reason=payload.reason
                    )
                    setattr(measurement, field_name, new_dec)

        measurement.save()

        # Jeśli zmieniono wagę, zaktualizuj też profil pacjenta
        if payload.weight is not None:
            profile, _ = PatientProfile.objects.get_or_create(user=measurement.patient)
            profile.current_weight = measurement.weight
            profile.save(update_fields=['current_weight'])

    return serialize_measurement(measurement)

@router.get("/audit-logs", response=List[AuditLogOutSchema], auth=JWTAuth())
def list_audit_logs(request, patient_id: Optional[int] = None):
    """Wgląd w całą historię audytową zmian pomiarów."""
    user = request.auth_user
    if user.role not in [UserRole.ADMIN, UserRole.DIETITIAN]:
        raise HttpError(403, "Brak uprawnień.")

    qs = MeasurementAuditLog.objects.select_related('measurement__patient', 'changed_by')
    if patient_id:
        qs = qs.filter(measurement__patient_id=patient_id)
    elif user.role == UserRole.DIETITIAN:
        qs = qs.filter(measurement__patient__assigned_dietitian=user)

    logs = []
    for log in qs[:100]:
        logs.append({
            "id": log.id,
            "changed_by_name": log.changed_by.get_full_name() or log.changed_by.username if log.changed_by else "System",
            "changed_by_email": log.changed_by.email if log.changed_by else "system@adonis.app",
            "field_name": log.field_name,
            "old_value": log.old_value,
            "new_value": log.new_value,
            "reason": log.reason,
            "created_at": log.created_at,
        })
    return logs

@router.delete("/{measurement_id}", auth=JWTAuth())
def delete_measurement(request, measurement_id: int):
    """Usuwa wskazany pomiar pacjenta."""
    user = request.auth_user
    qs = Measurement.objects.filter(id=measurement_id)
    if user.role == UserRole.PATIENT:
        qs = qs.filter(patient=user)
    elif user.role == UserRole.DIETITIAN:
        qs = qs.filter(patient__assigned_dietitian=user)
    m = qs.first()
    if not m:
        raise HttpError(404, "Nie znaleziono pomiaru lub brak uprawnień.")
    m.delete()
    return {"message": "Pomiar został usunięty."}
