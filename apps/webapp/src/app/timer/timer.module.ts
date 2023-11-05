import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerComponent } from './timer.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { ScrambleComponent } from './scramble.component';
import { ScrambleService } from './scramble.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [TimerComponent, ScrambleComponent],
  imports: [
    FormsModule,
    CommonModule,
    PipesModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [TimerComponent, ScrambleComponent],
  providers: [ScrambleService],
})
export class TimerModule {}
