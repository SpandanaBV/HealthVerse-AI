import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AppointmentService } from '../../core/services/appointment.service';
import { PrescriptionService } from '../../core/services/prescription.service';
import { AuthService } from '../../core/services/auth.service';
import { Appointment, AppointmentStatus } from '../../core/models/appointment.model';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './doctor-dashboard.component.html',
})
export class DoctorDashboardComponent implements OnInit {

private fb = inject(FormBuilder);
private appointmentService = inject(AppointmentService);
private prescriptionService = inject(PrescriptionService);
public authService = inject(AuthService);


  readonly appointments = signal<Appointment[]>([]);
  readonly prescribedAppointmentIds = signal<Set<number>>(new Set());
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  /** Which appointment's inline "issue prescription" form is currently open. */
  readonly openPrescriptionFor = signal<number | null>(null);
  readonly prescriptionSubmitting = signal(false);

  readonly prescriptionForm = this.fb.group({
    diagnosis: ['', Validators.required],
    medicines: ['', Validators.required], // comma-separated, split on submit
    notes: [''],
  });

  // constructor(
  //   private fb: FormBuilder,
  //   private appointmentService: AppointmentService,
  //   private prescriptionService: PrescriptionService,
  //   public authService: AuthService
  // ) {}



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

    // Used only to know which appointments already have a prescription,
    // so we don't show "Issue prescription" twice for the same visit.
    this.prescriptionService.list().subscribe({
      next: (prescriptions) => {
        this.prescribedAppointmentIds.set(new Set(prescriptions.map((p) => p.appointment)));
      },
    });
  }

  setStatus(appointment: Appointment, status: AppointmentStatus): void {
    this.appointmentService.updateStatus(appointment.id, status).subscribe({
      next: (updated) => {
        this.appointments.set(
          this.appointments().map((a) => (a.id === updated.id ? updated : a))
        );
      },
      error: () => {
        this.errorMessage.set('Could not update that appointment.');
      },
    });
  }

  openPrescriptionForm(appointmentId: number): void {
    this.prescriptionForm.reset({ diagnosis: '', medicines: '', notes: '' });
    this.openPrescriptionFor.set(appointmentId);
  }

  closePrescriptionForm(): void {
    this.openPrescriptionFor.set(null);
  }

  submitPrescription(appointmentId: number): void {
    if (this.prescriptionForm.invalid || this.prescriptionSubmitting()) return;

    this.prescriptionSubmitting.set(true);
    const { diagnosis, medicines, notes } = this.prescriptionForm.getRawValue();
    const medicineList = (medicines ?? '')
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    this.prescriptionService
      .create({ appointment: appointmentId, diagnosis: diagnosis!, medicines: medicineList, notes: notes ?? '' })
      .subscribe({
        next: () => {
          this.prescriptionSubmitting.set(false);
          this.prescribedAppointmentIds.set(new Set([...this.prescribedAppointmentIds(), appointmentId]));
          this.openPrescriptionFor.set(null);
        },
        error: () => {
          this.prescriptionSubmitting.set(false);
          this.errorMessage.set('Could not issue this prescription.');
        },
      });
  }

  hasPrescription(appointmentId: number): boolean {
    return this.prescribedAppointmentIds().has(appointmentId);
  }

  statusClasses(status: AppointmentStatus): string {
    const map: Record<AppointmentStatus, string> = {
      PENDING: 'bg-amber-50 text-status-pending',
      CONFIRMED: 'bg-sky-50 text-status-confirmed',
      COMPLETED: 'bg-brand-50 text-status-completed',
      CANCELLED: 'bg-rose-50 text-status-cancelled',
    };
    return map[status];
  }
}
