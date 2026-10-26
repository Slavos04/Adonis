from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class ChatMessage(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages',
        verbose_name=_('nadawca')
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_messages',
        verbose_name=_('odbiorca')
    )
    content = models.TextField(_('treść wiadomości'))
    is_read = models.BooleanField(_('przeczytana'), default=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = _('wiadomość czatu')
        verbose_name_plural = _('wiadomości czatu')
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender.email} -> {self.receiver.email}: {self.content[:30]}"

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        CHAT = 'chat', 'Nowa wiadomość'
        RECOMMENDATION = 'recommendation', 'Nowe zalecenia dietetyczne'
        PLAN_UPDATE = 'plan_update', 'Aktualizacja jadłospisu'
        SYSTEM = 'system', 'Komunikat systemowy'

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name=_('odbiorca powiadomienia')
    )
    title = models.CharField(_('tytuł'), max_length=255)
    message = models.TextField(_('treść'))
    notification_type = models.CharField(
        _('typ powiadomienia'),
        max_length=30,
        choices=NotificationType.choices,
        default=NotificationType.SYSTEM
    )
    is_read = models.BooleanField(_('przeczytane'), default=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = _('powiadomienie')
        verbose_name_plural = _('powiadomienia')
        ordering = ['-created_at']

    def __str__(self):
        return f"Powiadomienie dla {self.recipient.email}: {self.title}"
