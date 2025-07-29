import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth.service';
import { MessageService } from 'primeng/api';
import { AdminUser, SignupFormValue } from '../../../features/dashboard/models/user.model';
import { AdminUserBuilder } from 'app/features/dashboard/builders/AdminUserBuilder';
import { SocialSignUpComponent } from 'app/core/firebase/social-sign-up/social-sign-up.component';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    SocialSignUpComponent
  ], templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  providers: [MessageService],
})
export class SignupComponent {
  showPassword = false;
  signupForm!: FormGroup;
;

  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
    { label: 'Guest', value: 'guest' },
  ];
  constructor(
    private fb: FormBuilder,
    private toastService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
    });
  }
onSignup() {
  if (this.signupForm.invalid) return;

  const formValue = this.signupForm.value as SignupFormValue;

  const newUser = new AdminUserBuilder()
    .setId(Date.now())
    .setFirstName(formValue.firstName)
    .setLastName(formValue.lastName)
    .setEmail(formValue.email)
    .setPassword(formValue.password)
    .setRole(formValue.role)
    .build();

  this.authService.signup(newUser).subscribe({
    next: () => {
      this.router.navigate(['/login']);
    },
    error: (err: Error) => {
      this.toastService.add({
        severity: 'error',
        summary: 'Signup Failed',
        detail: err?.message || 'Please check your inputs and try again.',
        life: 3000
      });
    }
  });
}




}