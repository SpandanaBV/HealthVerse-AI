from django.contrib import admin

from .models import Appointment, Doctor, Patient, Prescription, SymptomPrediction


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ("user", "specialization", "license_number", "years_of_experience")
    search_fields = ("user__username", "specialization", "license_number")


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ("user", "blood_group", "emergency_contact")
    search_fields = ("user__username",)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("patient", "doctor", "scheduled_at", "status")
    list_filter = ("status",)


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ("appointment", "diagnosis", "issued_at")


@admin.register(SymptomPrediction)
class SymptomPredictionAdmin(admin.ModelAdmin):
    list_display = ("patient", "predicted_disease", "confidence", "created_at")
