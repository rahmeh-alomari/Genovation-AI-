import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-delete-form',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  templateUrl: './user-delete-form.component.html',
  styleUrls: ['./user-delete-form.component.css']
})
export class UserDeleteFormComponent {
  @Input() visible = false;
  @Input() user: User | null = null;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<User>();

  confirmDelete() {
    if (this.user) this.confirm.emit(this.user);
  }

  cancelDelete() {
    this.cancel.emit();
  }
}
