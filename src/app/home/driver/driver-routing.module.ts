import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverPage } from './driver.page';

const routes: Routes = [
  {
    path: '',
    component: DriverPage
  },
  {
    path: 'detail',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./start/start.module').then( m => m.StartPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverPageRoutingModule {}
