import { Pipe, PipeTransform } from '@angular/core';
import { formatSolveTime } from '../timer-page';
import { Solve } from '../solve-card';

@Pipe({ name: 'solveTime' })
export class FormatSolveTime implements PipeTransform {
  transform(solve: Solve | number): string {
    const asSolve = solve as Solve;
    if (asSolve?.timestamp) {
      const value = asSolve.millis + (asSolve.penalty === '+2' ? 2000 : 0);
      return formatSolveTime(value);
    } else {
      return formatSolveTime(solve as number);
    }
  }
}
