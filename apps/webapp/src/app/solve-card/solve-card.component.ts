import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Solve, SolvePenalty } from './solve.interface';
import { MatDialog } from '@angular/material/dialog';
import { SolveDialogComponent } from './solve-dialog.component';
import { MatChipListboxChange } from '@angular/material/chips';

@Component({
  selector: 'uncube-solve-card',
  templateUrl: './solve-card.component.html',
  styleUrls: ['./solve-card.component.scss'],
})
export class SolveCardComponent {
  @Input({ required: true })
  solve: Solve = { millis: 0, timestamp: 0, scramble: '' };
  @Output()
  discard = new EventEmitter<string>();
  @Output()
  penaltyChange = new EventEmitter<SolvePenalty | undefined>();
  @Output()
  changed = new EventEmitter<Solve>();

  constructor(private dialog: MatDialog) { }

  get millis(): number {
    return this.solve?.millis || 0;
  }

  get dnf(): boolean {
    return this.solve?.penalty === 'dnf';
  }

  get plusTwo(): boolean {
    return this.solve?.penalty === '+2';
  }

  discardClick() {
    this.discard.emit(this.solve.id || '');
  }

  clickSolveTime() {
    this.dialog.open(SolveDialogComponent, {
      data: {
        solve: this.solve,
      },
      autoFocus: false,
    });
  }

  chipListChange(event: MatChipListboxChange) {
    this.solve.penalty = event.value;
    this.penaltyChange.emit(event.value);
    this.changed.emit(this.solve);
  }
}
