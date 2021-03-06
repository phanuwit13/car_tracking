import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpPageRoutingModule } from './exp-routing.module';

import { ExpPage } from './exp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [ExpPage]
})
export class ExpPageModule {}
