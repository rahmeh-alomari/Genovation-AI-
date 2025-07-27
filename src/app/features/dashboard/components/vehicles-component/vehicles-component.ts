import { Component, signal, WritableSignal, computed } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model.js';
import { VehicleService } from '../../services/vehicle.service';
import { SmartTableComponent } from '../../../../shared/data-table/smart-table-component/smart-table-component';
import { CardComponent } from '../../../../shared/data-card/card/card.component';
import { UtilsService } from '../../../../shared/services/utils.service';
import { VehicleEditFormComponent } from './vehicle-edit-form/vehicle-edit-form.component';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { VehicleDeleteFormComponent } from './vehicle-delete-form/vehicle-delete-form.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-vehicles-component',
  standalone: true,
  imports: [
    CommonModule,
    SmartTableComponent,
    CardComponent,
    VehicleEditFormComponent,
    VehicleDeleteFormComponent,
    DialogModule,
  ],
  templateUrl: './vehicles-component.html',
  styleUrls: ['./vehicles-component.css'],
    providers: [MessageService],
  
})
export class VehiclesComponent {
  vehicles: WritableSignal<Vehicle[]> = signal([]);
  selectedVehicle: WritableSignal<Vehicle | null> = signal(null);
  displayEditDialog: WritableSignal<boolean> = signal(false);
  deleteDialogVisible = signal(false);
  vehicleToDelete = signal<Vehicle | null>(null);
  columns = [
    { field: 'id', header: 'ID' },
    { field: 'vehicleStatus', header: 'Status' },
    { field: 'fleet', header: 'Fleet' },
    { field: 'sim', header: 'SIM' },
    { field: 'device', header: 'Device' },
    { field: 'gps', header: 'GPS' },
    { field: 'odometer', header: 'Odometer' },
    { field: 'plateNum', header: 'Plate Number' }
  ];

  cards = computed(() => {
  const vehicleList = this.vehicles();
  const fleetMap = this.utilsService.groupByCount(vehicleList, 'fleet');
  const vehicleStatusMap = this.utilsService.groupByCount(vehicleList, 'vehicleStatus');
  const registeredAtMap = this.utilsService.groupByCount(vehicleList, 'registeredAt');

  const totalVehicles = vehicleList.length;
  const activeVehicles = vehicleList.filter(v => v.vehicleStatus === 'Active').length;
  const inactiveVehicles = vehicleList.filter(v => v.vehicleStatus === 'Inactive').length;

  return [
    {
      showChart: false,
      title: 'Total Vehicles',
      value: String(totalVehicles)
    },
    {
      showChart: false,
      title: 'Active Vehicles',
      value: String(activeVehicles)
    },
    {
      showChart: false,
      title: 'Inactive Vehicles',
      value: String(inactiveVehicles)
    },

    {
      showChart: true,
      chartType: 'doughnut',
      chartData: {
        labels: Object.keys(vehicleStatusMap),
        datasets: [{
          label: 'Vehicle Status',
          data: Object.values(vehicleStatusMap),
          backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
        }]
      }
    },
    {
      showChart: true,
      chartType: 'polarArea',
      chartData: {
        labels: Object.keys(fleetMap),
        datasets: [{
          label: 'Fleet Usage',
          data: Object.values(fleetMap),
          backgroundColor: ['#2196F3', '#3F51B5', '#00BCD4', '#8BC34A', '#FF9800']
        }]
      }
    },
    {
      showChart: true,
      chartType: 'doughnut',
      chartData: {
        labels: Object.keys(registeredAtMap),
        datasets: [{
          label: 'Monthly Registrations',
          data: Object.values(registeredAtMap),
          backgroundColor: ['#9C27B0', '#E91E63', '#00ACC1']
        }]
      }
    }
  ];
});


  constructor(
    private vehicleService: VehicleService,
    private utilsService: UtilsService, private messageService: MessageService 
  ) { }

  ngOnInit() {
    this.vehicleService.getVehicles().subscribe((data: Vehicle[]) => {
      this.vehicles.set(data);
    });
  }

    loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (data: Vehicle[]) => this.vehicles.set(data),
      error: (err: Error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load vehicles.' });
      }
    });
  }

  openEditDialog(vehicle: Vehicle) {
    this.selectedVehicle.set({ ...vehicle });
    this.displayEditDialog.set(true);
  }

  handleConfirmedEdit(updatedVehicle: Vehicle) {
    this.vehicleService.updateVehicle(updatedVehicle).subscribe({
      next: (updated: Vehicle) => {
        this.vehicles.update(current =>
          current.map(v => (v.id === updated.id ? updated : v))
        );
        this.displayEditDialog.set(false);
        this.selectedVehicle.set(null);
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Vehicle updated successfully!' });
      },
      error: (err: Error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update vehicle.' });
      }
    });
  }

  confirmDelete(vehicle: Vehicle) {
    this.vehicleToDelete.set(vehicle);
    this.deleteDialogVisible.set(true);
  }

  handleConfirmedDelete(vehicle: Vehicle) {
    this.vehicleService.deleteVehicle(vehicle.id).subscribe({
      next: () => {
        this.vehicles.update(current => current.filter(v => v.id !== vehicle.id));
        this.deleteDialogVisible.set(false);
        this.vehicleToDelete.set(null);
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Vehicle deleted successfully!' });
      },
      error: (err: Error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete vehicle.' });
      }
    });
  }
}
