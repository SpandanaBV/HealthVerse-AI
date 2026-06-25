import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../models/paginated.model';
import { Patient } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly baseUrl = `${environment.apiUrl}/patients/`;

  constructor(private http: HttpClient) {}

  /** Patients see only themself; doctors see patients linked to their appointments. */
  list(): Observable<Patient[]> {
    return this.http.get<PaginatedResponse<Patient>>(this.baseUrl).pipe(map((res) => res.results));
  }
}
