import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendingUserPage } from './pending-user.page';

const routes: Routes = [
  {
    path: '',
    component: PendingUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingUserPageRoutingModule {}
