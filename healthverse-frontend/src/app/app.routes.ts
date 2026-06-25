import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },

  {
    path: 'patient',
    canActivate: [authGuard, roleGuard('PATIENT')],
    loadComponent: () =>
      import('./features/patient-dashboard/patient-dashboard.component').then(
        (m) => m.PatientDashboardComponent
      ),
  },
  {
    path: 'patient/symptom-checker',
    canActivate: [authGuard, roleGuard('PATIENT')],
    loadComponent: () =>
      import('./features/symptom-checker/symptom-checker.component').then(
        (m) => m.SymptomCheckerComponent
      ),
  },
  {
    path: 'patient/book-appointment',
    canActivate: [authGuard, roleGuard('PATIENT')],
    loadComponent: () =>
      import('./features/appointment-booking/appointment-booking.component').then(
        (m) => m.AppointmentBookingComponent
      ),
  },
  {
    path: 'patient/prescriptions',
    canActivate: [authGuard, roleGuard('PATIENT')],
    loadComponent: () =>
      import('./features/prescription-history/prescription-history.component').then(
        (m) => m.PrescriptionHistoryComponent
      ),
  },

  {
    path: 'doctor',
    canActivate: [authGuard, roleGuard('DOCTOR')],
    loadComponent: () =>
      import('./features/doctor-dashboard/doctor-dashboard.component').then(
        (m) => m.DoctorDashboardComponent
      ),
  },

  { path: '**', redirectTo: 'login' },
];
