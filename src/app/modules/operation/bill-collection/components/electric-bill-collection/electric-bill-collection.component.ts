import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { BillCollectionService } from '../../services/bill-collection.service';
import { CustomerService } from 'src/app/modules/setup/services/customer.service';
import { CustomerType } from 'src/app/modules/setup/models/customer-type.enum';
import { BillType } from 'src/app/modules/setup/models/bill-type.enum';
import { PayType } from 'src/app/modules/setup/models/pay-type.enum';
import { AlertService } from 'src/app/_alert';
import { BillGenerateService } from '../../../bill-generate/services/bill-generate.service';


@Component({
  selector: 'app-electric-bill-collection',
  templateUrl: './electric-bill-collection.component.html',
  styleUrls: ['./electric-bill-collection.component.css']
})
export class ElectricBillCollectionComponent implements OnInit {

  electricBillCollectionForm: FormGroup;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  userList: any[];
  complexs: any[];
  customers: any;
  visible: boolean = false;
  bills: any = []
  hasData: any = false
  payTypeList:any =[];
  paidAmount: any;
  bill: any;
  currentDueAmount: string;

  constructor(
    private fb: FormBuilder,
    private service: BillCollectionService,
    private billGenerateService: BillGenerateService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
    private customerService: CustomerService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.getAllCustomers()
    this.createClectricBillCollectionForm()
    this.createPayTypeList()
   

  }
  createPayTypeList(){
    this.payTypeList = Object.keys(PayType)
    .filter(key => isNaN(Number(key))) // Filter out the numeric keys
    .map(key => ({
      id: PayType[key as keyof typeof PayType],
      name: key
    }));
  }


  showDialog() {
   
    this.visible = true;

  }
  getElectricBillByCustomer(){
    this.billGenerateService.getElectricBillByCriteria(1,1000,null,this.electricBillCollectionForm.value.customerId,false).subscribe(
      (data)=>{
        this.bills = data;
        this.hasData = true;
      },
      (err)=>{
        console.log(err);
        this.hasData = false;
      }
    )
  }
  onEnterBillNo(){
    
    var bill = this.bills.find(c=>c.billNo==this.electricBillCollectionForm.value.billNo)
    if(bill){
      this.setDataToForm(bill)
    }
  }

  setDataToForm(data){
    
    this.bill = data;
 
    debugger
    if(data){
      this.electricBillCollectionForm.get("dueDate").patchValue(data.dueDate.toString().substring(0, 10).replace('T', ' '))
      this.electricBillCollectionForm.get("billMonthTotal").patchValue(data.totalAmount)
      this.electricBillCollectionForm.get("billNo").patchValue(data.billNo)
      this.electricBillCollectionForm.get("billAmount").patchValue(data.totalAmount+this.electricBillCollectionForm.value.fineAmount)
      this.electricBillCollectionForm.get("totalAmount").patchValue(data.totalAmount+this.electricBillCollectionForm.value.fineAmount)
      this.electricBillCollectionForm.get("dueAmount").patchValue((this.electricBillCollectionForm.value.totalAmount-data.paidAmount).toFixed(2))
      console.log(data);
    }
    else{
      this.electricBillCollectionForm.get("dueDate").patchValue(this.formatDate(new Date()))
      this.electricBillCollectionForm.get("billMonthTotal").patchValue(0)
      this.electricBillCollectionForm.get("billNo").patchValue(null)
      this.electricBillCollectionForm.get("billAmount").patchValue(0)
      this.electricBillCollectionForm.get("totalAmount").patchValue(0)
      this.electricBillCollectionForm.get("dueAmount").patchValue(0)
    }
    this.visible=false;
    this.currentDueAmount = (this.electricBillCollectionForm.value.totalAmount-data.paidAmount).toFixed(2)
    
    
  }
  
