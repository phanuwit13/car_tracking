import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPage } from './register.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  },
  {
    path: 'company',
    loadChildren: () => import('./company/company.module').then( m => m.CompanyPageModule)
  },
  {
    path: 'driver',
    loadChildren: () => import('./driver/driver.module').then( m => m.DriverPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPageRoutingModule {}
