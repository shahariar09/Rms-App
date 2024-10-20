import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ComplexService } from '../../services/complex.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { UserService } from 'src/app/modules/admin/services/user.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-opening-electric-meter-reading',
  templateUrl: './opening-electric-meter-reading.component.html',
  styleUrls: ['./opening-electric-meter-reading.component.css']
})
export class OpeningElectricMeterReadingComponent implements OnInit {

  customerOpeningElectricMeterReadingForm:FormGroup;

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
    private userService: UserService,
    private complexService: ComplexService,
  ) { }

  ngOnInit() {
    this.createCustomerOpeningElectricMeterReadingForm()
    this.getComplexList()
    
  }

  createCustomerOpeningElectricMeterReadingForm() {

    this.customerOpeningElectricMeterReadingForm = this.fb.group({
      customerId: null,
      customerName: null,
      contactName: null,
      openingReading: null,
      openingReadingDate: null
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
    this.customerOpeningElectricMeterReadingForm.get("customerName").patchValue(event.name)
    this.customerOpeningElectricMeterReadingForm.get("contactName").patchValue(event.contactName)
    this.customerOpeningElectricMeterReadingForm.get("openingReading").patchValue(event.openingReading)
    this.customerOpeningElectricMeterReadingForm.get("openingReadingDate").patchValue(event.openingReadingDate.toString().substring(0, 10).replace('T', ' '))
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
    var customerId = this.customerOpeningElectricMeterReadingForm.value.customerId;
    this.service.UpdateCustomerOpeningElectricMeterReading(customerId,this.customerOpeningElectricMeterReadingForm.value).subscribe(
      (data)=>{
        console.log(data);
        // this.customerOpeningElectricMeterReadingForm.reset();
       
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
