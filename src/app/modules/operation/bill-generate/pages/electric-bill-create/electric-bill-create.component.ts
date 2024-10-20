import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { BillGenerateService } from '../../services/bill-generate.service';
import { CustomerService } from 'src/app/modules/setup/services/customer.service';
import { CustomerType } from 'src/app/modules/setup/models/customer-type.enum';
import { GlobalSetupService } from 'src/app/modules/setup/services/global-setup.service';
import { AlertService } from 'src/app/@shared/AlertService';
import { DatePipe } from '@angular/common';
import { BillType } from 'src/app/modules/setup/models/bill-type.enum';



@Component({
  selector: 'app-electric-bill-create',
  templateUrl: './electric-bill-create.component.html',
  styleUrls: ['./electric-bill-create.component.css']
})
export class ElectricBillCreateComponent implements OnInit {

  electricBillForm: FormGroup;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  userList: any[];
  complexs: any[];
  customers: any;
  globalSetup: any;

  constructor(
    private fb: FormBuilder,
    private service: BillGenerateService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
    private customerService: CustomerService,
    private globalSetupService: GlobalSetupService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getAllCustomers()
    this.getGlobalSetup()
    this.createElectricBillForm()

  }

  createElectricBillForm() {

    this.electricBillForm = this.fb.group({
      customerId: 0,
      billNo: "",
      eletricBillType: 1,
      issueDate: this.formatDate(new Date()),
      dueDate: this.getLastWorkingDayFormatted(),
      presentReading: 0,
      consumedUnit: 0,
      electricCharge: 0,
      consumptionPrice:0,
      demandCharge: 0,
      serviceCharge: 0,
      principalAmount: 0,
      dutyOnKhw: 0,
      shopServiceCharge: 0,
      vat: 0,
      billMonthTotal: 0,
      billPayStatus: false,
      billPayDate: this.formatDate(new Date()),

      customerName: '',
      contactName: '',

      customerType: '',
      customerTypeId:'',
      minimumUnit: '',
      unitRate: '',
      electricMetterNo: '',
      previousReading: '',
      previousDate: this.formatDate(new Date()),

      previousDueAmount:0,
      arrearAmount:0,
      totalAmount:0
    });
  }
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  getCustomerTypeName(customerTypeNumber: number): string {
    return CustomerType[customerTypeNumber];
  }
  getGlobalSetup() {
    this.globalSetupService.getGlobalSetup().subscribe(
      (data) => {
        console.log(data);
        if (data) {
          this.globalSetup = data;
        }
      },
      (err) => {
        console.log(err);
      }
    )
  }




