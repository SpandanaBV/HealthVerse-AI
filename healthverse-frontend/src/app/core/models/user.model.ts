export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  phone_number?: string;
  date_of_birth?: string | null;
  created_at?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

/** Matches the backend RegisterSerializer — role-specific fields are optional
 * unless that role is selected (enforced server-side too). */
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  phone_number?: string;
  date_of_birth?: string;

  // Patient-only
  blood_group?: string;
  allergies?: string;
  emergency_contact?: string;

  // Doctor-only (required by the backend when role === 'DOCTOR')
  specialization?: string;
  license_number?: string;
  years_of_experience?: number;
  consultation_fee?: number;
}
