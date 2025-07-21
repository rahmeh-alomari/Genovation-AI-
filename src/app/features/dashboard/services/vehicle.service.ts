import { Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model.js';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly apiUrl = `${environment.apiUrl}/vehicles`;

  private _vehicles = signal<Vehicle[]>([]);
  vehicles: Signal<Vehicle[]> = this._vehicles.asReadonly();

  constructor(private http: HttpClient) {
    this.getVehicles();
  }

 getVehicles(): Observable<Vehicle[]> {
  return this.http.get<Vehicle[]>(this.apiUrl);
}


deleteVehicle(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}


updateVehicle(updatedVehicle: Vehicle) {
  return this.http.put<Vehicle>(`${this.apiUrl}/${updatedVehicle.id}`, updatedVehicle);
}
}
