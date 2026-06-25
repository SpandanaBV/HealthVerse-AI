from django.conf import settings
from django.db import models


class Doctor(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="doctor_profile"
    )
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    def __str__(self):
        full_name = self.user.get_full_name() or self.user.username
        return f"Dr. {full_name} ({self.specialization})"


class Patient(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="patient_profile"
    )
    blood_group = models.CharField(max_length=5, blank=True)
    allergies = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.username


class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="appointments")
    scheduled_at = models.DateTimeField()
    reason = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-scheduled_at"]

    def __str__(self):
        return f"{self.patient} with {self.doctor} on {self.scheduled_at:%Y-%m-%d %H:%M}"


class Prescription(models.Model):
    appointment = models.OneToOneField(
        Appointment, on_delete=models.CASCADE, related_name="prescription"
    )
    diagnosis = models.CharField(max_length=255)
    medicines = models.JSONField(default=list, help_text="List of prescribed medicine names")
    notes = models.TextField(blank=True)
    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription for {self.appointment.patient} - {self.diagnosis}"


class SymptomPrediction(models.Model):
    """Stores every AI symptom-prediction call for audit/history purposes."""

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="predictions")
    symptoms = models.JSONField(default=list)
    predicted_disease = models.CharField(max_length=255)
    confidence = models.FloatField()
    suggested_medicines = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.patient} -> {self.predicted_disease} ({self.confidence:.0%})"
