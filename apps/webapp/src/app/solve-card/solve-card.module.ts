import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolveCardComponent } from './solve-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PipesModule } from '../pipes/pipes.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SolveDialogComponent } from './solve-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [SolveCardComponent, SolveDialogComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    PipesModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  exports: [SolveCardComponent],
})
export class SolveCardModule {}
