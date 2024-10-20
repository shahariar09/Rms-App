import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertService } from 'src/app/_alert';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CustomerService } from '../../services/customer.service';
import { ComplexService } from '../../services/complex.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { CustomerType } from '../../models/customer-type.enum';
import { CustomerListComponent } from '../customer-list/customer-list.component';
import { GassBillType } from '../../models/gass-bill-type.enum';
import { StoveType } from '../../models/stove-type.enum';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css']
})
export class CustomerCreateComponent implements OnInit {

  @Output() successFullCreateOrUpdate: EventEmitter<any> = new EventEmitter();
  @Output() cancelButtonClick: EventEmitter<any> = new EventEmitter();

  @ViewChild(CustomerListComponent, { static: false }) childComponent!: CustomerListComponent;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  customerForm: FormGroup;
  @Input() id: number;
  units: any[] = [];
  passwordShow: boolean;
  matchPasswordShow: boolean;
  matched: boolean;
  selectedRoles = [];
  complexs: any[];
  customerTypeList: { id: any; name: string; }[] = [];
  gassBillTypes: any = []
  stoveTypes: any = [];


  constructor(
    private fb: FormBuilder,
    private service: CustomerService,
    private alertService: AlertService,
    private commonServiceService: CommonServiceService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
    private complexService: ComplexService,
  ) { }

  ngOnInit() {
    console.log(this.id);
    this.createcustomerForm();
    if (this.id > 0) {
      this.getCustomerById(this.id);
    }
    this.getComplexList()
    this.createCustomerTypeList()
    this.createGassBillTypeList()
    this.createStoveTypeList()

  }
  createCustomerTypeList() {
    this.customerTypeList = Object.keys(CustomerType)
      .filter(key => isNaN(Number(key))) // Filter out the numeric keys
      .map(key => ({
        id: CustomerType[key as keyof typeof CustomerType],
        name: key
      }));
  }
  createGassBillTypeList() {
    this.gassBillTypes = Object.keys(GassBillType)
      .filter(key => isNaN(Number(key))) // Filter out the numeric keys
      .map(key => ({
        id: GassBillType[key as keyof typeof GassBillType],
        name: key
      }));
  }
  createStoveTypeList() {
    this.stoveTypes = Object.keys(StoveType)
      .filter(key => isNaN(Number(key))) // Filter out the numeric keys
      .map(key => ({
        id: StoveType[key as keyof typeof StoveType],
        name: key
      }));
      console.log(this.stoveTypes);
      
  }


  createcustomerForm() {

    this.customerForm = this.fb.group({
      id: null,
      complexId: null,
      name: null,
      fatherName: null,
      address: null,
      mobileNumber: null,
      phoneNumber: null,
      nid: null,
      email: null,
      customerType: null,
      dob: null,
      contactName: null,
      levelNo: null,
      fixElectricBillAmount: null,
      electricBillType: null,
      electricMetterNo: null,
      electricMetterLastReading: null,
      electricMetterLastReadingDate: null,
      discontinued: null,
      openingReading: null,
      rentAmount: null,
      serviceCharge: null,
      waterBill: null,
      otherBill: null,
      gasBillType: null,
      gasBillUnitPrice: null,
      gasStoveType: null,
      gasSingleStoveAmount: null,
      gasDoubleStoveAmount: null,
      rentActiveDate: null,
      advanceRentAmount: null,
      gasOpeningReading: null,
      gasMeterLastReading: null,
      gasMeterLastReadingDate: null,
      imageUrl: null,
      nidImageUrl: null,
      otherDocumentUrl: null,
      isGasBillRequired: false,
      isWaterBillRequired: null,
      areaSft: null,
      rateSrf: null,
      dueAmount: null,
      motorcycleQuantity: null,
      carQuantity: null,
      isRentFixed: false,
      isFixedElectricBill: false,
      imageFile: null,
      nidImageFile: null,
      otherDocumentFile: null,
      isFixElectricBill:false,

      gassBillType:null,
      gassBillUnitPrice:null,
      deedStartDate: this.formatDate(new Date()),
      deedEndDate: this.formatDate(new Date()),
      securityDeposit:null,
      serviceBillRateSrf:0

    });

  }
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  getCustomerById(id) {
    this.service.getById(id).subscribe(
      (data) => {
        console.log(data);
        this.customerForm.patchValue({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          contactPersonName: data.contactPersonName,
          code: data.code,
        });
      },

      (err) => {
        console.log(err);
      }
    );
  }
  validationMessages = {
    name: {
      required: 'First name is required.',
    },

    email: {
      pattern: 'Email is invalid.',
    },

    phone: {
      required: 'Phone Number is required.',
      pattern: 'Invalid phone number',
    },


  };

