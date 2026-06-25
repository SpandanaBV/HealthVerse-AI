import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginPayload, RegisterPayload, TokenPair, User } from '../models/user.model';

const ACCESS_KEY = 'hv_access_token';
const REFRESH_KEY = 'hv_refresh_token';
const USER_KEY = 'hv_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  private readonly _currentUser = signal<User | null>(this.readStoredUser());
  /** The logged-in user, or null. Read-only outside this service. */
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly role = computed(() => this._currentUser()?.role ?? null);

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/accounts/register/`, payload);
  }

  /** Logs in, stores tokens, then fetches and stores the full user profile (incl. role). */
  login(payload: LoginPayload): Observable<User> {
    return this.http.post<TokenPair>(`${this.baseUrl}/auth/login/`, payload).pipe(
      tap((tokens) => this.storeTokens(tokens)),
      switchMap(() => this.fetchAndStoreCurrentUser())
    );
  }

  fetchAndStoreCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/accounts/me/`).pipe(
      tap((user) => {
        this._currentUser.set(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      })
    );
  }

  refreshAccessToken(): Observable<{ access: string }> {
    const refresh = this.getRefreshToken();
    return this.http.post<{ access: string }>(`${this.baseUrl}/auth/refresh/`, { refresh }).pipe(
      tap(({ access }) => localStorage.setItem(ACCESS_KEY, access))
    );
  }

  logout(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  private storeTokens(tokens: TokenPair): void {
    localStorage.setItem(ACCESS_KEY, tokens.access);
    localStorage.setItem(REFRESH_KEY, tokens.refresh);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
