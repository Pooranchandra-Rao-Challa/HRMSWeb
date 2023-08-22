import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { AssetsDetailsViewDto, AssetsDto, AssetsViewDto } from 'src/app/_models/admin';
import { ITableHeader } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC } from 'src/app/_shared/regex';


@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styles: [
  ]
})
export class AssetsComponent {
  @ViewChild('filter') filter!: ElementRef;
  assets: AssetsViewDto[] = [];
  globalFilterFields: string[] = ['assetsType', 'assetsCategory', 'count', 'assetName', 'PurchasedDate', 'ModelNumber', 'Manufacturer',
    'SerialNumber', 'Warranty', 'AddValue', 'Description', 'Status', 'isActive'];
  fbassets!: FormGroup;
  mediumDate: string = MEDIUM_DATE;
  addFlag: boolean;
  dialog: boolean = false;
  submitLabel!: string;
  ShowassetsDetails: boolean = false;
  assetsList = [
    { name: 'Mouse', code: 'MU',AssetTypeId:8 },
    { name: 'CPU', code: 'CP' },
    { name: 'Monitor', code: 'MO' },
    { name: 'Keyboard', code: 'KY' },
    { name: 'HeadSet', code: 'HS' },
  ];
  assetsCategory = [
    { name: 'Gadgets', code: 'GD' ,AssetCategoryId:16},
    { name: 'Fixed Assets', code: 'FA' }
  ];
  statusList = [
    { name: 'Good', code: 'GUD' ,StatusId:20},
    { name: 'Bad', code: 'BD' },
  ];
  constructor(private adminService: AdminService, private formbuilder: FormBuilder, 
     private alertMessage: AlertmessageService,) {

  }
  AssetsheaderTable: ITableHeader[] = [
    { field: 'assetType', header: 'assetType', label: 'Assets Type' },
    { field: 'assetCategory', header: 'assetCategory', label: 'Assets Category' },
    { field: 'count', header: 'count', label: 'Count' },
  ];
  AssetsTypeTable: ITableHeader[] = [
    { field: 'Code', header: 'Code', label: 'Code' },
    { field: 'Name', header: 'Name', label: 'Asset Name' },
    { field: 'PurchasedDate', header: 'PurchasedDate', label: 'PurchasedDate' },
    { field: 'ModelNumber', header: 'ModelNumber', label: 'ModelNumber' },
    { field: 'Manufacturer', header: 'Manufacturer', label: 'Manufacturer' },
    { field: 'SerialNumber', header: 'SerialNumber', label: 'SerialNumber' },
    { field: 'Warranty', header: 'Warranty', label: 'Warranty' },
    { field: 'AddValue', header: 'AddValue', label: 'AddValue' },
    { field: 'Description', header: 'Description', label: 'Description' },
    { field: 'Status', header: 'Status', label: 'Status' },
    { field: 'IsActive', header: 'IsActive', label: 'Is Active' },
    { field: 'CreatedAt', header: 'CreatedAt', label: 'Created Date' },
    { field: 'CreatedBy', header: 'CreatedBy', label: 'Created By' },
    { field: 'UpdatedAt', header: 'UpdatedAt', label: 'Updated Date' },
    { field: 'UpdatedBy', header: 'UpdatedBy', label: 'Updated By' },
  ];

  ngOnInit() {
    this.assetsForm();
    this.initassets();
  }
  get FormControls() {
    return this.fbassets.controls;
  }
  initassets() {
    this.adminService.GetAssets().subscribe((resp) => {
      this.assets = resp as unknown as AssetsViewDto[];
      this.assets.forEach(element => {
        element.expandassets = JSON.parse(element.assets) as unknown as AssetsDetailsViewDto[];
      });
    })
  }
  assetsForm() {
    this.fbassets = this.formbuilder.group({
      code: new FormControl(null, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      assetType: new FormControl(null, [Validators.required]),
      assetCategory: new FormControl(null, [Validators.required]),
      assetname: new FormControl(null, [Validators.required]),
      purchasedDate: new FormControl(null, [Validators.required]),
      modelNumber: new FormControl(null),
      manufacturer: new FormControl(null),
      serialNumber: new FormControl(null),
      warranty: new FormControl(null),
      addValue: new FormControl(null),
      description: new FormControl(null),
      status: new FormControl(null, [Validators.required]),
      isActive: [null, (Validators.required)],
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  showDialog() {
    this.fbassets.reset();
    this.dialog = true;
  }
  
  addAssetsDialog() {
    this.submitLabel = "Add Assets";
    this.addFlag = true;
    this.dialog = true;

  }
  onClose() {
    this.fbassets.reset();
    this.ShowassetsDetails = false;
  }
  editAssets(assets: any) {
    this.addFlag = true;
    this.dialog = true;
    this.submitLabel = "Update Assets";
  }

  saveAssets(): Observable<HttpEvent<AssetsDto>> {
    if (this.addFlag) return this.adminService.CreateAssets(this.fbassets.value)
    else return this.adminService.UpdateAssets(this.fbassets.value)
  }

  onSubmit() { 
      this.saveAssets().subscribe(resp => {
        if (resp) {
          this.initassets();
          this.onClose();
          this.dialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "AAS001" : "AAS002"]);
        }
      })
  }
}
