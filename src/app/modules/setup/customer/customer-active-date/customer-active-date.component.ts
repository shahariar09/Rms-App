import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ComplexService } from '../../services/complex.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-active-date',
  templateUrl: './customer-active-date.component.html',
  styleUrls: ['./customer-active-date.component.css']
})
export class CustomerActiveDateComponent implements OnInit {

  customerActiveDateForm:FormGroup;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  userList: any[];
  complexs: any[];
  customers: any;

  constructor(
    private fb:FormBuilder,
    private service:CustomerService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
    private complexService: ComplexService,
  ) { }

  ngOnInit() {
    this.createCustomerActiveDateForm()
    this.getComplexList()
    
  }

  createCustomerActiveDateForm() {

    this.customerActiveDateForm = this.fb.group({
      customerId: null,
      customerName: null,
      contactName: null,
      rentActiveDate: null,
      advanceRentAmount:null,
      dueAmount:null
    });
  }

  getComplexList() {
    this.complexService
      .getComplexPagination(1, 1000, null)
      .subscribe({
        next: (data: PaginatedResult<any[]>) => {
          this.complexs = data.result;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onChangeComplex(event){
    
    this.getCustomerByComplexId(event.id)
  }
  onChangeCustomer(event){
    debugger
    this.customerActiveDateForm.get("customerName").patchValue(event.name)
    this.customerActiveDateForm.get("contactName").patchValue(event.contactName)
    this.customerActiveDateForm.get("rentActiveDate").patchValue(event.rentActiveDate.toString().substring(0, 10).replace('T', ' '))
    this.customerActiveDateForm.get("advanceRentAmount").patchValue(event.advanceRentAmount)
    this.customerActiveDateForm.get("dueAmount").patchValue(event.dueAmount)
  }

  getCustomerByComplexId(complexId){

    this.service.getByComplexId(complexId).subscribe(
      (data)=>{
        console.log(data);
        this.customers = data;
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }


  onSubmit(){
    var customerId = this.customerActiveDateForm.value.customerId;
    this.service.UpdateCustomerActiveDate(customerId,this.customerActiveDateForm.value).subscribe(
      (data)=>{
        console.log(data);
        // this.customerActiveDateForm.reset();
       
        this.showAlert(this.alertType.createSuccessAlert);
      },
      (err)=>{
        console.log(err);
        this.showAlert(this.alertType.errorAlert);
        
      }
    )
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('Global Setup');
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign(
      {
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-' + style,
        },
      },
      swalOptions
    );
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
}
