import { Injectable, signal } from '@angular/core';
import { AdminUser, User } from '../../features/dashboard/models/user.model.js';
import { map, Observable, tap } from 'rxjs';
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
}
