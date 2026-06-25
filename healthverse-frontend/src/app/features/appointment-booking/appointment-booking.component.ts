import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { DoctorService } from '../../core/services/doctor.service';
import { AppointmentService } from '../../core/services/appointment.service';
import { Doctor } from '../../core/models/doctor.model';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './appointment-booking.component.html',
})
export class AppointmentBookingComponent implements OnInit {

private fb = inject(FormBuilder);
private doctorService = inject(DoctorService);
private appointmentService = inject(AppointmentService);
private router = inject(Router);

  readonly doctors = signal<Doctor[]>([]);
  readonly loadingDoctors = signal(true);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    doctor: [null as number | null, Validators.required],
    scheduled_at: ['', Validators.required],
    reason: [''],
  });

  // constructor(
  //   private fb: FormBuilder,
  //   private doctorService: DoctorService,
  //   private appointmentService: AppointmentService,
  //   private router: Router
  // ) {}

  ngOnInit(): void {
    this.doctorService.list().subscribe({
      next: (doctors) => {
        this.doctors.set(doctors);
        this.loadingDoctors.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load the doctor directory.');
        this.loadingDoctors.set(false);
      },
    });
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) return;

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { doctor, scheduled_at, reason } = this.form.getRawValue();
    this.appointmentService
      .create({
        doctor: doctor!,
        scheduled_at: new Date(scheduled_at!).toISOString(),
        reason: reason ?? '',
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.successMessage.set('Appointment booked! Redirecting to your dashboard...');
          setTimeout(() => this.router.navigate(['/patient']), 1200);
        },
        error: () => {
          this.submitting.set(false);
          this.errorMessage.set('Could not book this appointment. Please try a different time.');
        },
      });
  }
}
