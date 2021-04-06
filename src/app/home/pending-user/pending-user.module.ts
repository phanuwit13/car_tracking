import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingUserPageRoutingModule } from './pending-user-routing.module';

import { PendingUserPage } from './pending-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingUserPageRoutingModule
  ],
  declarations: [PendingUserPage]
})
export class PendingUserPageModule {}
