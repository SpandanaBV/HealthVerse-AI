import { User } from './user.model';

export interface Patient {
  id: number;
  user: User;
  blood_group: string;
  allergies: string;
  emergency_contact: string;
}
