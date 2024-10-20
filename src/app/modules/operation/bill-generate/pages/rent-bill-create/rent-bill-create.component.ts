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
import { Month } from '../../models/month.enum';
import { DatePipe } from '@angular/common';
import { BillType } from 'src/app/modules/setup/models/bill-type.enum';

@Component({
  selector: 'app-rent-bill-create',
  templateUrl: './rent-bill-create.component.html',
  styleUrls: ['./rent-bill-create.component.css']
})
export class RentBillCreateComponent implements OnInit {

  electricBillForm: FormGroup;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  userList: any[];
  complexs: any[];
  customers: any;
  globalSetup: any;
  bills: any;
  electricBillDetailList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: BillGenerateService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
    private customerService: CustomerService,
    private globalSetupService: GlobalSetupService,
    private alertService: AlertService,
    private datePipe: DatePipe,
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
      totalBillAmount:0,
      customerType: '',
      customerTypeId:'',
      minimumUnit: '',
      unitRate: '',
      electricMetterNo: '',
      previousReading: '',
      previousDate: this.formatDate(new Date()),
      previousDueAmount:0,
      arrearAmount:0,
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

  getGenerateRentBill(customerId){
    this.service.getGenerateRentBill(customerId).subscribe(
      (data)=>{
        console.log(data);
        this.bills = data;
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }

  onChangeCustomer(event) {
    this.getGenerateRentBill(event.id)


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
      this.electricBillForm.get("previousReading").patchValue(event.electricMetterLastReading)
      this.electricBillForm.get("previousDate").patchValue(event.electricMetterLastReadingDate.toString().substring(0, 10).replace('T', ' '))

      this.getCustomerWiseDueArrear()

    }
    else {
      this.electricBillForm.reset();
    }

  }

  getCustomerWiseDueArrear(){
    debugger
    this.service.getCustomerWiseDueArrear(BillType.RentAndUtilityBill, this.electricBillForm.value.customerId,this.electricBillForm.value.issueDate).subscribe(
      (data)=>{
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
    var serviceCharge = this.globalSetup.serviceCharge;
    var consumedUnit = presentReading - previousReading;
    var dutyOnKhw = (this.globalSetup.dutyOnKHW/100)*consumedUnit

    

    if(this.electricBillForm.value.customerTypeId == CustomerType.Residential){
      if(consumedUnit<this.globalSetup.residentialMiniUnit){
        consumedUnit=this.globalSetup.residentialMiniUnit
      }
    }
    if(this.electricBillForm.value.customerTypeId == CustomerType.Commercial){
      if(consumedUnit<this.globalSetup.commercialMiniUnit){
        consumedUnit=this.globalSetup.commercialMiniUnit
      }
    }

    if(consumedUnit<0){
      this.alertService.warning("Present reading must be greater than previous reading")
      return
    }
    
    

    var electricCharge = this.globalSetup.commercialEBill * consumedUnit
    var motorChargePercentage = this.globalSetup.electricMotorCharge/100

    var demandCharge = this.globalSetup.demandCharge / 100;
    demandCharge = electricCharge * demandCharge;

    var totalelectricCharge = motorChargePercentage * electricCharge

    

    var principalAmount = serviceCharge + demandCharge + totalelectricCharge + dutyOnKhw + electricCharge;

    var vat = this.globalSetup.vat / 100;
    vat = principalAmount * vat;


var billMonthTotal  =  principalAmount + vat;
   
    this.electricBillForm.get("consumedUnit").patchValue(consumedUnit)
    this.electricBillForm.get("electricCharge").patchValue(totalelectricCharge)
    this.electricBillForm.get("demandCharge").patchValue(demandCharge)
    this.electricBillForm.get("serviceCharge").patchValue(serviceCharge)
    this.electricBillForm.get("principalAmount").patchValue(principalAmount)
    this.electricBillForm.get("dutyOnKhw").patchValue(dutyOnKhw)
    this.electricBillForm.get("vat").patchValue(vat.toFixed(2))
    this.electricBillForm.get("billMonthTotal").patchValue(billMonthTotal.toFixed(2))



  }




  onSubmit() {
    if(this.electricBillDetailList.length<1){
      this.alertService.error("Pick at list one month")
      return
    }
    var master = this.electricBillForm.value
    
    const totalSum = this.electricBillDetailList.reduce((acc, item) => {
      return acc + item.ServiceCharge + item.WaterBill + item.OtherBill + item.GasBillAmount + item.RentAmount;
    }, 0);
    debugger
    master.totalBillAmount = totalSum;
    master.totalAmount = totalSum+this.electricBillForm.value.previousDueAmount+this.electricBillForm.value.arrearAmount;
    master.rentAndUtilityBillDetails = this.electricBillDetailList
    
    this.service.rentBillCreate(master).subscribe(
      (data) => {
        console.log(data);
        // this.electricBillForm.reset();
        this.getGenerateRentBill(this.electricBillForm.value.customerId)
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


  onCheckBill(event, i,item) {
    if (event.target.checked) {
      debugger
      var bill = {
        MonthName: item.monthsName,
            Month: Month[item.monthsName as keyof typeof Month] ,
            Year: item.yearName, 
            ServiceCharge: item.serviceCharge,
            WaterBill:item.waterBill,       
            OtherBill:item.otherBill,       
            GasBillAmount:item.gassBill,  
            RentAmount:item.rentAmount,
            index : i
      }
      
      this.electricBillDetailList.push(bill)
    } else {
      var index = this.electricBillDetailList.findIndex(c=>c.index==i)
      this.electricBillDetailList.splice(index,i);
    }
  }

  checkIfSameMonthBillExists(){
    
    this.service.GetRentAndUtilityBillByCustomer(1,1000,null,this.electricBillForm.value.customerId,null).subscribe(
      (data)=>{
        debugger
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



  onCheckAllBills(event) {
    if (event.target.checked) {
      this.electricBillDetailList = [];
      this.bills.forEach((element) => {
        element.IsChecked = true;
        this.electricBillDetailList.push(element);
      });
    } else {
      this.electricBillDetailList = [];
    }
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

}
