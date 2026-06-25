import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Doctor } from '../models/doctor.model';
import { PaginatedResponse } from '../models/paginated.model';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly baseUrl = `${environment.apiUrl}/doctors/`;

  constructor(private http: HttpClient) {}

  list(): Observable<Doctor[]> {
    return this.http.get<PaginatedResponse<Doctor>>(this.baseUrl).pipe(map((res) => res.results));
  }

  get(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}${id}/`);
  }
}
