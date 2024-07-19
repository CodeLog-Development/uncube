import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCardComponent } from './summary-card.component';
import { MatCardModule } from '@angular/material/card';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [SummaryCardComponent],
  imports: [CommonModule, MatCardModule, PipesModule],
  exports: [SummaryCardComponent],
})
export class StatisticsModule {}
