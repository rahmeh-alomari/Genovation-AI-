import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar-component/sidebar-component';
import { ThemeService } from 'app/shared/services/theme.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TabVisibilityService } from 'app/shared/services/tab-visibility.service';


@Component({
  selector: 'app-dashboard-component',
   standalone: true,
 imports: [RouterModule,SidebarComponent,CommonModule,DropdownModule, FormsModule], 
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.css'],
})
export class DashboardComponent {
 themes = [
    { label: 'Light Blue', value: 'lara-light-blue' },
    { label: 'Dark Blue', value: 'lara-dark-blue' },
    { label: 'Light Green', value: 'lara-light-green' },
    { label: 'Dark Green', value: 'lara-dark-green' }
  ];
  selectedTheme = 'lara-light-blue';
constructor(private themeService: ThemeService,private tabVisibility: TabVisibilityService) {}


  ngOnInit(): void {
    this.themeService.loadSavedTheme();
      this.tabVisibility.isTabVisible$.subscribe((visible) => {
      // You can do extra stuff here when tab changes
      console.log('Tab visibility changed:', visible);
    });
  }

  onThemeChange(theme: string) {
    this.themeService.changeTheme(theme);
  }
}
