import { CommonModule } from '@angular/common';
import { Component, computed, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterPayload, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['PATIENT' as UserRole, Validators.required],
    phone_number: [''],

    // Patient-only
    blood_group: [''],
    allergies: [''],
    emergency_contact: [''],

    // Doctor-only
    specialization: [''],
    license_number: [''],
    years_of_experience: [0],
    consultation_fee: [0],
  });

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // toSignal bridges the FormControl's valueChanges Observable into a signal,
  // so `isDoctor` correctly re-evaluates whenever the role radio changes
  // (a computed() alone would NOT react to a plain FormControl value).
  private readonly roleValue = toSignal(this.form.controls.role.valueChanges, {
    initialValue: this.form.controls.role.value,
  });
  readonly isDoctor = computed(() => this.roleValue() === 'DOCTOR');

  // constructor(
  //   private fb: FormBuilder,
  //   private authService: AuthService,
  //   private router: Router
  // ) {}



  submit(): void {
    if (this.form.invalid || this.loading()) return;

    if (this.isDoctor()) {
      const { specialization, license_number } = this.form.getRawValue();
      if (!specialization || !license_number) {
        this.errorMessage.set('Specialization and license number are required for doctor accounts.');
        return;
      }
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const payload = this.form.getRawValue() as RegisterPayload;
    this.authService.register(payload).subscribe({
      next: () => {
        // Auto-login right after successful registration for a smooth flow.
        this.authService.login({ username: payload.username, password: payload.password }).subscribe({
          next: (user) => {
            this.loading.set(false);
            this.router.navigate([user.role === 'DOCTOR' ? '/doctor' : '/patient']);
          },
          error: () => {
            this.loading.set(false);
            this.router.navigate(['/login']);
          },
        });
      },
      error: (err) => {
        this.loading.set(false);
        const detail = err?.error?.username?.[0] || err?.error?.non_field_errors?.[0] || err?.error?.detail;
        this.errorMessage.set(detail || 'Registration failed. Please check your details and try again.');
      },
    });
  }
}
