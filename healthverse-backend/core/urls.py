from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AppointmentViewSet, DoctorViewSet, PatientViewSet, PredictSymptomsView, PrescriptionViewSet

router = DefaultRouter()
router.register("doctors", DoctorViewSet, basename="doctor")
router.register("patients", PatientViewSet, basename="patient")
router.register("appointments", AppointmentViewSet, basename="appointment")
router.register("prescriptions", PrescriptionViewSet, basename="prescription")

urlpatterns = [
    path("", include(router.urls)),
    path("predict-symptoms/", PredictSymptomsView.as_view(), name="predict-symptoms"),
]
