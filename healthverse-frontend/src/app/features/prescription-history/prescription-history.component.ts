import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PrescriptionService } from '../../core/services/prescription.service';
import { Prescription } from '../../core/models/prescription.model';

@Component({
  selector: 'app-prescription-history',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './prescription-history.component.html',
})
export class PrescriptionHistoryComponent implements OnInit {
  readonly prescriptions = signal<Prescription[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  constructor(private prescriptionService: PrescriptionService) {}

  ngOnInit(): void {
    this.prescriptionService.list().subscribe({
      next: (prescriptions) => {
        this.prescriptions.set(prescriptions);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load your prescriptions.');
        this.loading.set(false);
      },
    });
  }
}
