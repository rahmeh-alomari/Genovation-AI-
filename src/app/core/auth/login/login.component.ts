import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { User } from '../../../features/dashboard/models/user.model';
import { AuthService } from '../auth.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-login',
  standalone: true,
  imports:  [DialogModule,CommonModule, ReactiveFormsModule, InputTextModule,RouterModule, ButtonModule,ToastModule,ForgotPasswordComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
    providers: [MessageService]
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  showForgotPasswordDialog = false;

constructor(private toastService: MessageService, private fb: FormBuilder,private authService: AuthService,private router: Router) {
  this.loginForm=this.fb.group({
    email:['',[Validators.required, Validators.email]],
    password:['',Validators.required],
  })
}
onLogin() {
  if (this.loginForm.invalid) return;

  const { email, password } = this.loginForm.value;

  this.authService.login(email, password).subscribe({
    next: (user:User) => {
      this.router.navigate(['/dashboard']);
    },
    error: (err:Error) => {
            this.toastService.add({severity:'error', summary: 'Login Failed', detail: err?.message || 'Invalid email or password', life: 3000});

    }
  });
}

}
