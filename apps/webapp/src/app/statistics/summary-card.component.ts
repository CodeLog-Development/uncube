import { Component, Input } from '@angular/core';
import { Solve } from '../solve-card';

@Component({
  selector: 'uncube-summary-card',
  templateUrl: 'summary-card.component.html',
  styleUrl: 'summary-card.component.scss',
})
export class SummaryCardComponent {
  @Input({ required: true })
  solves: Solve[];

  get ao3(): number {
    const count = Math.min(3, this.solves.length);
    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += this.solves[i].millis;
    }

    if (count === 0) {
      return 0;
    } else {
      return sum / count;
    }
  }

  get pb(): number {
    if (this.solves.length === 0) {
      return 0;
    }

    let best = Number.MAX_SAFE_INTEGER;
    this.solves.forEach((solve) => {
      if (solve.millis < best) {
        best = solve.millis;
      }
    });

    return best;
  }

  get ao5(): number {
    const count = Math.min(5, this.solves.length);
    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += this.solves[i].millis;
    }

    if (count === 0) {
      return 0;
    } else {
      return sum / count;
    }
  }
}
