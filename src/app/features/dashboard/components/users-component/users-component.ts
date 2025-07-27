import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { SmartTableComponent } from '../../../../shared/data-table/smart-table-component/smart-table-component';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { UserDeleteFormComponent } from './user-delete-form/user-delete-form.component';
import { UserEditFormComponent } from './user-edit-form/user-edit-form.component';
import { DialogModule } from 'primeng/dialog';
import { AddUserFormComponent } from './add-user-form/add-user-form.component';
import { SidebarModule } from 'primeng/sidebar';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-users-component',
  standalone: true,
  imports: [
    SmartTableComponent,
    CommonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    MessageModule,
    MessagesModule,
    SidebarModule,
    AddUserFormComponent,
    UserEditFormComponent,
    UserDeleteFormComponent,
     
  ],
  providers: [MessageService],
  templateUrl: './users-component.html',
  styleUrls: ['./users-component.css']
})
export class UsersComponent implements OnInit {
  imagePreview: string | null = null;
  userForm: FormGroup;

  selectedUser = signal<User | null>(null);
  displayEditDialog = signal(false);
  deleteDialogVisible = signal(false);
  userToDelete = signal<User | null>(null);
  showAddDialog = signal(false);

  users = signal<User[]>([]);

  columns = [
    { field: 'role', header: 'Role' },
    { field: 'department', header: 'Department' },
    { field: 'fleet', header: 'Fleet' },
    { field: 'rfi', header: 'RFI' },
    { field: 'dPhone', header: 'D Phone' },
    { field: 'email', header: 'Email' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'middleName', header: 'Middle Name' },
    { field: 'firstName', header: 'First Name' }
  ];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService 
  ) {
    this.userForm = this.fb.group({
      role: ['', Validators.required],
      department: ['', Validators.required],
      fleet: ['', Validators.required],
      rfi: ['', Validators.required],
      dPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      lastName: ['', Validators.required],
      middleName: ['', Validators.required],
      firstName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (data: User[]) => this.users.set(data),
      error: (err: Error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users.' });
      }
    });
  }

  openAddDialog() {
    this.showAddDialog.set(true);
  }

  onUserAdded(newUser: User) {
    this.users.update(list => [...list, newUser]);
    this.messageService.add({ severity: 'success', summary: 'Added', detail: 'User added successfully!' });
    this.showAddDialog.set(false);
  }

  openEditDialog(user: User): void {
    this.selectedUser.set({ ...user });
    this.displayEditDialog.set(true);
  }

  handleConfirmedEdit(updatedUser: User): void {
    this.usersService.updateUser(updatedUser).subscribe({
      next: (updated: User) => {
        this.users.update(current =>
          current.map(u => (u.id === updated.id ? updated : u))
        );
        this.displayEditDialog.set(false);
        this.selectedUser.set(null);
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'User updated successfully!' });
      },
      error: (err: Error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user.' });
      }
    });
  }

  confirmDelete(user: User): void {
    this.userToDelete.set(user);
    this.deleteDialogVisible.set(true);
  }

  handleConfirmedDelete(user: User): void {
    this.usersService.deleteUser(user.id).subscribe({
      next: () => {
        this.users.update(current => current.filter(u => u.id !== user.id));
        this.deleteDialogVisible.set(false);
        this.userToDelete.set(null);
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'User deleted successfully!' });
      },
      error: (err: Error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user.' });
      }
    });
  }
}
