export interface Prescription {
  id: number;
  appointment: number;
  diagnosis: string;
  medicines: string[];
  notes: string;
  issued_at: string;
}

export interface CreatePrescriptionPayload {
  appointment: number;
  diagnosis: string;
  medicines: string[];
  notes?: string;
}