  onChangeLateFeeConsideration(event){
    var totalAmount = this.electricBillCollectionForm.value.totalAmount;
    
    if(event.target.checked){
      
      var lateFeePercentage = this.electricBillCollectionForm.value.lateFeePercentage;
      
      var FineAmount = (totalAmount * lateFeePercentage) / 100;
      
      this.electricBillCollectionForm.get("fineAmount").patchValue(FineAmount.toFixed(2))
      this.electricBillCollectionForm.get("billAmount").patchValue((totalAmount+FineAmount).toFixed(2))
      this.electricBillCollectionForm.get("totalAmount").patchValue((totalAmount+FineAmount).toFixed(2))

      
    }
    else{
      
      this.electricBillCollectionForm.get("fineAmount").patchValue(0)
      this.electricBillCollectionForm.get("billAmount").patchValue(totalAmount.toFixed(2))
      this.electricBillCollectionForm.get("totalAmount").patchValue(totalAmount.toFixed(2))
    }
  }
  onEnterPaymentAmount(){
    
    if(this.electricBillCollectionForm.value.paymentAmount){
      this.electricBillCollectionForm.get("dueAmount").patchValue(((this.currentDueAmount?this.currentDueAmount:this.electricBillCollectionForm.value.totalAmount)-this.electricBillCollectionForm.value.paymentAmount).toFixed(2))
    }
    else{
      this.electricBillCollectionForm.get("dueAmount").patchValue(this.currentDueAmount)
    }
    //CLEAR NOTE IF NO DUE AMOUNT
    if(!(this.electricBillCollectionForm.value.dueAmount>0)){
      this.electricBillCollectionForm.get("note").patchValue(null)
    }
  }

  onChangePayType(){
    if(this.electricBillCollectionForm.value.payType==PayType.Cash){
      
      this.electricBillCollectionForm.get("checkNo").patchValue(null)
      this.electricBillCollectionForm.get("checkDate").patchValue(null)
      this.electricBillCollectionForm.get("bankName").patchValue(null)
    }
    else{
      this.electricBillCollectionForm.get("checkDate").patchValue(this.formatDate(new Date()))
    }
  }

  createClectricBillCollectionForm() {

    this.electricBillCollectionForm = this.fb.group({
      customerId: [null, Validators.required],
      customerName: null,
      contactName: null,
      customerType: null,
      customerTypeId: null,
      fatherName: null,
      levelNo: null,
      address: null,
      name: null,
      metterNo: null,
      dueDate: this.formatDate(new Date()),
      lateFeePercentage: 5,
      billMonthTotal: 0,
      voucherDate: this.formatDate(new Date()),
      billIssueDate: this.formatDate(new Date()),


      billNo: [null, Validators.required],
      billType: BillType.ElectricBill,
      billAmount: 0,
      fineAmount: 0,
      totalAmount: 0,
      payType: PayType.Cash,
      bankName: null,
      checkNo: null,
      checkDate: this.formatDate(new Date()),
      paymentAmount:0,
      paidAmount:0,
      dueAmount:0,
      note:null
    });
  }
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  calculateDayMonthPass(issueDate,dayOrMonth){
    const today = new Date();
    const issue = new Date(issueDate);
  
    let months = today.getMonth() - issue.getMonth() + (12 * (today.getFullYear() - issue.getFullYear()));
    let days = today.getDate() - issue.getDate();
  
    // If the day difference is negative, subtract a month and calculate the correct day difference
    if (days < 0) {
      months--;
      const daysInPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += daysInPreviousMonth;
    }

    if(dayOrMonth=='day'){
      return days;
    }
    else{
      return months
    }
  }


  onChangeCustomer(event) {
    if (event) {
      this.getElectricBillByCustomer()
      

      this.electricBillCollectionForm.get("customerName").patchValue(event.name)
      this.electricBillCollectionForm.get("fatherName").patchValue(event.fatherName)
      this.electricBillCollectionForm.get("contactName").patchValue(event.contactName)
      this.electricBillCollectionForm.get("customerType").patchValue(this.getCustomerTypeName(event.customerType))
      this.electricBillCollectionForm.get("levelNo").patchValue(event.levelNo)
      this.electricBillCollectionForm.get("address").patchValue(event.address)
      this.electricBillCollectionForm.get("name").patchValue(event.name)
      this.electricBillCollectionForm.get("metterNo").patchValue(event.electricMetterNo)

      // this.electricBillCollectionForm.get("previousDate").patchValue(event.electricMetterLastReadingDate.toString().substring(0, 10).replace('T', ' '))

    }
    else {
      this.electricBillCollectionForm.reset();
    }

  }
  getCustomerTypeName(customerTypeNumber: number): string {
    return CustomerType[customerTypeNumber];
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


  onSubmit() {
   
    
    if(this.electricBillCollectionForm.invalid){
      this.alertService.error("Please Provide valid information")
      return
    }
    var customerId = this.electricBillCollectionForm.value.customerId;
    this.service.billCollection(this.electricBillCollectionForm.value).subscribe(
      (data) => {
        console.log(data);
        // this.electricBillCollectionForm.reset();
        this.getElectricBillByCustomer()
        this.showAlert(this.alertType.createSuccessAlert);
        this.electricBillCollectionForm.get("billNo").patchValue(null)
      },
      (err) => {
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
