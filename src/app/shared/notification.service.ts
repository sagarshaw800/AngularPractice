import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  show(message: string, action: string = 'Close', duration: number = 3000) {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'right', 
      verticalPosition: 'bottom', 
    });
  }

  showSuccess(message: string) {
    this.show(message, 'Close', 3000);
  }

  showError(message: string) {
    this.show(message, 'Close', 5000);
  }
}
