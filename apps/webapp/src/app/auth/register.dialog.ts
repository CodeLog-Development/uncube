import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'uncube-register-dialog',
  templateUrl: 'register.dialog.html',
  styles: [
    `
      .dialog-content {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
        padding-bottom: 0;
      }
    `,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  standalone: true,
})
export class RegisterDialogComponent {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  usernameFormControl = new FormControl('', [Validators.required]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  confirmFormControl = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  get hasError(): boolean {
    return !!(
      this.emailFormControl.hasError('required') ||
      this.emailFormControl.hasError('email') ||
      this.usernameFormControl.hasError('required') ||
      this.passwordFormControl.hasError('required') ||
      this.passwordFormControl.hasError('minLength') ||
      this.confirmFormControl.hasError('required')
    );
  }

  registerClick() {
    if (this.passwordFormControl.value !== this.confirmFormControl.value) {
      this.snackBar.open('Passwords do not match', 'CLOSE');
      return;
    }

    this.authService
      .register({
        email: this.emailFormControl.value || '',
        username: this.usernameFormControl.value || '',
        password: this.passwordFormControl.value || '',
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.log(err);
          this.snackBar.open(`Error: ${err.error.message}`, 'CLOSE');
          return of(undefined);
        })
      )
      .subscribe((result) => {
        if (result !== undefined) {
          this.snackBar.open(
            'User registered. Please confirm your email.',
            'CLOSE'
          );
          this.dialogRef.close();
        }
      });
  }
}
