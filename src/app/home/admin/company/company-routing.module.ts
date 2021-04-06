import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyPage } from './company.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyPage
  },
  {
    path: 'pending',
    loadChildren: () => import('./pending/pending.module').then( m => m.PendingPageModule)
  },
  {
    path: 'reject',
    loadChildren: () => import('./reject/reject.module').then( m => m.RejectPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyPageRoutingModule {}
