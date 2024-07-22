import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { StatsPageComponent } from './stats-page.component';

const routes: Route[] = [
  {
    path: '',
    component: StatsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsPageRoutingModule {}
