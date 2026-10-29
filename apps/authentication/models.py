from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, email, username=None, password=None, **extra_fields):
        if not email:
            raise ValueError('Adres e-mail jest wymagany.')
        email = self.normalize_email(email)
        if not username:
            username = email.split('@')[0]
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', UserRole.ADMIN)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser musi mieć is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser musi mieć is_superuser=True.')
        return self.create_user(email, username, password, **extra_fields)

class UserRole(models.TextChoices):
    ADMIN = 'admin', 'Administrator'
    DIETITIAN = 'dietitian', 'Dietetyk'
    PATIENT = 'patient', 'Pacjent'

class User(AbstractUser):
    email = models.EmailField(_('adres e-mail'), unique=True)
    role = models.CharField(
        _('rola'),
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.PATIENT
    )
    phone_number = models.CharField(_('numer telefonu'), max_length=20, blank=True, null=True)
    avatar_url = models.CharField(_('zdjęcie profilowe'), max_length=500, blank=True, null=True)
    assigned_dietitian = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='patients',
        limit_choices_to={'role': UserRole.DIETITIAN},
        verbose_name=_('przypisany dietetyk')
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('utworzono'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('zaktualizowano'))

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = _('użytkownik')
        verbose_name_plural = _('użytkownicy')
        ordering = ['-created_at']

    def __str__(self):
        full_name = self.get_full_name()
        return f"{full_name} ({self.email})" if full_name else self.email

    @property
    def is_admin(self):
        return self.role == UserRole.ADMIN or self.is_superuser

    @property
    def is_dietitian(self):
        return self.role == UserRole.DIETITIAN

    @property
    def is_patient(self):
        return self.role == UserRole.PATIENT

    @property
    def profile(self):
        return getattr(self, 'patient_profile', None)

class PatientProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='patient_profile',
        verbose_name=_('użytkownik')
    )
    current_weight = models.DecimalField(_('aktualna waga (kg)'), max_digits=5, decimal_places=2, default=70.0)
    target_weight = models.DecimalField(_('waga docelowa (kg)'), max_digits=5, decimal_places=2, default=65.0)
    height = models.DecimalField(_('wzrost (cm)'), max_digits=5, decimal_places=2, default=175.0)
    birth_date = models.DateField(_('data urodzenia'), null=True, blank=True)
    birth_year = models.PositiveSmallIntegerField(_('rok urodzenia'), null=True, blank=True)
    gender = models.CharField(_('płeć'), max_length=10, choices=[('male', 'Mężczyzna'), ('female', 'Kobieta')], default='female')
    activity_level = models.CharField(_('poziom aktywności'), max_length=30, default='umiarkowana')
    
    # Cele dietetyczne ustalane przez dietetyka
    daily_calories_goal = models.PositiveIntegerField(_('cel kalorii (kcal)'), default=2000)
    protein_goal_g = models.DecimalField(_('cel białka (g)'), max_digits=6, decimal_places=1, default=140.0)
    fat_goal_g = models.DecimalField(_('cel tłuszczu (g)'), max_digits=6, decimal_places=1, default=60.0)
    carbs_goal_g = models.DecimalField(_('cel węglowodanów (g)'), max_digits=6, decimal_places=1, default=220.0)
    meals_per_day = models.PositiveSmallIntegerField(_('liczba posiłków na dzień'), default=4)
    
    # Oficjalne zalecenia dietetyczne
    official_recommendations = models.TextField(
        _('oficjalne zalecenia dietetyczne'),
        blank=True,
        default='Pamiętaj o piciu minimum 2 litrów wody dziennie oraz regularnych porach posiłków.'
    )
    recommendations_updated_at = models.DateTimeField(
        _('data aktualizacji zaleceń'),
        null=True,
        blank=True
    )

    @property
    def age(self):
        """Oblicza aktualny wiek pacjenta na podstawie roku urodzenia lub pełnej daty."""
        import datetime
        current_year = datetime.date.today().year
        if self.birth_year:
            return max(0, current_year - self.birth_year)
        if self.birth_date:
            return max(0, current_year - self.birth_date.year)
        return None

    class Meta:
        verbose_name = _('profil pacjenta')
        verbose_name_plural = _('profile pacjentów')

    def __str__(self):
        return f"Profil: {self.user.email}"


class PatientRecommendation(models.Model):
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='recommendations_history',
        verbose_name=_('pacjent')
    )
    dietitian = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='issued_recommendations',
        verbose_name=_('dietetyk')
    )
    title = models.CharField(_('tytuł'), max_length=255, default='Oficjalne zalecenia dietetyczne')
    content = models.TextField(_('treść zaleceń'))
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = _('zalecenie dietetyczne')
        verbose_name_plural = _('historia zaleceń dietetycznych')
        ordering = ['-created_at']

    def __str__(self):
        return f"Zalecenie dla {self.patient.email} z {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class UserNotificationSettings(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='notification_settings',
        verbose_name=_('użytkownik')
    )
    notify_new_diet_plan = models.BooleanField(_('powiadomienia o nowym jadłospisie'), default=True)
    notify_recommendations = models.BooleanField(_('powiadomienia o zaleceniach dietetyka'), default=True)
    notify_chat_messages = models.BooleanField(_('powiadomienia o nowych wiadomościach w czacie'), default=True)
    notify_upcoming_meals = models.BooleanField(_('powiadomienia o zbliżających się posiłkach'), default=True)
    meal_time_breakfast = models.CharField(_('godzina śniadania'), max_length=5, default="08:00")
    meal_time_second_breakfast = models.CharField(_('godzina drugiego śniadania'), max_length=5, default="11:00")
    meal_time_lunch = models.CharField(_('godzina obiadu'), max_length=5, default="14:00")
    meal_time_snack = models.CharField(_('godzina przekąski'), max_length=5, default="17:00")
    meal_time_dinner = models.CharField(_('godzina kolacji'), max_length=5, default="20:00")
    app_theme = models.CharField(_('motyw aplikacji'), max_length=30, default='emerald')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('ustawienia powiadomień')
        verbose_name_plural = _('ustawienia powiadomień')

    def __str__(self):
        return f"Ustawienia powiadomień: {self.user.email}"


class PasswordResetToken(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='password_reset_tokens',
        verbose_name=_('użytkownik')
    )
    code = models.CharField(_('kod weryfikacyjny'), max_length=12)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        verbose_name = _('kod resetu hasła')
        verbose_name_plural = _('kody resetu hasła')
        ordering = ['-created_at']

    def __str__(self):
        return f"Reset dla {self.user.email} (kod: {self.code})"

