import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { GlobalSetupService } from '../services/global-setup.service';

@Component({
  selector: 'app-global-setup',
  templateUrl: './global-setup.component.html',
  styleUrls: ['./global-setup.component.css']
})
export class GlobalSetupComponent implements OnInit {

  globalSetupForm: FormGroup;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  constructor(
    private fb: FormBuilder,
    private service: GlobalSetupService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.createGlobalSetupForm()
    this.getGlobalSetup()

  }
  getGlobalSetup() {
    this.service.getGlobalSetup().subscribe(
      (data) => {
        console.log(data);
        if (data) {
          this.setDataToForm(data)
        }
      },
      (err) => {
        console.log(err);
      }
    )
  }
  setDataToForm(data) {

    this.globalSetupForm.patchValue({
      id: data.id,
      residentialEBill: data.residentialEBill,
      commercialEBill: data.commercialEBill,
      residentialMiniUnit: data.residentialMiniUnit,
      commercialMiniUnit: data.commercialMiniUnit,
      dutyOnKHW: data.dutyOnKHW,
      demandCharge: data.demandCharge,
      electricMotorCharge: data.electricMotorCharge,
      serviceCharge: data.serviceCharge,
      vat: data.vat,
      delayCharge: data.delayCharge,
      isFixDemandCharge: data.isFixDemandCharge,
      isFixServiceCharge: data.isFixServiceCharge,
    })
  }

  createGlobalSetupForm() {
    this.globalSetupForm = this.fb.group({
      id: null,
      residentialEBill: null,
      commercialEBill: null,
      residentialMiniUnit: null,
      commercialMiniUnit: null,
      dutyOnKHW: null,
      demandCharge: null,
      electricMotorCharge: null,
      serviceCharge: null,
      vat: null,
      delayCharge: null,
      isFixDemandCharge: null,
      isFixServiceCharge: null,
    });
  }

  onSubmit() {
    this.service.createOrUpdateGlobalSetup(this.globalSetupForm.value).subscribe(
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
