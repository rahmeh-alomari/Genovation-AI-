import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';         
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule,],
  providers: [MessageService],                         
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  step: 'email' | 'otp' = 'email';

  forgotPasswordForm: FormGroup;
  @Output() closeDialog = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService     
  ) {
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
        next: (otp: any) => {
          console.log("ptp",otp)
          this.messageService.add({ severity: 'success', summary: 'OTP Sent', detail: 'OTP sent to your email.' });
          this.step = 'otp';
        },
        error: (err: Error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        },
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
    const email = this.forgotPasswordForm.get('email')?.value;
    const otp = this.forgotPasswordForm.get('otp')?.value;
    const newPassword = this.forgotPasswordForm.get('newPassword')?.value;

    this.authService.resetPassword(email, otp, newPassword).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password reset successfully!',
          life: 3000,
        });
        // Wait 3 seconds, then reset step and form & close dialog
        setTimeout(() => {
          this.step = 'email';
          this.forgotPasswordForm.reset();
          this.closeDialog.emit();
        }, 3000);
      },
      error: (err: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
          life: 5000,
        });
      },
    });
  } else {
    this.forgotPasswordForm.get('otp')?.markAsTouched();
    this.forgotPasswordForm.get('newPassword')?.markAsTouched();
  }
}

}
