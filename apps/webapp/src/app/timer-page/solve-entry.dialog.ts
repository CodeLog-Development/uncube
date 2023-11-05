import { Component } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Solve } from '../solve-card';
import { MatDialogRef } from '@angular/material/dialog';

export class TimeErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'codelog-solve-entry-dialog',
  template: `
    <h1 mat-dialog-title>Manually enter solve</h1>
    <div mat-dialog-content class="dialog-content">
      <mat-form-field color="accent">
        <mat-label>Solve Time</mat-label>
        <input
          matInput
          type="text"
          placeholder="00:00.00"
          [formControl]="timeFormControl"
        />
        <mat-error *ngIf="timeFormControl.hasError('required')">
          Solve time is <strong>required</strong>
        </mat-error>
        <mat-error *ngIf="timeFormControl.hasError('pattern')">
          Invalid format (mm:ss.xx)
        </mat-error>
      </mat-form-field>

      <mat-form-field color="accent">
        <mat-label>Scramble (optional)</mat-label>
        <input
          matInput
          type="text"
          placeholder="Enter scramble"
          [(ngModel)]="scramble"
        />
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="center">
      <button
        mat-raised-button
        (click)="saveClick()"
        color="primary"
        [disabled]="
          timeFormControl.hasError('required') ||
          timeFormControl.hasError('pattern')
        "
      >
        Save
      </button>
      <button mat-button (click)="dialogRef.close(undefined)">Cancel</button>
    </div>
  `,
  styles: [
    `
      .dialog-content {
        display: flex;
        flex-direction: column;
        margin-bottom: 0;
        padding-top: 5px;
        padding-bottom: 5px;
        gap: 10px;
      }
    `,
  ],
})
export class SolveEntryDialogComponent {
  timeFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{2}:?\d{2}.\d{2}$/g),
  ]);
  matcher = new TimeErrorStateMatcher();
  scramble = '';

  constructor(public dialogRef: MatDialogRef<SolveEntryDialogComponent>) {}

  get millis() {
    const timeStr = this.timeFormControl.value || '';
    const minutes = parseInt(timeStr.split(':')[0], 10);
    const seconds = parseInt(timeStr.split(':')[1].split('.')[0], 10);
    const centis = parseInt(timeStr.split('.')[1], 10);
    return minutes * 60000 + seconds * 1000 + centis * 10;
  }

  saveClick() {
    if (!this.timeFormControl.errors) {
      const solve: Solve = {
        millis: this.millis,
        timestamp: Date.now(),
        scramble: this.scramble || 'No scramble',
      };

      this.dialogRef.close(solve);
    }
  }
}
