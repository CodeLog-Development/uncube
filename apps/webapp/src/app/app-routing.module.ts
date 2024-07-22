import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Route[] = [
  {
    path: 'timer',
    loadChildren: () =>
      import('./timer-page/timer-page.module').then((m) => m.TimerPageModule),
  },
  {
    path: 'statistics',
    loadChildren: () =>
      import('./stats-page/stats-page.module').then((m) => m.StatsPageModule),
  },
  {
    path: '',
    redirectTo: 'timer',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
