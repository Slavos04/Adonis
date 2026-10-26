from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Measurement(models.Model):
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='measurements',
        verbose_name=_('pacjent')
    )
    date = models.DateField(_('data pomiaru'), db_index=True)
    weight = models.DecimalField(_('waga (kg)'), max_digits=5, decimal_places=2)
    waist_cm = models.DecimalField(_('obwód talii (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    chest_cm = models.DecimalField(_('obwód klatki piersiowej (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    hips_cm = models.DecimalField(_('obwód bioder (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    thigh_cm = models.DecimalField(_('obwód uda (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    notes = models.CharField(_('uwagi'), max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('pomiar')
        verbose_name_plural = _('pomiary')
        unique_together = ('patient', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.patient.email} - {self.date}: {self.weight} kg"

class MeasurementAuditLog(models.Model):
    measurement = models.ForeignKey(
        Measurement,
        on_delete=models.CASCADE,
        related_name='audit_logs',
        verbose_name=_('pomiar')
    )
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='audit_records',
        verbose_name=_('autor zmiany')
    )
    field_name = models.CharField(_('edytowane pole'), max_length=50)
    old_value = models.CharField(_('stara wartość'), max_length=50)
    new_value = models.CharField(_('nowa wartość'), max_length=50)
    reason = models.CharField(_('powód korekty'), max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('data modyfikacji'))

    class Meta:
        verbose_name = _('wpis w historii audytu')
        verbose_name_plural = _('historia audytu pomiarów (Audit Log)')
        ordering = ['-created_at']

    def __str__(self):
        editor = self.changed_by.email if self.changed_by else "System"
        return f"Audit [{self.created_at:%Y-%m-%d %H:%M}]: {editor} zmienił {self.field_name} z {self.old_value} na {self.new_value}"
