import { Injectable, signal } from '@angular/core';
import { AdminUser, User } from '../../features/dashboard/models/user.model.js';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AdminUserBuilder } from 'app/features/dashboard/builders/AdminUserBuilder';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSignal = signal<User | null>(null);

  constructor(private http: HttpClient) {}

 login(email: string, password: string): Observable<AdminUser> {
  const loginPayload = new AdminUserBuilder()
    .setEmail(email)
    .setPassword(password)
    .build();

  return this.http.post<AdminUser>(`${environment.apiUrl}/login`, loginPayload).pipe(
    tap(user => {
      localStorage.setItem('auth-token', 'mock-token');
      this.userSignal.set(user);
    }),
    catchError(err => throwError(() => new Error(err.error?.message || 'Login failed')))
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

    return this.http.post<AdminUser>(`${environment.apiUrl}/signup`, user).pipe(
      tap(newUser => {
        localStorage.setItem('auth-token', 'mock-token');
        this.userSignal.set(newUser);
      }),
      catchError(err => throwError(() => new Error(err.error?.message || 'Signup failed')))
    );
  }

  logout() {
    localStorage.removeItem('auth-token');
    this.userSignal.set(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth-token');
  }

  get currentUser() {
    return this.userSignal.asReadonly();
  }

 sendOtp(email: string): Observable<string> {
  const emailNormalized = new AdminUserBuilder().setEmail(email).build().email;

  return this.http.get<any[]>(`${environment.apiUrl}/users?email=${emailNormalized}`).pipe(
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
    catchError(err => throwError(() => new Error(err.error?.message || 'Failed to send OTP')))
  );
}


verifyOtp(email: string, otp: string): Observable<boolean> {
  const emailNormalized = new AdminUserBuilder().setEmail(email).build().email;

  return this.http.get<any[]>(`${environment.apiUrl}/users?email=${emailNormalized}`).pipe(
    map(users => {
      if (users.length === 0) return false;
      return users[0].otp === otp;
    }),
    catchError(() => [false])
  );
}

 resetPassword(email: string, otp: string, newPassword: string): Observable<boolean> {
  const emailNormalized = new AdminUserBuilder().setEmail(email).build().email;

  return this.http.post<{ message: string }>(
    `${environment.apiUrl}/reset-password`,
    { email: emailNormalized, otp, newPassword }
  ).pipe(
    map(() => true),
    catchError(err => throwError(() => new Error(err.error?.message || 'Reset password failed')))
  );
}

}
