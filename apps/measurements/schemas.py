from ninja import Schema
from typing import List, Optional
from datetime import date as dt_date, datetime as dt_datetime

class MeasurementInputSchema(Schema):
    date: Optional[dt_date] = None
    patient_id: Optional[int] = None
    weight: float
    height: Optional[float] = None
    waist_cm: Optional[float] = None
    chest_cm: Optional[float] = None
    hips_cm: Optional[float] = None
    thigh_cm: Optional[float] = None
    notes: Optional[str] = ""

class AuditLogOutSchema(Schema):
    id: int
    changed_by_name: str
    changed_by_email: str
    field_name: str
    old_value: str
    new_value: str
    reason: str
    created_at: dt_datetime

class MeasurementOutSchema(Schema):
    id: int
    date: dt_date
    weight: float
    waist_cm: Optional[float] = None
    chest_cm: Optional[float] = None
    hips_cm: Optional[float] = None
    thigh_cm: Optional[float] = None
    notes: Optional[str] = ""
    audit_logs: List[AuditLogOutSchema]

class DietitianMeasurementCorrectionSchema(Schema):
    weight: Optional[float] = None
    waist_cm: Optional[float] = None
    chest_cm: Optional[float] = None
    hips_cm: Optional[float] = None
    thigh_cm: Optional[float] = None
    reason: str = "Korekta dietetyczna"
