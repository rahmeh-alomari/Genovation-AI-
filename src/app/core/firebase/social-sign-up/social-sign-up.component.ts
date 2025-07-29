import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { SocialAuthService } from '../social-auth.service';
import { UserCredential } from 'firebase/auth';

@Component({
  selector: 'app-social-sign-up',
  standalone: true,
  imports: [FormsModule, ButtonModule],
  templateUrl: './social-sign-up.component.html',
  styleUrls: ['./social-sign-up.component.css']
})
export class SocialSignUpComponent {
  constructor(
    private socialAuthService: SocialAuthService,
    private router: Router
  ) {}




  private handleSocialUser(userInfo: { email: string; firstName: string; lastName: string }): void {
    this.socialAuthService.createUserFromSocial(userInfo).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err:Error) => {
        console.error('Error:', err);
      }
    });
  }

  signUpWithGoogle(): void {
    this.socialAuthService.loginWithGoogle()
      .then((res:UserCredential) => {
        const userInfo = this.socialAuthService.extractUserInfo(res);
        if (!userInfo) {
          console.warn('Email not found.');
          return;
        }
        this.handleSocialUser(userInfo);
      })
      .catch((err:Error) => {
        if (err.message.includes('popup')) {
          console.warn('Window is Closed');
        } else {
          console.error('Google login error:', err);
        }
      });
  }

  signUpWithFacebook(): void {
    this.socialAuthService.loginWithFacebook()
      .then((res:UserCredential) => {
        const userInfo = this.socialAuthService.extractUserInfo(res);
        if (!userInfo) {
          console.warn('Email not found.');
          return;
        }
        this.handleSocialUser(userInfo);
      })
      .catch((err:Error) => {
        if (err.message.includes('popup')) {
          console.warn('Window is Closed');
        } else {
          console.error('Facebook login error:', err);
        }
      });
  }
}
