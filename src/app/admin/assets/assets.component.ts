import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { AssetsDetailsViewDto, AssetsDto, AssetsViewDto, LookupDetailViewDto } from 'src/app/_models/admin';
import { ITableHeader } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC } from 'src/app/_shared/regex';


@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
})
export class AssetsComponent {
  globalFilterFields: string[] = ['assetType', 'assetCategory', 'count', 'assetName', 'PurchasedDate', 'ModelNumber', 'Manufacturer',
    'SerialNumber', 'Warranty', 'AddValue', 'Description', 'Status', 'isActive'];
  @ViewChild('filter') filter!: ElementRef;
  assetTypes: LookupDetailViewDto[] = [];
  assetCategories: LookupDetailViewDto[] = [];
  assetstatus: LookupDetailViewDto[] = [];
  assets: AssetsViewDto[] = [];
  asset = new AssetsDto();
  fbassets!: FormGroup;
  mediumDate: string = MEDIUM_DATE;
  addFlag: boolean;
  dialog: boolean = false;
  submitLabel!: string;
  ShowassetsDetails: boolean = false;
  deletedialog: boolean;
  deleteAsset = new AssetsDetailsViewDto();

  constructor(private adminService: AdminService, private formbuilder: FormBuilder,
    private alertMessage: AlertmessageService, private lookupService: LookupService,) {
  }

  AssetsheaderTable: ITableHeader[] = [
    { field: 'assetType', header: 'assetType', label: 'Assets Type' },
    { field: 'assetCategory', header: 'assetCategory', label: 'Assets Category' },
    { field: 'count', header: 'count', label: 'Count' },
  ];
  AssetsTypeTable: ITableHeader[] = [
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Asset Name' },
    { field: 'purchasedDate', header: 'purchasedDate', label: 'PurchasedDate' },
    { field: 'modelNumber', header: 'modelNumber', label: 'ModelNumber' },
    { field: 'manufacturer', header: 'manufacturer', label: 'Manufacturer' },
    { field: 'serialNumber', header: 'serialNumber', label: 'SerialNumber' },
    { field: 'warranty', header: 'warranty', label: 'Warranty' },
    { field: 'addValue', header: 'addValue', label: 'AddValue' },
    { field: 'description', header: 'description', label: 'Description' },
    { field: 'status', header: 'status', label: 'Status' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  ngOnInit() {
    this.assetsForm();
    this.initAssets();
    this.initAssetTypes();
    this.initAssetCategories();
    this.initStatus();
  }

  initAssetTypes() {
    this.lookupService.AssetTypes().subscribe((resp) => {
      this.assetTypes = resp as unknown as LookupDetailViewDto[];
    });
  }
  initAssetCategories() {
    this.lookupService.AssetCategories().subscribe((resp) => {
      this.assetCategories = resp as unknown as LookupDetailViewDto[];
    });
  }

  initStatus() {
    this.lookupService.AssetStatus().subscribe((resp) => {
      this.assetstatus = resp as unknown as LookupDetailViewDto[];
    });
  }

  initAssets() {
    this.adminService.GetAssets().subscribe((resp) => {
      this.assets = resp as unknown as AssetsViewDto[];
      this.assets.forEach(element => {
        element.expandassets = JSON.parse(element.assets) as unknown as AssetsDetailsViewDto[];
      });
    })
  }

  assetsForm() {
    this.fbassets = this.formbuilder.group({
      assetId: new FormControl(null),
      code: new FormControl(null, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      assetTypeId: new FormControl(null, [Validators.required]),
      assetCategoryId: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      purchasedDate: new FormControl(null, [Validators.required]),
      modelNumber: new FormControl(null),
      manufacturer: new FormControl(null),
      serialNumber: new FormControl(null),
      warranty: new FormControl(null),
      addValue: new FormControl(null),
      description: new FormControl(null),
      statusId: new FormControl(null, [Validators.required]),
      isActive: [null],
    });
  }

  get FormControls() {
    return this.fbassets.controls;
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

  deleted() {
    this.deletedialog = false
  }

  Dialog(assetstypes:AssetsDetailsViewDto) {
    this.deleteAsset = assetstypes;
    this.deletedialog = true;
  }

  deleteassettype() {
    this.asset.assetId = this.deleteAsset.assetId;
    this.asset.code = this.deleteAsset.code;
    this.asset.name = this.deleteAsset.name;
    this.asset.assetTypeId = this.deleteAsset.assetTypeId;
    this.asset.assetCategoryId = this.deleteAsset.assetCategoryId;
    this.asset.purchasedDate = this.deleteAsset.purchasedDate;
    this.asset.modelNumber = this.deleteAsset.modelNumber;
    this.asset.manufacturer = this.deleteAsset.manufacturer;
    this.asset.serialNumber = this.deleteAsset.serialNumber;
    this.asset.warranty = this.deleteAsset.warranty;
    this.asset.addValue = this.deleteAsset.addValue;
    this.asset.description = this.deleteAsset.description;
    this.asset.statusId = this.deleteAsset.statusId;
    this.asset.isActive = false;
    this.fbassets.patchValue(this.asset);
    this.addFlag = false;
    this.onSubmit();
    this.deletedialog = false
  }

  editAssets(assets: AssetsDetailsViewDto) {
    this.asset.assetId = assets.assetId;
    this.asset.code = assets.code;
    this.asset.name = assets.name;
    this.asset.assetTypeId = assets.assetTypeId;
    this.asset.assetCategoryId = assets.assetCategoryId;
    this.asset.purchasedDate = new Date(assets.purchasedDate);
    this.asset.modelNumber = assets.modelNumber;
    this.asset.manufacturer = assets.manufacturer;
    this.asset.serialNumber = assets.serialNumber;
    this.asset.warranty = assets.warranty;
    this.asset.addValue = assets.addValue;
    this.asset.description = assets.description;
    this.asset.statusId = assets.statusId;
    this.asset.isActive = assets.isActive;
    this.fbassets.patchValue(this.asset);
    this.addFlag = false;
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
        this.initAssets();
        this.onClose();
        this.dialog = false;
        this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "AAS001" : "AAS002"]);
      }
    })
  }

}
