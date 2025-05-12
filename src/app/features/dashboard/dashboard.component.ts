import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isLoggedIn = false;

  onLoginSuccess() {
    // console.log("login success recieved.")
    this.isLoggedIn = true;
  }
}
