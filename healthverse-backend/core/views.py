from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from ml_model.ai_service import predict_disease

from .models import Appointment, Doctor, Patient, Prescription, SymptomPrediction
from .permissions import IsOwnerDoctorOrPatient, IsPatient
from .serializers import (
    AppointmentSerializer,
    DoctorSerializer,
    PatientSerializer,
    PrescriptionSerializer,
    SymptomPredictionRequestSerializer,
    SymptomPredictionSerializer,
)

LOW_CONFIDENCE_THRESHOLD = 0.4


class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    """Public-ish directory of doctors — any authenticated user can browse/search."""

    queryset = Doctor.objects.select_related("user").all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]


class PatientViewSet(viewsets.ModelViewSet):
    """
    Patients can only ever see/edit their own profile.
    Doctors/admins can view patient profiles linked to their appointments.
    """

    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "PATIENT":
            return Patient.objects.filter(user=user)
        if user.role == "DOCTOR":
            return Patient.objects.filter(appointments__doctor__user=user).distinct()
        return Patient.objects.all()  # admin/staff


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerDoctorOrPatient]

    def get_queryset(self):
        user = self.request.user
        qs = Appointment.objects.select_related("patient__user", "doctor__user")
        if user.role == "PATIENT":
            return qs.filter(patient__user=user)
        if user.role == "DOCTOR":
            return qs.filter(doctor__user=user)
        return qs  # admin/staff sees all

    def get_permissions(self):
        if self.action == "create":
            return [permissions.IsAuthenticated(), IsPatient()]
        return super().get_permissions()

    def perform_create(self, serializer):
        # patient is read-only on the serializer (see AppointmentSerializer) —
        # it's always the logged-in patient booking for themself.
        patient = Patient.objects.get(user=self.request.user)
        serializer.save(patient=patient)


class PrescriptionViewSet(viewsets.ModelViewSet):
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerDoctorOrPatient]

    def get_queryset(self):
        user = self.request.user
        qs = Prescription.objects.select_related("appointment__patient__user", "appointment__doctor__user")
        if user.role == "PATIENT":
            return qs.filter(appointment__patient__user=user)
        if user.role == "DOCTOR":
            return qs.filter(appointment__doctor__user=user)
        return qs

    def perform_create(self, serializer):
        # Only doctors issue prescriptions, and only for their own appointments.
        if self.request.user.role != "DOCTOR":
            raise PermissionDenied("Only doctors can issue prescriptions.")
        serializer.save()


class PredictSymptomsView(APIView):
    """
    POST /api/predict-symptoms/
    Body: {"symptoms": ["headache", "nausea", ...]}

    Runs the trained Random Forest model and logs the result against the
    requesting patient for history/audit purposes.
    """

    permission_classes = [permissions.IsAuthenticated, IsPatient]

    def post(self, request):
        req_serializer = SymptomPredictionRequestSerializer(data=request.data)
        req_serializer.is_valid(raise_exception=True)
        symptoms = req_serializer.validated_data["symptoms"]

        result = predict_disease(symptoms)

        patient = Patient.objects.get(user=request.user)
        prediction = SymptomPrediction.objects.create(
            patient=patient,
            symptoms=symptoms,
            predicted_disease=result["predicted_disease"],
            confidence=result["confidence"],
            suggested_medicines=result["suggested_medicines"],
        )

        response_data = SymptomPredictionSerializer(prediction).data
        response_data["low_confidence"] = result["confidence"] < LOW_CONFIDENCE_THRESHOLD
        return Response(response_data, status=status.HTTP_201_CREATED)
