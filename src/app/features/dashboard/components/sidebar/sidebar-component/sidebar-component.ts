import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-component',
  templateUrl: './sidebar-component.html',
   standalone: true,
  styleUrl: './sidebar-component.css',
   imports: [RouterModule,CommonModule],
})
export class SidebarComponent {
 isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
