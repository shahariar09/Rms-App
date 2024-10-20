import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { PermissionSetPageComponent } from './permission-set-page/permission-set-page.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CrudModule } from '../crud/crud.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    UserCreateComponent,
    UserListComponent,
    PermissionSetPageComponent

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    CrudModule,
    SweetAlert2Module.forChild(),
    NgbModule

  ]
})
export class AdminModule { }
