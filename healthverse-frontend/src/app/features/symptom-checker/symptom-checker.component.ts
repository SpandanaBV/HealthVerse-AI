import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SymptomService } from '../../core/services/symptom.service';
import { KNOWN_SYMPTOMS, SymptomPredictionResponse } from '../../core/models/symptom.model';

@Component({
  selector: 'app-symptom-checker',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './symptom-checker.component.html',
})
export class SymptomCheckerComponent {
  readonly allSymptoms = KNOWN_SYMPTOMS;
  readonly selected = signal<Set<string>>(new Set());
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly result = signal<SymptomPredictionResponse | null>(null);

  constructor(private symptomService: SymptomService) {}

  toggle(symptom: string): void {
    const next = new Set(this.selected());
    if (next.has(symptom)) {
      next.delete(symptom);
    } else {
      next.add(symptom);
    }
    this.selected.set(next);
  }

  isSelected(symptom: string): boolean {
    return this.selected().has(symptom);
  }

  label(symptom: string): string {
    return symptom.replace(/_/g, ' ');
  }

  submit(): void {
    if (this.selected().size === 0 || this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.result.set(null);

    this.symptomService.predict(Array.from(this.selected())).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not get a prediction right now. Please try again.');
        this.loading.set(false);
      },
    });
  }

  reset(): void {
    this.selected.set(new Set());
    this.result.set(null);
    this.errorMessage.set(null);
  }
}
