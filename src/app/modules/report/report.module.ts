import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CrudModule } from '../crud/crud.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ElectricBillReportComponent } from './pages/electric-bill-report/electric-bill-report.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RentAndUtilityBillReportComponent } from './pages/rent-and-utility-bill-report/rent-and-utility-bill-report.component';
import { UtilityBillReportComponent } from './pages/utility-bill-report/utility-bill-report.component';



@NgModule({
  declarations: [
    ElectricBillReportComponent,
    RentAndUtilityBillReportComponent,
    UtilityBillReportComponent
  
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    NgxDocViewerModule,
    NgbModule,
    CrudModule,
    SweetAlert2Module.forChild(),
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
})
export class ReportModule {}
