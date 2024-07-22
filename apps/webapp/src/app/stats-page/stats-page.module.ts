import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsPageComponent } from './stats-page.component';
import { StatsPageRoutingModule } from './stats-page-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { StatisticsModule } from '../statistics/statistics.module';
import { SolveCardModule } from '../solve-card/solve-card.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [StatsPageComponent],
  imports: [
    CommonModule,
    StatisticsModule,
    StatsPageRoutingModule,
    SolveCardModule,
    MatSidenavModule,
    NgxChartsModule,
  ],
})
export class StatsPageModule { }
