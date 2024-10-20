import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerService } from 'src/app/modules/setup/services/customer.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { BillGenerateService } from '../../services/bill-generate.service';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AlertService } from 'src/app/@shared/AlertService';
import { BillType } from 'src/app/modules/setup/models/bill-type.enum';

@Component({
  selector: 'app-utility-bill-create',
  templateUrl: './utility-bill-create.component.html',
  styleUrls: ['./utility-bill-create.component.css']
})
export class UtilityBillCreateComponent implements OnInit {
  utilityBillForm: FormGroup;
  customers: PaginatedResult<any[]>;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  bills: any;
  hasData: boolean;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private customerService: CustomerService,
    private service: BillGenerateService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
    private billGenerateService: BillGenerateService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.createUtilityBillForm()
    this.getCusotmerWithServiceBill()
  }

  getCusotmerWithServiceBill() {
    this.customerService
      .getCusotmerWithServiceBill().subscribe(
        (data: PaginatedResult<any[]>) => {
          this.customers = data;
        },
        (err) => {
          console.log(err);
        }
      );
  }


  createUtilityBillForm() {
    this.utilityBillForm = this.fb.group({
      customerId: 0,
      billNo: "",
      issueDate: this.formatDate(new Date()),
      dueDate: this.getLastWorkingDayFormatted(),
      serviceBillAreaSFT: 0,
      serviceBillRateSrf: 0,
      serviceBillTotalAmount: 0,
      generatorBillAmount: 0,
      towerBillAmount: 0,
      parkingBillAmount: 0,
      totalAmount: 0,
      totalBillAmount:0,
      customerName: '',
      contactName: '',
      serviceBillDueAmount: 0,
      previousDueAmount:0,
      arrearAmount: 0,

    })

  }
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getLastWorkingDayFormatted(): string {

    const lastWorkingDay = this.getLastWorkingDayOfMonth();
    return this.datePipe.transform(lastWorkingDay, 'yyyy-MM-dd') || '';
  }

  getLastWorkingDayOfMonth(): Date {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month
    let lastWorkingDay = new Date(lastDayOfMonth);

    // Adjust to last working day (considering Friday and Saturday as off days)
    while (lastWorkingDay.getDay() === 0 || lastWorkingDay.getDay() === 6) {
      lastWorkingDay.setDate(lastWorkingDay.getDate() - 1);
    }

    return lastWorkingDay;
  }

  onChangeCustomer(event) {

    if (event) {

      this.utilityBillForm.get("customerName").patchValue(event.name)
      this.utilityBillForm.get("contactName").patchValue(event.contactName)
      this.utilityBillForm.get("serviceBillAreaSFT").patchValue(event.areaSFT)
      this.utilityBillForm.get("serviceBillRateSrf").patchValue(event.serviceBillRateSrf)
      this.utilityBillForm.get("serviceBillTotalAmount").patchValue(event.areaSFT * event.serviceBillRateSrf)
      this.utilityBillForm.get("serviceBillDueAmount").patchValue(event.serviceBillDueAmount ? event.serviceBillDueAmount : 0)
      // this.utilityBillForm.get("arrear").patchValue(event.ServiceBillDueAmount ? event.ServiceBillDueAmount : 0)
      this.utilityBillForm.get("serviceBillTotalAmount").patchValue(((event.areaSFT * event.serviceBillRateSrf) + event.serviceBillDueAmount) ? (event.areaSFT * event.serviceBillRateSrf) + event.serviceBillDueAmount : 0)
      // this.utilityBillForm.get("previousDate").patchValue(event.electricMetterLastReadingDate.toString().substring(0, 10).replace('T', ' '))
      this.getCustomerWiseDueArrear()
    }
    else {
      this.utilityBillForm.reset();
    }
  }
  getCustomerWiseDueArrear(){
    debugger
    
    this.service.getCustomerWiseDueArrear(BillType.UtilityBill, this.utilityBillForm.value.customerId,this.utilityBillForm.value.issueDate).subscribe(
      (data)=>{
        console.log(data);
        this.utilityBillForm.get("previousDueAmount").patchValue(data.previousDueAmount)
        this.utilityBillForm.get("arrearAmount").patchValue(data.arrearAmount)
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }

  checkIfSameMonthBillExists(){
    
    this.service.getUtilityBillByCriteria(1,1000,null,this.utilityBillForm.value.customerId).subscribe(
      (data)=>{
        console.log(data);
        
        var isBillExist= this.checkIfDateMatches(data);
        if(isBillExist==false){
          this.onSubmit();
        }
        else{
          
          this.alertService.error("A bill has already generated in this month")
          return;
        }
        
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }

  checkIfDateMatches(billList: any[]): boolean {
    const constantDateObj = new Date(this.utilityBillForm.value.issueDate);  // Convert constant date to Date object

    // Check if any bill matches the constant date's month and year
    return billList.some(bill => {
      const issueDateObj = new Date(bill.issueDate);  // Convert issueDate to Date object

      // Compare year and month
      return (
        issueDateObj.getFullYear() === constantDateObj.getFullYear() &&
        issueDateObj.getMonth() === constantDateObj.getMonth()
      );
    });
  }


  onSubmit(){
    var towerBillAmount = this.utilityBillForm.value.towerBillAmount
    var generatorBillAmount = this.utilityBillForm.value.generatorBillAmount
    var parkingBillAmount = this.utilityBillForm.value.parkingBillAmount
    var serviceBillTotalAmount = this.utilityBillForm.value.serviceBillTotalAmount
    var  previousDueAmount = this.utilityBillForm.value.previousDueAmount
    var  arrearAmount = this.utilityBillForm.value.arrearAmount
    debugger
    this.utilityBillForm.get("totalBillAmount").patchValue(serviceBillTotalAmount+towerBillAmount+generatorBillAmount+parkingBillAmount);
    this.utilityBillForm.get("totalAmount").patchValue(
      this.utilityBillForm.value.totalBillAmount+
      previousDueAmount+
      arrearAmount
    );

    console.log(this.utilityBillForm.value);

    this.service.createUtilityBill(this.utilityBillForm.value).subscribe(
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
  
}
