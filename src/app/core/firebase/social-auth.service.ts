import { Injectable } from '@angular/core';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { firebaseAuth } from './firebase-init';
import { AdminUserBuilder } from 'app/features/dashboard/builders/AdminUserBuilder';
import { AdminUser } from 'app/features/dashboard/models/user.model';
import { environment } from 'environments/environment';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocialAuthService {

    constructor(private http: HttpClient,private authService: AuthService) {}

 private isLoggingIn = false;
public extractUserInfo(res: UserCredential): { email: string; firstName: string; lastName: string } | null {
  const tokenEmail = (res as any)._tokenResponse?.email;
  const userEmail = res.user?.email;
  const email = userEmail || tokenEmail;

  const displayName = res.user?.displayName || (res as any)._tokenResponse?.displayName || '';

  if (!email) {
    return null;
  }

  const [firstName = '', ...lastParts] = displayName.trim().split(' ');
  const lastName = lastParts.length > 0 ? lastParts.join(' ') : '';

  return { email, firstName, lastName };
}
loginWithGoogle() {
  if (this.isLoggingIn) {
    return Promise.reject(new Error('Login in progress'));
  }

  this.isLoggingIn = true;

  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.setCustomParameters({ prompt: 'select_account' });

  return signInWithPopup(firebaseAuth, provider)
    .then(result => {
      return result; 
    })
    .finally(() => {
      this.isLoggingIn = false;
    });
}




  loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(firebaseAuth, provider);
  }



createUserFromSocial(data: {
  email: string;
  firstName: string;
  lastName: string;
}): Observable<AdminUser> {
  return this.authService.getUserByEmail(data.email).pipe(
    switchMap(existingUser => {
      if (existingUser) {
        this.authService.setCurrentUser(existingUser);
        return of(existingUser);
      }

      const newUser = new AdminUserBuilder()
        .setId(Date.now()) 
        .setEmail(data.email)
        .setFirstName(data.firstName)
        .setLastName(data.lastName)
        .setPassword('') 
        .setRole('user')
        .setOtp('')
        .build();

      return this.http.post<AdminUser>(`${environment.apiUrl}/users`, newUser).pipe(
        tap(createdUser => this.authService.setCurrentUser(createdUser))
      );
    }),
    catchError(err => throwError(() => new Error(err?.message || 'Falied Login')))
  );
}

}