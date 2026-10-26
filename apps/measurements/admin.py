from django.contrib import admin
from .models import Measurement, MeasurementAuditLog

class MeasurementAuditLogInLine(admin.TabularInline):
    model = MeasurementAuditLog
    extra = 0
    readonly_fields = ('changed_by', 'field_name', 'old_value', 'new_value', 'reason', 'created_at')

@admin.register(Measurement)
class MeasurementAdmin(admin.ModelAdmin):
    inlines = [MeasurementAuditLogInLine]
    list_display = ('patient', 'date', 'weight', 'waist_cm', 'chest_cm', 'updated_at')
    list_filter = ('date',)
    search_fields = ('patient__email', 'patient__first_name')

@admin.register(MeasurementAuditLog)
class MeasurementAuditLogAdmin(admin.ModelAdmin):
    list_display = ('measurement', 'changed_by', 'field_name', 'old_value', 'new_value', 'created_at')
    list_filter = ('field_name', 'created_at')
    search_fields = ('changed_by__email', 'measurement__patient__email')
