import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyPageRoutingModule } from './company-routing.module';

import { CompanyPage } from './company.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CompanyPage],
})
export class CompanyPageModule {}
