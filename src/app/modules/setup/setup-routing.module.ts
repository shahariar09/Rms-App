import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleListComponent } from './role/role-list/role-list.component';
import { UnitIndexComponent } from './unit/pages/unit-index/unit-index.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { GlobalSetupComponent } from './global-setup/global-setup.component';
import { ComplexCreateComponent } from './complex/complex-create/complex-create.component';
import { CustomerCreateComponent } from './customer/customer-create/customer-create.component';
import { OpeningElectricMeterReadingComponent } from './customer/opening-electric-meter-reading/opening-electric-meter-reading.component';
import { CustomerActiveDateComponent } from './customer/customer-active-date/customer-active-date.component';
import { CustomerAdvanceComponent } from './customer/customer-advance/customer-advance.component';

const routes: Routes = [
  {
    path: 'role/index',
    component: RoleListComponent,
  },

  {
    path: 'customer',
    component: CustomerCreateComponent,
  },
  {
    path: 'opening-electric-meter-reading',
    component: OpeningElectricMeterReadingComponent,
  },
  {
    path: 'customer-active-date',
    component: CustomerActiveDateComponent,
  },
  {
    path: 'customer-advance',
    component: CustomerAdvanceComponent,
  },
  {
    path: 'unit/index',
    component: UnitIndexComponent,
  },
  {
    path: 'global-setup',
    component: GlobalSetupComponent,
  },
  {
    path: 'complex',
    component: ComplexCreateComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
