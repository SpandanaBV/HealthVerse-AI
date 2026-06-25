import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AppointmentService } from '../../core/services/appointment.service';
import { AuthService } from '../../core/services/auth.service';
import { Appointment } from '../../core/models/appointment.model';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './patient-dashboard.component.html',
})
export class PatientDashboardComponent implements OnInit {
  readonly appointments = signal<Appointment[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  constructor(
    private appointmentService: AppointmentService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.appointmentService.list().subscribe({
      next: (appointments) => {
        this.appointments.set(appointments);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load your appointments.');
        this.loading.set(false);
      },
    });
  }

  statusClasses(status: Appointment['status']): string {
    const map: Record<Appointment['status'], string> = {
      PENDING: 'bg-amber-50 text-status-pending',
      CONFIRMED: 'bg-sky-50 text-status-confirmed',
      COMPLETED: 'bg-brand-50 text-status-completed',
      CANCELLED: 'bg-rose-50 text-status-cancelled',
    };
    return map[status];
  }
}
