import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user/user-list/user-list.component';
import { PermissionSetPageComponent } from './permission-set-page/permission-set-page.component';
import { UserCreateComponent } from './user/user-create/user-create.component';

const routes: Routes = [
  {
    path: 'user/index',
    component: UserListComponent,
  },
  {
    path: 'user/create',
    component: UserCreateComponent,
  },
  {
    path:'user/edit/:id',
    component: UserCreateComponent
  },
  {
    path: 'menu-distribution',
    component: PermissionSetPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
