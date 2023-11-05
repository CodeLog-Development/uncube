import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Solve } from './solve.interface';

@Component({
  selector: 'codelog-solve-dialog',
  template: `
    <h1 mat-dialog-title>Solve</h1>
    <div mat-dialog-content>
      <h3>Solve Time</h3>
      <span class="solve-time">
        {{ data.solve.millis | solveTime }}
      </span>
      <h3>Scramble</h3>
      <span>{{ data.solve.scramble }}</span>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="closeClick()">Close</button>
    </div>
  `,
  styles: [
    `
      .solve-time {
        text-align: center;
        font-family: 'Sometype Mono', monospace;
        font-size: 24px;
      }
    `,
  ],
})
export class SolveDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { solve: Solve },
    private dialogRef: MatDialogRef<SolveDialogComponent>
  ) {}

  closeClick() {
    this.dialogRef.close();
  }
}
