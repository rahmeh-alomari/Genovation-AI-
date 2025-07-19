import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar-component',
  templateUrl: './sidebar-component.html',
   standalone: true,
  styleUrl: './sidebar-component.css',
   imports: [RouterModule,CommonModule],
})
export class SidebarComponent {
 isCollapsed = false;
  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
   logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
