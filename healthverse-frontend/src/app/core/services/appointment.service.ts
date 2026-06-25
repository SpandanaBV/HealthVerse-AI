import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment, AppointmentStatus, CreateAppointmentPayload } from '../models/appointment.model';
import { PaginatedResponse } from '../models/paginated.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly baseUrl = `${environment.apiUrl}/appointments/`;

  constructor(private http: HttpClient) {}

  /** Filtered server-side to the logged-in patient's or doctor's own appointments. */
  list(): Observable<Appointment[]> {
    return this.http.get<PaginatedResponse<Appointment>>(this.baseUrl).pipe(map((res) => res.results));
  }

  /** Patient books for themself — the backend sets `patient` automatically. */
  create(payload: CreateAppointmentPayload): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseUrl, payload);
  }

  updateStatus(id: number, status: AppointmentStatus): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.baseUrl}${id}/`, { status });
  }
}
