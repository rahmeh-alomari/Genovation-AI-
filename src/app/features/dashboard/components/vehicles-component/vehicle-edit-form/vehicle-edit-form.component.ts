import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import type { Vehicle } from '../../../models/vehicle.model.js';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-vehicle-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
  ],
  templateUrl: './vehicle-edit-form.component.html',
  styleUrls: ['./vehicle-edit-form.component.css']
})
export class VehicleEditFormComponent implements OnInit {
  @Input() vehicle!: Vehicle;
  @Input() visible: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Vehicle>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      plateNum: new FormControl(this.vehicle?.plateNum || '', [Validators.required, Validators.minLength(3)]),
      fleet: new FormControl(this.vehicle?.fleet || '', Validators.required),
      sim: new FormControl(this.vehicle?.sim || ''),
      device: new FormControl(this.vehicle?.device || ''),
      gps: new FormControl(this.vehicle?.gps || ''),
      odometer: new FormControl(this.vehicle?.odometer || null),
      vehicleStatus: new FormControl(this.vehicle?.vehicleStatus || '', Validators.required),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const updatedVehicle = { ...this.vehicle, ...this.form.value };
      this.save.emit(updatedVehicle);
      this.closeDialog();
    } else {
      this.form.markAllAsTouched();
    }
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onCancel() {
    this.cancel.emit();
    this.closeDialog();
  }
}
