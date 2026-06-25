import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../models/paginated.model';
import { CreatePrescriptionPayload, Prescription } from '../models/prescription.model';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private readonly baseUrl = `${environment.apiUrl}/prescriptions/`;

  constructor(private http: HttpClient) {}

  /** Filtered server-side to the logged-in patient's or doctor's own prescriptions. */
  list(): Observable<Prescription[]> {
    return this.http.get<PaginatedResponse<Prescription>>(this.baseUrl).pipe(map((res) => res.results));
  }

  /** Doctors only — backend rejects this for any other role. */
  create(payload: CreatePrescriptionPayload): Observable<Prescription> {
    return this.http.post<Prescription>(this.baseUrl, payload);
  }
}
