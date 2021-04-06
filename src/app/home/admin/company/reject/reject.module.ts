import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RejectPageRoutingModule } from './reject-routing.module';

import { RejectPage } from './reject.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RejectPageRoutingModule
  ],
  declarations: [RejectPage]
})
export class RejectPageModule {}
