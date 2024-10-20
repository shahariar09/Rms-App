import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ComplexService } from '../../services/complex.service';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { ComplexListComponent } from '../complex-list/complex-list.component';
import { UserService } from 'src/app/modules/admin/services/user.service';
@Component({
  selector: 'app-complex-create',
  templateUrl: './complex-create.component.html',
  styleUrls: ['./complex-create.component.css']
})
export class ComplexCreateComponent implements OnInit {

  @ViewChild(ComplexListComponent) childComponent!: ComplexListComponent;

  complexForm:FormGroup;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  userList: any[];

  constructor(
    private fb:FormBuilder,
    private service:ComplexService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.createComplexForm()
    this.getUserList()
    
  }

  getUserList(){
    this.userService.getUserPagination(1,1000,null).subscribe(
      (data:PaginatedResult<any[]>)=>{
        console.log(data);
        this.userList =  data.result;
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  setDataToForm(data){
    
    
    this.complexForm.patchValue({


      id: data.id,
      name: data.name,
      complexNo: data.complexNo,
      rentAmount: data.rentAmount,
      serviceAmout: data.serviceAmout,
      motorcycleParkingAmount: data.motorcycleParkingAmount,
      carParkingAmount: data.carParkingAmount,
      userId: data.userId

    })
  }

  createComplexForm() {
    this.complexForm = this.fb.group({
      id: null,
      name: null,
      complexNo: null,
      rentAmount: null,
      serviceAmout: null,
      motorcycleParkingAmount: null,
      carParkingAmount: null,
      userId: null
    });
  }

  onSubmit(){
    this.service.createOrUpdateComplex(this.complexForm.value).subscribe(
      (data)=>{
        console.log(data);
        this.complexForm.reset();
        this.childComponent.getComplexList()
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
