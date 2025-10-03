import { Injectable, signal } from '@angular/core';
import { AdminUser, User } from '../../features/dashboard/models/user.model.js';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AdminUserBuilder } from 'app/features/dashboard/builders/AdminUserBuilder';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  constructor(private http: HttpClient) {
    const storedToken = localStorage.getItem('auth-token');
    const storedUser = localStorage.getItem('auth-user');

    if (storedToken && storedUser) {
      this.tokenSignal.set(storedToken);
      this.userSignal.set(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<AdminUser> {
    const loginPayload = new AdminUserBuilder()
      .setEmail(email)
      .setPassword(password)
      .build();

    return this.http.post<{ user: AdminUser; token: string }>(
      `${environment.apiUrl}/login`,
      loginPayload
    ).pipe(
      tap(response => {
        this.tokenSignal.set(response.token);
        this.userSignal.set(response.user);

        localStorage.setItem('auth-token', response.token);
        localStorage.setItem('auth-user', JSON.stringify(response.user));
      }),
      map(response => response.user),
      catchError(err =>
        throwError(() => new Error(err.error?.message || 'Login failed'))
      )
    );
  }

  signup(userData: Partial<AdminUser>): Observable<AdminUser> {
    const user = new AdminUserBuilder()
      .setEmail(userData.email || '')
      .setPassword(userData.password || '')
      .setRole(userData.role || 'admin')
      .setFirstName(userData.firstName || '')
      .setLastName(userData.lastName || '')
      .setOtp(userData.otp || '')
      .build();

    return this.http.post<{ user: AdminUser; token: string }>(
      `${environment.apiUrl}/signup`,
      user
    ).pipe(
      tap(response => {
        this.tokenSignal.set(response.token);
        this.userSignal.set(response.user);
        localStorage.setItem('auth-token', response.token);
        localStorage.setItem('auth-user', JSON.stringify(response.user));
      }),
      map(response => response.user),
      catchError(err =>
        throwError(() => new Error(err.error?.message || 'Signup failed'))
      )
    );
  }

  logout(): void {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    this.userSignal.set(null);
    this.tokenSignal.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.tokenSignal();
  }

  get currentUser(): User | null {
    return this.userSignal();
  }

  setCurrentUser(user: User): void {
    this.userSignal.set(user);
    localStorage.setItem('auth-user', JSON.stringify(user));
  }

  sendOtp(email: string): Observable<string> {
    const emailNormalized = new AdminUserBuilder().setEmail(email).build().email;

    return this.http.get<AdminUser[]>(`${environment.apiUrl}/users?email=${emailNormalized}`).pipe(
      switchMap(users => {
        if (users.length === 0) {
          return throwError(() => new Error('Email not found'));
        }
        const user = users[0];
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        return this.http.patch(`${environment.apiUrl}/users/${user.id}`, { otp }).pipe(
          map(() => otp)
        );
      }),
      catchError(err =>
        throwError(() => new Error(err.error?.message || 'Failed to send OTP'))
      )
    );
  }

  verifyOtp(email: string, otp: string): Observable<boolean> {
    const emailNormalized = new AdminUserBuilder().setEmail(email).build().email;

    return this.http.get<AdminUser[]>(`${environment.apiUrl}/users?email=${emailNormalized}`).pipe(
      map(users => {
        if (users.length === 0) return false;
        return users[0].otp === otp;
      }),
      catchError(() => of(false))
    );
  }

  resetPassword(email: string, otp: string, newPassword: string): Observable<boolean> {
    const emailNormalized = new AdminUserBuilder().setEmail(email).build().email;

    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/reset-password`,
      { email: emailNormalized, otp, newPassword }
    ).pipe(
      map(() => true),
      catchError(err =>
        throwError(() => new Error(err.error?.message || 'Reset password failed'))
      )
    );
  }

  getUserByEmail(email: string): Observable<AdminUser | null> {
    const normalizedEmail = new AdminUserBuilder().setEmail(email).build().email;

    return this.http.get<AdminUser[]>(`${environment.apiUrl}/users?email=${normalizedEmail}`).pipe(
      map(users => {
        if (users.length > 0) {
          const u = users[0];
          return new AdminUserBuilder()
            .setId(u.id)
            .setEmail(u.email)
            .setFirstName(u.firstName)
            .setLastName(u.lastName)
            .setRole(u.role)
            .setPassword('') 
            .setOtp('')     
            .build();
        }
        return null;
      }),
      catchError(err => {
        console.error('Failed to fetch user by email:', err);
        return of(null);
      })
    );
  }
}
