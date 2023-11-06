import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uncube-login-dialog',
  template: `
    <h1 mat-dialog-title>Login</h1>
    <div mat-dialog-content class="dialog-content">
      <mat-form-field color="accent">
        <mat-label>Email</mat-label>
        <input
          matInput
          type="email"
          [formControl]="emailFormControl"
          placeholder="joe@average.net"
        />
        <mat-error *ngIf="emailFormControl.hasError('email')">
          Invalid email
        </mat-error>

        <mat-error *ngIf="emailFormControl.hasError('required')">
          Email is <strong>required</strong>
        </mat-error>
      </mat-form-field>
      <mat-form-field color="accent">
        <mat-label>Password</mat-label>
        <input matInput type="password" [formControl]="passwordFormControl" />
        <mat-error *ngIf="passwordFormControl.hasError('required')">
          Password is <strong>required</strong>
        </mat-error>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="center">
      <button
        mat-raised-button
        color="primary"
        (click)="loginClick()"
        [disabled]="!valid"
      >
        Login
      </button>
      <button mat-button (click)="dialogRef.close()">Cancel</button>
    </div>
  `,
  styles: [
    `
      .dialog-content {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding-top: 5px;
        padding-bottom: 5px;
        min-width: 300px;
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AuthModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
})
export class LoginDialogComponent {
  emailFormControl = new FormControl('', [
    Validators.email,
    Validators.required,
  ]);
  passwordFormControl = new FormControl('', [Validators.required]);

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginDialogComponent>
  ) { }

  get valid() {
    return !!(
      !this.emailFormControl.hasError('required') &&
      !this.emailFormControl.hasError('email') &&
      !this.passwordFormControl.hasError('required')
    );
  }

  loginClick() {
    this.authService
      .login({
        email: this.emailFormControl.value || '',
        password: this.passwordFormControl.value || '',
      })
      .subscribe((success) => {
        console.log(success);
      });
  }
}
