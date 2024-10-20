import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BillReportService } from '../../services/bill-report.service';
import { CustomerService } from 'src/app/modules/setup/services/customer.service';
import { DateAdapter } from '@angular/material/core';
import { AlertService } from 'src/app/@shared/AlertService';

@Component({
  selector: 'app-electric-bill-report',
  templateUrl: './electric-bill-report.component.html',
  styleUrls: ['./electric-bill-report.component.css']
})
export class ElectricBillReportComponent implements OnInit {

  pdfSrc: any;
  customers: any;
  filterForm: FormGroup;
  monthControl = new FormControl();
  url: any;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _service: BillReportService,
    private customerService: CustomerService,
    private dateAdapter: DateAdapter<Date>,
    private alert: AlertService,
  ) {
    this.dateAdapter.setLocale('en-GB');
  }
  ngOnInit(): void {
    this.createFilterForm()
    this.getAllCustomers();
  
  }

  createFilterForm() {
    this.filterForm = this.formBuilder.group({
      customerId: [null,Validators.required],
      month:[null,Validators.required]
    });
  }

  getAllCustomers(){
    this.customerService.getAllCustomers().subscribe(
      (data)=>{
        console.log(data);
        this.customers = data;
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }
  
  viewPdfReport() {
    
    if(this.filterForm.invalid){
      this.alert.error("Please provide valid information")
      return
    }
    var reportType = 'PDF';
    this.pdfSrc = null;


    this._service
    .getElectricBillReport(this.filterForm.value.customerId,this.filterForm.value.month).subscribe(
      (blobData: Blob) => {
        
        let documentBlob = new Blob([blobData], {
          type: reportType == 'PDF' ? 'application/pdf' : '',
        });
        this.url = URL.createObjectURL(documentBlob);
        this.cdr.detectChanges();
      },
      (err) => {
        
       console.log(err);
       
      }
    );   
  }
  resetForm() {
    this.filterForm.reset();
  }

}
