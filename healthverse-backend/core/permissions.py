from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "DOCTOR")


class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "PATIENT")


class IsOwnerDoctorOrPatient(BasePermission):
    """
    Object-level permission for Appointment/Prescription: only the doctor or
    patient involved in that specific record (or an admin) may access it.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_staff or user.role == "ADMIN":
            return True

        # obj may be an Appointment (has .patient/.doctor) or a Prescription (has .appointment)
        appointment = obj if hasattr(obj, "patient") else obj.appointment

        if user.role == "PATIENT":
            return appointment.patient.user_id == user.id
        if user.role == "DOCTOR":
            return appointment.doctor.user_id == user.id
        return False
