import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/_alert';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { ComplexService } from '../../services/complex.service';

@Component({
  selector: 'app-complex-list',
  templateUrl: './complex-list.component.html',
  styleUrls: ['./complex-list.component.css']
})
export class ComplexListComponent implements OnInit {

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;
  
  numberOfEntries: number;
  currentPage: number;
  pageSize: number;
  searchForm: FormGroup;
  searchKey: any;
  spin: boolean = false;
  hasData: boolean;
  complexs: any[] = [];
  isSubmit: boolean;
  isCancel: boolean;
  kloading: boolean;
  idToDelete: any;
  editId: any;
  isOpenAction: number | null = null;
  swalOptions: SweetAlertOptions = {};
  isForDeleteId: number;
  isShowFilter: any = false;
  isFilter = false;
  @Output() onClickEdit: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private service: ComplexService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private alertService: AlertService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.pageSize = 10;
    this.currentPage = 1;
    this.createFilterForm();
    this.getComplexList();
  }

  setNumberOfTableEntries(event: any) {
    this.pageSize = +event.target.value;
    this.getComplexList();
  }

  getComplexList() {
    this.editId = null;
    this.spin = true;
    this.service
      .getComplexPagination(this.currentPage, this.pageSize, this.searchKey)
      .subscribe({
        next: (data: PaginatedResult<any[]>) => {
          this.complexs = data.result;
          this.spin = false;
          if (data?.result?.length > 0) {
            this.hasData = true;
          } else {
            this.hasData = false;
          }
          this.numberOfEntries = data?.pagination?.totalItems;
        },

        error: (err) => {
          this.spin = false;
          console.log('spin=' + this.spin);
          this.hasData = false;
        },
      });
  }
  
  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the click event from bubbling up
    this.isOpenAction = this.isOpenAction === index ? null : index;
  }

  closeDropdown(): void {
    this.isOpenAction = null;
  }
  resetFilterForm() {
    // this.searchForm.get('Year').patchValue('2024');
  }
  toggleFilter() {
    this.isShowFilter = !this.isShowFilter;
  }
  filterData() {
    this.searchKey = this.searchForm.value.searchKey;
    this.pageSize = this.searchForm.value.pageSize;
    this.getComplexList();
  }

  updatePageWiseTableData(event) {
    this.currentPage = event;
    this.getComplexList();
  }

  setEditableDataToForm(data){
    
    this.onClickEdit.emit(data);
  }


  createFilterForm() {
    this.searchForm = this.fb.group({
      searchKey: null,
      pageSize:10
    });
  }

  reloadData() {
    this.currentPage = 1;
    this.getComplexList();
  }

  getRegionListByCriteria(event) {
    this.pageSize = Number(event.pageSize);
    this.searchKey = event.searchKey;
    this.getComplexList();
  }

  onCancelPopUp() {
    document.getElementById('close-button').click();
  }

  filterModalPopUp(advanceFilterModal) {
    this.modalService.open(advanceFilterModal, { size: 'lg' });
  }

  deleteButtonClick(id) {
    
    this.isForDeleteId = id;
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.showAlert(this.alertType.deleteSuccessAlert);
      }
    });
  }

  triggerDelete() {
    this.service.deleteComplex(this.isForDeleteId).subscribe(
      (data) => {
        this.alertService.success('Information Saved Successfully');
        this.getComplexList();
      },
      (err) => {
        console.log(err);
        this.alertService.error('Information Saved ');
      }
    );
  }
  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('CommitteeCategory');
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
