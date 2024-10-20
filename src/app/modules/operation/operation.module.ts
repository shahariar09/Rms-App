import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationRoutingModule } from './operation-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrudModule } from '../crud/crud.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ElectricBillCreateComponent } from './bill-generate/pages/electric-bill-create/electric-bill-create.component';
import { BillCollectionComponent } from './bill-collection/pages/bill-collection/bill-collection.component';
import { ElectricBillCollectionComponent } from './bill-collection/components/electric-bill-collection/electric-bill-collection.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RentBillCreateComponent } from './bill-generate/pages/rent-bill-create/rent-bill-create.component';
import { RentUtilityBillCollectionComponent } from './bill-collection/components/rent-utility-bill-collection/rent-utility-bill-collection.component';
import { UtilityBillCreateComponent } from './bill-generate/pages/utility-bill-create/utility-bill-create.component';
import { UtilityBillCollectionComponent } from './bill-collection/components/utility-bill-collection/utility-bill-collection.component';


@NgModule({
  declarations: [
    ElectricBillCreateComponent,
    BillCollectionComponent,
    ElectricBillCollectionComponent,
    RentBillCreateComponent,
    RentUtilityBillCollectionComponent,
    UtilityBillCreateComponent,
    UtilityBillCollectionComponent
  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
    SharedModule,
    CrudModule,
    SweetAlert2Module.forChild(),
    DialogModule,
    ButtonModule, InputTextModule
  ]
})
export class OperationModule { }
