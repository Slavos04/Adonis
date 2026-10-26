from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, PatientProfile, PatientRecommendation

class PatientProfileInline(admin.StackedInline):
    model = PatientProfile
    can_delete = False
    verbose_name_plural = 'Profil Pacjenta'

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (PatientProfileInline,)
    list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'assigned_dietitian', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informacje osobiste', {'fields': ('first_name', 'last_name', 'username', 'phone_number', 'avatar_url')}),
        ('Uprawnienia i Rola', {'fields': ('role', 'assigned_dietitian', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Ważne daty', {'fields': ('last_login', 'date_joined')}),
    )
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)

@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'current_weight', 'target_weight', 'daily_calories_goal', 'meals_per_day')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')

@admin.register(PatientRecommendation)
class PatientRecommendationAdmin(admin.ModelAdmin):
    list_display = ('patient', 'dietitian', 'title', 'created_at')
    search_fields = ('patient__email', 'patient__first_name', 'patient__last_name', 'dietitian__email', 'content')
    list_filter = ('created_at',)