  getAllCustomers() {
    this.customerService
      .getAllCustomers().subscribe(
        (data: PaginatedResult<any[]>) => {
          this.customers = data;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  onChangeCustomer(event) {
    if (event) {
      
      
      this.electricBillForm.get("customerName").patchValue(event.name)
      this.electricBillForm.get("contactName").patchValue(event.contactName)
      this.electricBillForm.get("customerType").patchValue(this.getCustomerTypeName(event.customerType))
      this.electricBillForm.get("customerTypeId").patchValue(event.customerType)
      if (event.customerType == CustomerType.Commercial) {
        this.electricBillForm.get("minimumUnit").patchValue(this.globalSetup.commercialMiniUnit)
        this.electricBillForm.get("unitRate").patchValue(this.globalSetup.commercialEBill)
      }
      if (event.customerType == CustomerType.Residential) {
        this.electricBillForm.get("minimumUnit").patchValue(this.globalSetup.residentialMiniUnit)
        this.electricBillForm.get("unitRate").patchValue(this.globalSetup.residentialEBill)
      }
      this.electricBillForm.get("electricMetterNo").patchValue(event.electricMetterNo)
      this.electricBillForm.get("previousReading").patchValue(event.electricMetterLastReading?event.electricMetterLastReading:event.openingReading)
      this.electricBillForm.get("previousDate").patchValue(event.electricMetterLastReading?event.electricMetterLastReadingDate.toString().substring(0, 10).replace('T', ' '):event.openingReadingDate.toString().substring(0, 10).replace('T', ' '))

      this.getCustomerWiseDueArrear()
    }
    else {
      this.electricBillForm.reset();
    }
    

  }

  getCustomerWiseDueArrear(){
    this.service.getCustomerWiseDueArrear(BillType.ElectricBill,this.electricBillForm.value.customerId,this.electricBillForm.value.issueDate).subscribe(
      (data)=>{
        debugger
        console.log(data);
        this.electricBillForm.get("previousDueAmount").patchValue(data.previousDueAmount)
        this.electricBillForm.get("arrearAmount").patchValue(data.arrearAmount)
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }


  onEnterPresentReading(){
    var presentReading = this.electricBillForm.value.presentReading;
    var previousReading = this.electricBillForm.value.previousReading;
    var consumedUnit = presentReading - previousReading;
    var dutyOnKhw = this.globalSetup.dutyOnKHW
    var unitPrice = 0

    

    if(this.electricBillForm.value.customerTypeId == CustomerType.Residential){
      unitPrice = this.globalSetup.residentialEBill
      if(consumedUnit<this.globalSetup.residentialMiniUnit){
        consumedUnit=this.globalSetup.residentialMiniUnit
      }
    }
    if(this.electricBillForm.value.customerTypeId == CustomerType.Commercial){
      unitPrice = this.globalSetup.commercialEBill
      if(consumedUnit<this.globalSetup.commercialMiniUnit){
        consumedUnit=this.globalSetup.commercialMiniUnit
      }
    }

    if(presentReading<previousReading){
      this.alertService.warning("Present reading must be greater than previous reading")
      return
    }
    
    

    var consumptionPrice = unitPrice * consumedUnit
    var motorChargePercentage = this.globalSetup.electricMotorCharge/100

    var demandCharge = this.globalSetup.isFixDemandCharge?this.globalSetup.demandCharge:((this.globalSetup.demandCharge*consumptionPrice) / 100).toFixed(2);
    var serviceCharge = this.globalSetup.isFixServiceCharge?this.globalSetup.serviceCharge:((this.globalSetup.serviceCharge*consumptionPrice) / 100).toFixed(2);


    
debugger
    var principalAmount = Number(serviceCharge) + Number(demandCharge) + consumptionPrice;

    var vat = (this.globalSetup.vat*principalAmount) / 100;

    var billMonthTotal  =  principalAmount + vat + dutyOnKhw;

    var previousDueAmount = this.electricBillForm.value.previousDueAmount
    var arrearAmount = this.electricBillForm.value.arrearAmount

   
    this.electricBillForm.get("consumedUnit").patchValue(consumedUnit)
    this.electricBillForm.get("consumptionPrice").patchValue(consumptionPrice)
    this.electricBillForm.get("demandCharge").patchValue(demandCharge)
    this.electricBillForm.get("serviceCharge").patchValue(serviceCharge)
    this.electricBillForm.get("principalAmount").patchValue(principalAmount)
    this.electricBillForm.get("dutyOnKhw").patchValue(dutyOnKhw)
    this.electricBillForm.get("vat").patchValue(vat.toFixed(2))
    this.electricBillForm.get("billMonthTotal").patchValue(billMonthTotal.toFixed(2))
    debugger
    this.electricBillForm.get("totalAmount").patchValue((billMonthTotal+previousDueAmount+arrearAmount).toFixed(2))



  }

  checkIfDateMatches(billList: any[]): boolean {
    const constantDateObj = new Date(this.electricBillForm.value.issueDate);  // Convert constant date to Date object

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

  checkIfSameMonthBillExists(){
    
    this.service.getElectricBillByCriteria(1,1000,null,this.electricBillForm.value.customerId).subscribe(
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




  onSubmit() {



    this.service.electricBillCreate(this.electricBillForm.value).subscribe(
      (data) => {
        console.log(data);
        // this.electricBillForm.reset();

        this.showAlert(this.alertType.createSuccessAlert);
      },
      (err) => {
        console.log(err);
        
        this.alertType.errorAlert.text=err.error.errors[0];
        this.showAlert(this.alertType.errorAlert);

      }
    )
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('Electric Bill');
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

  getLastWorkingDayFormatted(): string {
    
    const lastWorkingDay = this.getLastWorkingDayOfMonth();
    return this.datePipe.transform(lastWorkingDay, 'yyyy-MM-dd') || '';
  }

}
