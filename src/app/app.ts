import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
  import { initializeApp } from 'firebase/app';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet,ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('genovation-user-management');


  firebaseApp = initializeApp(environment.firebase);
}
