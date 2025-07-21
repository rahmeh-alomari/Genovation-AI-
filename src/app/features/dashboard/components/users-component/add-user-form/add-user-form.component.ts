import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user.model.js';
import type { WritableSignal } from '@angular/core';

@Component({
  selector: 'app-add-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ButtonModule
  ],
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css']
})
export class AddUserFormComponent {
  @Input({ required: true }) showDialog!: WritableSignal<boolean>;

  isSubmitting = false;
  @Output() userAdded = new EventEmitter<User>();

  userForm: FormGroup;

  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'User', value: 'user' }
  ];

  labelMap: Record<string, string> = {
    department: 'Department',
    fleet: 'Fleet',
    rfi: 'RFI',
    dPhone: 'Phone Number',
    email: 'Email'
  };

  constructor(private fb: FormBuilder, private usersService: UsersService) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      department: ['', Validators.required],
      fleet: ['', Validators.required],
      rfi: ['', Validators.required],
      dPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const newUser = this.userForm.value;
      this.usersService.addUser(newUser).subscribe({
        next: (addedUser: User) => {
          this.userForm.reset();
          this.userForm.markAsPristine();
          this.userForm.markAsUntouched();

          this.userAdded.emit(addedUser);
          this.showDialog.set(false);
          this.isSubmitting = false;
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
