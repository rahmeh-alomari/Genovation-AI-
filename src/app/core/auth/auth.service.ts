import { Injectable, signal } from '@angular/core';
import { AdminUser, User } from '../../features/dashboard/models/user.model.js';
import { map, Observable, switchAll, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSignal = signal<User | null>(null);

  constructor(private http: HttpClient) { }
  login(email: string, password: string): Observable<AdminUser> {
    return this.http
      .get<AdminUser[]>(`${environment.apiUrl}/users?email=${email}&password=${password}`)
      .pipe(
        map(users => {
          if (users.length === 0) throw new Error('Invalid email or password');
          return users[0];
        }),
        tap(user => {
          localStorage.setItem('auth-token', 'mock-token');
          this.userSignal.set(user);
        })
      );
  }
  signup(user: AdminUser): Observable<AdminUser> {
    return this.http
      .post<AdminUser>(`${environment.apiUrl}/users`, user)
      .pipe(
        tap(newUser => {
          localStorage.setItem('auth-token', 'mock-token');
          this.userSignal.set(newUser);
        })
      );
  }

  logout() {
    localStorage.removeItem('auth-token');
    this.userSignal.set(null);
  }
  isAuthenticated() {
    return !!localStorage.getItem('auth-token');
  }

  get currentUser() {
    return this.userSignal.asReadonly();
  }

   sendOtp(email: string): Observable<string> {
    return this.http.get<any[]>(`${environment.apiUrl}/users?email=${email}`).pipe(
      map(users => {
        if (users.length === 0) throw new Error('Email not found');
        const user = users[0];
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

        return this.http.patch(`${environment.apiUrl}/${user.id}`, { otp }).pipe(
          map(() => otp)
        );
      }),
      switchAll()
    );
  }

  verifyOtp(email: string, otp: string): Observable<boolean> {
    return this.http.get<any[]>(`${environment.apiUrl}?email=${email}`).pipe(
      map(users => {
        if (users.length === 0) return false;
        return users[0].otp === otp;
      })
    );
  }

  resetPassword(email: string, newPassword: string): Observable<boolean> {
    return this.http.get<any[]>(`${environment.apiUrl}?email=${email}`).pipe(
      map(users => {
        if (users.length === 0) throw new Error('User not found');
        const user = users[0];

        return this.http.patch(`${environment.apiUrl}/${user.id}`, {
          password: newPassword,
          otp: ''
        }).pipe(map(() => true));
      }),
      switchAll()
    );
  }

}
