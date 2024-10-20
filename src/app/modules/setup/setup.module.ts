import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupRoutingModule } from './setup-routing.module';
import { UnitCreateComponent } from './unit/components/unit-create/unit-create.component';
import { UnitIndexComponent } from './unit/pages/unit-index/unit-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoleListComponent } from './role/role-list/role-list.component';
import { RoleCreateComponent } from './role/role-create/role-create.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CrudModule } from '../crud/crud.module';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerCreateComponent } from './customer/customer-create/customer-create.component';
import { GlobalSetupComponent } from './global-setup/global-setup.component';
import { ComplexCreateComponent } from './complex/complex-create/complex-create.component';
import { ComplexListComponent } from './complex/complex-list/complex-list.component';
import { OpeningElectricMeterReadingComponent } from './customer/opening-electric-meter-reading/opening-electric-meter-reading.component';
import { CustomerActiveDateComponent } from './customer/customer-active-date/customer-active-date.component';
import { CustomerAdvanceComponent } from './customer/customer-advance/customer-advance.component';

@NgModule({
  declarations: [
    UnitCreateComponent,
    UnitIndexComponent,
    RoleListComponent,
    RoleCreateComponent,
    CustomerListComponent,
    CustomerCreateComponent,
    GlobalSetupComponent,
    ComplexCreateComponent,
    ComplexListComponent,
    OpeningElectricMeterReadingComponent,
    CustomerActiveDateComponent,
    CustomerAdvanceComponent
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    SharedModule,
    NgbModule,
    DragDropModule,
    SharedModule,
    CrudModule,
    SweetAlert2Module.forChild(),
  ],
})
export class SetupModule {}
