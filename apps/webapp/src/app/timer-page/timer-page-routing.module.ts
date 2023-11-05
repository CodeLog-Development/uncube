import { NgModule } from '@angular/core';
import { TimerPageComponent } from './timer-page.component';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    component: TimerPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimerPageRoutingModule {}
