import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SymptomPredictionResponse } from '../models/symptom.model';

@Injectable({ providedIn: 'root' })
export class SymptomService {
  private readonly baseUrl = `${environment.apiUrl}/predict-symptoms/`;

  constructor(private http: HttpClient) {}

  /** Patients only — backend rejects this for any other role. */
  predict(symptoms: string[]): Observable<SymptomPredictionResponse> {
    return this.http.post<SymptomPredictionResponse>(this.baseUrl, { symptoms });
  }
}
