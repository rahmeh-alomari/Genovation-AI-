import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar-component/sidebar-component';


@Component({
  selector: 'app-dashboard-component',
   standalone: true,
 imports: [RouterModule,SidebarComponent,CommonModule], 
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.css'],
})
export class DashboardComponent {

}
