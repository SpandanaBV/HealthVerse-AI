import { User } from './user.model';

export interface Doctor {
  id: number;
  user: User;
  specialization: string;
  license_number: string;
  years_of_experience: number;
  consultation_fee: string; // DRF serializes DecimalField as a string
}
