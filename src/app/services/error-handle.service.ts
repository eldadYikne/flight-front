import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // Optional: For user notifications
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandleService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
    }

    console.error('Error occurred:', errorMessage);

    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
    });

    // You can also throw the error or return a custom observable if needed
    return of(null);
    throw error; // or return throwError(error);
  }
}
