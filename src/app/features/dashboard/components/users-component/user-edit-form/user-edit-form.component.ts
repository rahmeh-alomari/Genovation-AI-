import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import type { User } from '../../../models/user.model.js';

@Component({
  selector: 'app-user-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    DialogModule
  ],
  templateUrl: './user-edit-form.component.html',
  styleUrls: ['./user-edit-form.component.css']
})
export class UserEditFormComponent implements OnInit {
  @Input() user!: User;  
  @Input() displayEditDialog: boolean = false; 
  @Input() visible = false;

  @Output() save = new EventEmitter<User>();  
  @Output() cancel = new EventEmitter<void>();
  @Output() displayEditDialogChange = new EventEmitter<boolean>();

  form: FormGroup = new FormGroup({});

  fields = [
    { name: 'role', label: 'Role', required: true, dropdown: true, options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Viewer', value: 'viewer' }
      ] 
    },    
    { name: 'department', label: 'Department', required: true },
    { name: 'fleet', label: 'Fleet', required: true },
    { name: 'rfi', label: 'RFI', required: true },
    { name: 'dPhone', label: 'D Phone', required: true },
    { name: 'email', label: 'Email', required: true },
    { name: 'lastName', label: 'Last Name', required: true },
    { name: 'middleName', label: 'Middle Name', required: true },
    { name: 'firstName', label: 'First Name', required: true }
  ];

  ngOnInit() {
    for (const field of this.fields) {
      const key = field.name as keyof User; 
      this.form.addControl(
        field.name,
        new FormControl(this.user ? this.user[key] : '', field.required ? Validators.required : null)
      );
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const updatedUser = { ...this.user, ...this.form.value };
      this.save.emit(updatedUser);
      this.closeDialog();
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.closeDialog();
  }

  closeDialog() {
    this.displayEditDialog = false;
    this.displayEditDialogChange.emit(false);
  }
}
