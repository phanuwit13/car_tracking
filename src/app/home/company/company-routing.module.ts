import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyPage } from './company.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyPage
  },
  {
    path: 'detail',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'driver',
    loadChildren: () => import('./driver/driver.module').then( m => m.DriverPageModule)
  },
  {
    path: 'car',
    loadChildren: () => import('./car/car.module').then( m => m.CarPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyPageRoutingModule {}
