import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ComplexService } from '../../services/complex.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-advance',
  templateUrl: './customer-advance.component.html',
  styleUrls: ['./customer-advance.component.css']
})
export class CustomerAdvanceComponent implements OnInit {

  customerAdvanceForm:FormGroup;

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
    this.createCustomerAdvanceForm()
    this.getComplexList()
    
  }

  createCustomerAdvanceForm() {

    this.customerAdvanceForm = this.fb.group({
      customerId: null,
      customerName: null,
      contactName: null,
      advanceRentAmount:null,
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
    
    this.customerAdvanceForm.get("customerName").patchValue(event.name)
    this.customerAdvanceForm.get("contactName").patchValue(event.contactName)
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
    var customerId = this.customerAdvanceForm.value.customerId;
    this.service.UpdateCustomerAdvance(customerId,this.customerAdvanceForm.value).subscribe(
      (data)=>{
        console.log(data);
        // this.customerAdvanceForm.reset();
       
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
