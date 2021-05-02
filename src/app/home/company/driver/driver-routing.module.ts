import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverPage } from './driver.page';

const routes: Routes = [
  {
    path: '',
    component: DriverPage
  },
  {
    path: 'pending',
    loadChildren: () => import('./pending/pending.module').then( m => m.PendingPageModule)
  },
  {
    path: 'reject',
    loadChildren: () => import('./reject/reject.module').then( m => m.RejectPageModule)
  },
  {
    path: 'exp',
    loadChildren: () => import('./exp/exp.module').then( m => m.ExpPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverPageRoutingModule {}
