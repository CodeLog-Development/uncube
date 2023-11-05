import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerPageComponent } from './timer-page.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TimerPageRoutingModule } from './timer-page-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimerModule } from '../timer/timer.module';
import { SolveCardModule } from '../solve-card/solve-card.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { SolveEntryDialogComponent } from './solve-entry.dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [TimerPageComponent, SolveEntryDialogComponent],
  imports: [
    FormsModule,
    CommonModule,
    TimerModule,
    TimerPageRoutingModule,
    MatSidenavModule,
    SolveCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
})
export class TimerPageModule {}
