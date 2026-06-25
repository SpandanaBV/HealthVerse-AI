from rest_framework import serializers

from accounts.serializers import UserSerializer

from .models import Appointment, Doctor, Patient, Prescription, SymptomPrediction


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Doctor
        fields = [
            "id", "user", "specialization", "license_number",
            "years_of_experience", "consultation_fee",
        ]


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Patient
        fields = ["id", "user", "blood_group", "allergies", "emergency_contact"]


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.user.username", read_only=True)
    doctor_name = serializers.CharField(source="doctor.user.username", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id", "patient", "patient_name", "doctor", "doctor_name",
            "scheduled_at", "reason", "status", "created_at",
        ]
        read_only_fields = ["created_at", "patient"]


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ["id", "appointment", "diagnosis", "medicines", "notes", "issued_at"]
        read_only_fields = ["issued_at"]


class SymptomPredictionRequestSerializer(serializers.Serializer):
    """Input payload for POST /api/predict-symptoms/"""

    symptoms = serializers.ListField(
        child=serializers.CharField(), allow_empty=False, min_length=1
    )


class SymptomPredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SymptomPrediction
        fields = [
            "id", "patient", "symptoms", "predicted_disease",
            "confidence", "suggested_medicines", "created_at",
        ]
        read_only_fields = [
            "predicted_disease", "confidence", "suggested_medicines", "created_at",
        ]