  formError = {
    name: '',
    email: '',
    whatsAppNumber: '',
    phone: '',
  };

  prepareToSave() {
    const formData = new FormData();

    Object.keys(this.customerForm.controls).forEach(key => {
      const value = this.customerForm.get(key)?.value;

      // Append to FormData only if the value is not null or undefined
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    return formData;


  }






  onSubmit() {

    var formData = this.prepareToSave()


    if (this.customerForm.invalid) {
      this.logValidationErrorsCeckingBeforeSubmit(this.customerForm);
      this.alertService.error('Please Provide Valid Information.');
      console.log(this.formError);
      return;
    }
    
    if(this.customerForm.value.id){
      this.service.UpdateCustomer(this.customerForm.value.id,formData).subscribe(
        (data) => {
          console.log(data);
          this.showAlert(this.alertType.createSuccessAlert);
        },
        (err) => {
          console.log(err);
          this.showAlert(this.alertType.errorAlert);
        }
      )
    }
    else{
      this.service.createCustomer(formData).subscribe(
        (data) => {
          console.log(data);
          this.showAlert(this.alertType.createSuccessAlert);
        },
        (err) => {
          console.log(err);
          this.showAlert(this.alertType.errorAlert);
        }
      )
    }

    
  }

  onCancel() {
    this.cancelButtonClick.emit(true);

    this.commonServiceService.onCancelButtonClicked.next(true);
  }
  logValidationErrors(group: FormGroup = this.customerForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formError[key] = '';
      if (
        abstractControl &&
        abstractControl.invalid &&
        (abstractControl.touched ||
          abstractControl.dirty ||
          abstractControl.value !== '')
      ) {
        const message = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formError[key] += message[errorKey];
          }
        }
      }
    });
  }

  logValidationErrorsCeckingBeforeSubmit(
    group: FormGroup = this.customerForm
  ): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formError[key] = '';
      if (abstractControl && abstractControl.invalid) {
        const message = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formError[key] += message[errorKey];
          }
        }
      }
    });
  }

  checkExist() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      const rmTypeCode = value.trim();
      var found = this.units.find(
        (c) => c.name.toLowerCase().trim() == value.toLowerCase().trim()
      );
      if (found) {
        return { checkExist: 'true' };
      } else {
        return null;
      }
    };
  }



  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('Purchase');
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



  imageChangeHandler(event: any) {
    
    const file = event.target.files[0];
    const reader = new FileReader();
    this.customerForm.get('imageFile').patchValue(file);
    reader.onload = (e: any) => {
      this.customerForm.get('imageUrl').patchValue(e.target.result);
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
    const inputElement = event.target as HTMLInputElement;
  }
  nidImageChangeHandler(event: any) {
    
    const file = event.target.files[0];
    const reader = new FileReader();
    this.customerForm.get('nidImageFile').patchValue(file);
    reader.onload = (e: any) => {
      this.customerForm.get('nidImageUrl').patchValue(e.target.result);
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
    const inputElement = event.target as HTMLInputElement;
  }
  OtherDocumentChangeHandler(event: any) {
    
    const file = event.target.files[0];
    const reader = new FileReader();
    this.customerForm.get('otherDocumentFile').patchValue(file);
    reader.onload = (e: any) => {
      this.customerForm.get('otherDocumentUrl').patchValue(e.target.result);
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
    const inputElement = event.target as HTMLInputElement;
  }

  removeImage() {
    this.customerForm.get('imageFile').patchValue(null);
    this.customerForm.get('imageUrl').patchValue(null);
    this.cdr.detectChanges();
  }
  removeNidImage() {
    this.customerForm.get('nidImageUrl').patchValue(null);
    this.customerForm.get('nidImageFile').patchValue(null);
    this.cdr.detectChanges();
  }
  removeDocument() {
    this.customerForm.get('otherDocumentUrl').patchValue(null);
    this.customerForm.get('otherDocumentFile').patchValue(null);
    this.cdr.detectChanges();
  }
  // onChangeComplex(event) {
  //   this.childComponent.getCustomerByComplexId(event.id)
  // }
  onChangeGassBillType(){
    if(this.customerForm.value.gassBillType==1){
      this.customerForm.get("gasStoveType").patchValue(null)
      this.customerForm.get("gasSingleStoveAmount").patchValue(null)
      this.customerForm.get("gasDoubleStoveAmount").patchValue(null)
    }
    if(this.customerForm.value.gassBillType==2){
      this.customerForm.get("gassBillUnitPrice").patchValue(null)
    }
  }

  onChangeStoveType(){
    
    if(this.customerForm.value.gasStoveType==1){
      this.customerForm.get("gasDoubleStoveAmount").patchValue(null)
    }
    if(this.customerForm.value.gasStoveType==2){
      this.customerForm.get("gasSingleStoveAmount").patchValue(null)
    }
  }
  onChangeFixRent(){
    
    this.customerForm.get("rateSrf").patchValue(null)
    this.customerForm.get("rentAmount").patchValue(null)
    // this.customerForm.get("areaSft").patchValue(null)
  }

  setDataToForm(data) {
    

    this.customerForm.patchValue({

      id: data.id,
      complexId: data.complexId,
      name: data.name,
      fatherName: data.fatherName,
      address: data.address,
      mobileNumber: data.mobileNumber,
      phoneNumber: data.phoneNumber,
      nid: data.nid,
      email: data.email,
      customerType: data.customerType,
      dob: data.dob,
      contactName: data.contactName,
      levelNo: data.levelNo,
      fixElectricBillAmount: data.fixElectricBillAmount,
      electricBillType: data.electricBillType,
      electricMetterNo: data.electricMetterNo,
      electricMetterLastReading: data.electricMetterLastReading,
      electricMetterLastReadingDate: data.electricMetterLastReadingDate,
      discontinued: data.discontinued,
      openingReading: data.openingReading,
      rentAmount: data.rentAmount,
      serviceCharge: data.serviceCharge,
      waterBill: data.waterBill,
      otherBill: data.otherBill,
      gasBillType: data.gasBillType,
      gasBillUnitPrice: data.gasBillUnitPrice,
      gasStoveType: data.gasStoveType,
      gasSingleStoveAmount: data.gasSingleStoveAmount,
      gasDoubleStoveAmount: data.gasDoubleStoveAmount,
      rentActiveDate: data.rentActiveDate,
      advanceRentAmount: data.advanceRentAmount,
      gasOpeningReading: data.gasOpeningReading,
      gasMeterLastReading: data.gasMeterLastReading,
      gasMeterLastReadingDate: data.gasMeterLastReadingDate,
      imageUrl: data.imageUrl,
      nidImageUrl: data.nidImageUrl,
      otherDocumentUrl: data.otherDocumentUrl,
      isGasBillRequired: data.isGasBillRequired,
      isWaterBillRequired: data.isWaterBillRequired,
      areaSft: data.areaSFT,
      rateSrf: data.rateSrf,
      dueAmount: data.dueAmount,
      motorcycleQuantity: data.motorcycleQuantity,
      carQuantity: data.carQuantity,
      isRentFix: data.isRentFix,
      isFixElectricBill: data.isFixElectricBill,
      imageFile: data.imageFile,
      nidImageFile: data.nidImageFile,
      otherDocumentFile: data.otherDocumentFile,
      gassBillType: data.gassBillType,
      gassBillUnitPrice: data.gassBillUnitPrice,
      isRentFixed: data.isRentFixed,
      deedStartDate: data.deedStartDate.toString().substring(0, 10).replace('T', ' '),
      deedEndDate: data.deedEndDate.toString().substring(0, 10).replace('T', ' '),
      securityDeposit: data.securityDeposit,
      serviceBillRateSrf: data.serviceBillRateSrf,

    })
  }

}
