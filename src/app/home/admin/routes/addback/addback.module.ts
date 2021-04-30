import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddbackPageRoutingModule } from './addback-routing.module';

import { AddbackPage } from './addback.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddbackPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddbackPage]
})
export class AddbackPageModule {}
