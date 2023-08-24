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
  globalFilterFields: string[] = ['assetsType', 'assetsCategory', 'count', 'assetName', 'PurchasedDate', 'ModelNumber', 'Manufacturer',
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
  messageService: any;
  deletedialog: boolean;
  deleteAsset: any;
  constructor(private adminService: AdminService, private formbuilder: FormBuilder,
    private alertMessage: AlertmessageService, private lookupService: LookupService,) {
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
      AssetId: new FormControl(null),
      Code: new FormControl(null, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      AssetTypeId: new FormControl(null, [Validators.required]),
      AssetCategoryId: new FormControl(null, [Validators.required]),
      Name: new FormControl(null, [Validators.required]),
      PurchasedDate: new FormControl(null, [Validators.required]),
      ModelNumber: new FormControl(null),
      Manufacturer: new FormControl(null),
      SerialNumber: new FormControl(null),
      Warranty: new FormControl(null),
      AddValue: new FormControl(null),
      Description: new FormControl(null),
      StatusId: new FormControl(null, [Validators.required]),
      IsActive: [null],
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

  Dialog(assetstypes) {
    this.deleteAsset = assetstypes;
    this.deletedialog = true;

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
  deleteassettype() {
    this.asset.AssetId = this.deleteAsset.AssetId;
    this.asset.Code = this.deleteAsset.Code;
    this.asset.Name = this.deleteAsset.Name;
    this.asset.AssetTypeId = this.deleteAsset.AssetTypeId;
    this.asset.AssetCategoryId = this.deleteAsset.AssetCategoryId;
    this.asset.PurchasedDate = this.deleteAsset.PurchasedDate;
    this.asset.ModelNumber = this.deleteAsset.ModelNumber;
    this.asset.Manufacturer = this.deleteAsset.Manufacturer;
    this.asset.SerialNumber = this.deleteAsset.SerialNumber;
    this.asset.Warranty = this.deleteAsset.Warranty;
    this.asset.AddValue = this.deleteAsset.AddValue;
    this.asset.Description = this.deleteAsset.Description;
    this.asset.StatusId = this.deleteAsset.StatusId;
    this.asset.IsActive = false;
    this.fbassets.patchValue(this.asset);
    this.addFlag = false;
    this.onSubmit();
    this.deletedialog = false
  }
  editAssets(assets: AssetsDetailsViewDto) {
    this.asset.AssetId = assets.AssetId;
    this.asset.Code = assets.Code;
    this.asset.Name = assets.Name;
    this.asset.AssetTypeId = assets.AssetTypeId;
    this.asset.AssetCategoryId = assets.AssetCategoryId;
    this.asset.PurchasedDate = assets.PurchasedDate;
    this.asset.ModelNumber = assets.ModelNumber;
    this.asset.Manufacturer = assets.Manufacturer;
    this.asset.SerialNumber = assets.SerialNumber;
    this.asset.Warranty = assets.Warranty;
    this.asset.AddValue = assets.AddValue;
    this.asset.Description = assets.Description;
    this.asset.StatusId = assets.StatusId;
    this.asset.IsActive = assets.IsActive;
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
