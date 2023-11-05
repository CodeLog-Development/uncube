import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatSolveTime } from './solve.pipe';

@NgModule({
  declarations: [FormatSolveTime],
  imports: [CommonModule],
  exports: [FormatSolveTime],
})
export class PipesModule {}
