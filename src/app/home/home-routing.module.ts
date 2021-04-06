import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import {CheckAdminGuard} from '../guard/check-admin.guard'
import {CheckCompanyGuard} from '../guard/check-company.guard'
import {CheckDriverGuard} from '../guard/check-driver.guard'
const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule),
    canActivate : [CheckAdminGuard]
  },
  {
    path: 'pending-user',
    loadChildren: () => import('./pending-user/pending-user.module').then( m => m.PendingUserPageModule)
  },
  {
    path: 'company',
    loadChildren: () => import('./company/company.module').then( m => m.CompanyPageModule),
    canActivate : [CheckCompanyGuard]
  },
  {
    path: 'driver',
    loadChildren: () => import('./driver/driver.module').then( m => m.DriverPageModule),
    canActivate : [CheckDriverGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
