import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElectricBillCreateComponent } from './bill-generate/pages/electric-bill-create/electric-bill-create.component';
import { BillCollectionComponent } from './bill-collection/pages/bill-collection/bill-collection.component';
import { RentBillCreateComponent } from './bill-generate/pages/rent-bill-create/rent-bill-create.component';
import { UtilityBillCreateComponent } from './bill-generate/pages/utility-bill-create/utility-bill-create.component';
import { UtilityBillCollectionComponent } from './bill-collection/components/utility-bill-collection/utility-bill-collection.component';

const routes: Routes = [
  {
    path: 'electric-bill-create',
    component: ElectricBillCreateComponent,
  },
  {
    path: 'rent-bill-create',
    component: RentBillCreateComponent,
  },
  {
    path: 'utility-bill-create',
    component: UtilityBillCreateComponent,
  },
  {
    path: 'bill-Collection',
    component: BillCollectionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
