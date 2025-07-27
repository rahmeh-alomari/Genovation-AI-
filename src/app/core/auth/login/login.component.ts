import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from '../../../features/dashboard/models/user.model';
import { AuthService } from '../auth.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { DialogModule } from 'primeng/dialog';
import { AdminUserBuilder } from 'app/features/dashboard/builders/AdminUserBuilder';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DialogModule, CommonModule, ReactiveFormsModule, InputTextModule, RouterModule, ButtonModule, ForgotPasswordComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  showForgotPasswordDialog = false;

  constructor(
    private toastService: MessageService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

 onLogin() {
  if (this.loginForm.invalid) return;

  const formValue = this.loginForm.value;

  const loginPayload = new AdminUserBuilder()
    .setEmail(formValue.email)
    .setPassword(formValue.password)
    .build();

  this.authService.login(loginPayload.email, loginPayload.password).subscribe({
    next: (user: User) => {
      this.router.navigate(['/dashboard']);
    },
    error: (err: Error) => {
      this.toastService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: err?.message || 'Invalid email or password',
        life: 3000,
      });
    },
  });
}

}
