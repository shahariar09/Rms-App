import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElectricBillReportComponent } from './pages/electric-bill-report/electric-bill-report.component';
import { RentAndUtilityBillReportComponent } from './pages/rent-and-utility-bill-report/rent-and-utility-bill-report.component';
import { UtilityBillReportComponent } from './pages/utility-bill-report/utility-bill-report.component';


const routes: Routes = [
  {
    path: 'electric-bill',
    component: ElectricBillReportComponent,
  },
  {
    path: 'rent-utility-bill',
    component: RentAndUtilityBillReportComponent,
  },
  {
    path: 'utility-bill',
    component: UtilityBillReportComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
