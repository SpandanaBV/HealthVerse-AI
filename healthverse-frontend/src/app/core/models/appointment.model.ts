export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: number;
  patient: number;
  patient_name: string;
  doctor: number;
  doctor_name: string;
  scheduled_at: string; // ISO datetime string
  reason: string;
  status: AppointmentStatus;
  created_at: string;
}

/** patient is set server-side from the logged-in user — do not send it. */
export interface CreateAppointmentPayload {
  doctor: number;
  scheduled_at: string;
  reason: string;
}
