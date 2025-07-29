import { Component } from '@angular/core';
import { UserCredential } from 'firebase/auth';
import { SocialAuthService } from '../social-auth.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-social-login',
  standalone: true,
  imports: [FormsModule, ButtonModule, RouterModule],
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent {
  constructor(
    private router: Router,
    private socialAuthService: SocialAuthService,
    private authService: AuthService
  ) {}


  loginWithGoogle(): void {
    this.socialAuthService.loginWithGoogle()
      .then((res: UserCredential) => {
        const userInfo = this.socialAuthService.extractUserInfo(res);
        if (!userInfo) {
          console.warn('Google email not found.');
          return;
        }
        this.socialAuthService.createUserFromSocial(userInfo).subscribe({
          next: () => {
            this.router.navigate(['/dashboard']).catch(err => console.error('Navigation Error:', err));
          },
          error: (err: Error) => {
            console.error('Create User Error:', err);
          }
        });
      })
      .catch((err: Error) => {
        if (err.message.includes('popup')) {
          console.warn('Google login popup was closed.');
        } else {
          console.error('Google login error:', err);
        }
      });
  }

  loginWithFacebook(): void {
    this.socialAuthService.loginWithFacebook()
      .then((res: UserCredential) => {
        const userInfo = this.socialAuthService.extractUserInfo(res);
        if (!userInfo) {
          console.warn('Facebook email not found.');
          return;
        }
        this.socialAuthService.createUserFromSocial(userInfo).subscribe({
          next: () => {
            this.router.navigate(['/dashboard']).catch(err => console.error('Navigation Error:', err));
          },
          error: (err:Error) => {
            console.error('Create User Error:', err);
          }
        });
      })
      .catch((err: Error) => {
        if (err.message.includes('popup')) {
          console.warn('Facebook login popup was closed.');
        } else {
          console.error('Facebook login error:', err);
        }
      });
  }
}
