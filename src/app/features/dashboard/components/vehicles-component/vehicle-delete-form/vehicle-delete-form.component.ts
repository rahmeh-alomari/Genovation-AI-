import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../../models/vehicle.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-vehicle-delete-form',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './vehicle-delete-form.component.html',
  styleUrl: './vehicle-delete-form.component.css'
})
export class VehicleDeleteFormComponent {
  @Input() visible: boolean = false;
  @Input() vehicle: Vehicle | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Vehicle>();

  confirmDelete() {
    if (this.vehicle) this.confirm.emit(this.vehicle);
  }

  cancelDelete() {
    this.cancel.emit();
  }
}
