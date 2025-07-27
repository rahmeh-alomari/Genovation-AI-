import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  step: 'email' | 'otp' = 'email';

  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder,private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

onSendOtp() {
  const email = this.forgotPasswordForm.get('email')?.value;

  if (this.forgotPasswordForm.get('email')?.valid) {
    this.authService.sendOtp(email).subscribe({
      next: (otp) => {
        console.log('✅ OTP sent:', otp); 
        this.step = 'otp'; 
      },
      error: (err) => {
        alert(err.message);
      }
    });
  } else {
    this.forgotPasswordForm.get('email')?.markAsTouched();
  }
}


  onResetPassword() {
    if (
      this.forgotPasswordForm.get('otp')?.valid &&
      this.forgotPasswordForm.get('newPassword')?.valid
    ) {
      const otp = this.forgotPasswordForm.get('otp')?.value;
      const newPassword = this.forgotPasswordForm.get('newPassword')?.value;
      console.log('Verify OTP and reset password:', { otp, newPassword });
    } else {
      this.forgotPasswordForm.get('otp')?.markAsTouched();
      this.forgotPasswordForm.get('newPassword')?.markAsTouched();
    }
  }
}
