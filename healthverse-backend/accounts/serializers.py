from django.db import transaction
from rest_framework import serializers

from core.models import Doctor, Patient

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    """
    Creates a User AND its linked Patient/Doctor profile in one call, so the
    account is immediately usable (booking, prediction, etc.) without a
    separate admin step.

    - role=PATIENT: blood_group/allergies/emergency_contact are optional.
    - role=DOCTOR: specialization and license_number are REQUIRED.
    """

    password = serializers.CharField(write_only=True, min_length=8)

    # Patient-only fields (optional)
    blood_group = serializers.CharField(write_only=True, required=False, allow_blank=True, default="")
    allergies = serializers.CharField(write_only=True, required=False, allow_blank=True, default="")
    emergency_contact = serializers.CharField(write_only=True, required=False, allow_blank=True, default="")

    # Doctor-only fields (required when role=DOCTOR, validated below)
    specialization = serializers.CharField(write_only=True, required=False, allow_blank=True, default="")
    license_number = serializers.CharField(write_only=True, required=False, allow_blank=True, default="")
    years_of_experience = serializers.IntegerField(write_only=True, required=False, default=0)
    consultation_fee = serializers.DecimalField(
        write_only=True, required=False, max_digits=8, decimal_places=2, default=0
    )

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "password", "role", "phone_number", "date_of_birth",
            "blood_group", "allergies", "emergency_contact",
            "specialization", "license_number", "years_of_experience", "consultation_fee",
        ]

    def validate(self, attrs):
        if attrs.get("role") == User.Role.DOCTOR:
            if not attrs.get("specialization") or not attrs.get("license_number"):
                raise serializers.ValidationError(
                    "specialization and license_number are required when registering as a doctor."
                )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        patient_fields = {
            "blood_group": validated_data.pop("blood_group", ""),
            "allergies": validated_data.pop("allergies", ""),
            "emergency_contact": validated_data.pop("emergency_contact", ""),
        }
        doctor_fields = {
            "specialization": validated_data.pop("specialization", ""),
            "license_number": validated_data.pop("license_number", ""),
            "years_of_experience": validated_data.pop("years_of_experience", 0),
            "consultation_fee": validated_data.pop("consultation_fee", 0),
        }

        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if user.role == User.Role.PATIENT:
            Patient.objects.create(user=user, **patient_fields)
        elif user.role == User.Role.DOCTOR:
            Doctor.objects.create(user=user, **doctor_fields)

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "phone_number", "date_of_birth", "created_at"]
        read_only_fields = ["role", "created_at"]
