import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Assets } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { ITableHeader } from 'src/app/_models/common';
import { MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC } from 'src/app/_shared/regex';


@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styles: [
  ]
})
export class AssetsComponent {
  @ViewChild('filter') filter!: ElementRef;
  assets: Assets[] = [];
  globalFilterFields: string[] = ['assetsType', 'assetsCategory', 'count', 'assetName', 'PurchasedDate', 'ModelNumber', 'Manufacturer',
    'SerialNumber', 'Warranty', 'AddValue', 'Description', 'Status', 'isActive'];
  fbassets!: FormGroup;
  dialog: boolean = false;
  submitLabel!: string;
  addfields: any;
  faassetsDetails!: FormArray;
  ShowassetsDetails: boolean = false;
  selectedAsset: string | undefined;
  assetsList = [
    { name: 'Mouse', code: 'MU' },
    { name: 'CPU', code: 'CP' },
    { name: 'Monitor', code: 'MO' },
    { name: 'Keyboard', code: 'KY' },
    { name: 'HeadSet', code: 'HS' },
  ];
  assetsCategory = [
    { name: 'Gadgets', code: 'GD' },
    { name: 'Fixed Assets', code: 'FA' }
  ];
  constructor(private securityService: SecurityService, private formbuilder: FormBuilder) {

  }
  AssetsTable: ITableHeader[] = [
    { field: 'assetsType', header: 'assetsType', label: 'Assets Type' },
    { field: 'assetsCategory', header: 'assetsCategory', label: 'AssetsCategory' },
    { field: 'count', header: 'count', label: 'Count' },
  ];
  AssetsTypeTable: ITableHeader[] = [
    { field: 'assetName', header: 'assetName', label: 'Asset Name' },
    { field: 'PurchasedDate', header: 'PurchasedDate', label: 'PurchasedDate' },
    { field: 'ModelNumber', header: 'ModelNumber', label: 'ModelNumber' },
    { field: 'Manufacturer', header: 'Manufacturer', label: 'Manufacturer' },
    { field: 'SerialNumber', header: 'SerialNumber', label: 'SerialNumber' },
    { field: 'Warranty', header: 'Warranty', label: 'Warranty' },
    { field: 'AddValue', header: 'AddValue', label: 'AddValue' },
    { field: 'Description', header: 'Description', label: 'Description' },
    { field: 'Status', header: 'Status', label: 'Status' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
  ];

  ngOnInit() {
    this.assetsForm();
    this.initassets();
  }
  get FormControls() {
    return this.fbassets.controls;
  }
  initassets() {
    this.securityService.getassets().then(
      (data: Assets[]) =>
        (this.assets = data)
    );
  }
  assetsForm() {
    this.fbassets = this.formbuilder.group({
      code: new FormControl(null, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      assetType: new FormControl(null, [Validators.required]),
      assetCategory: new FormControl(null, [Validators.required]),
      assetname: new FormControl(null, [Validators.required]),
      purchasedDate: new FormControl(null, [Validators.required]),
      modelNumber: new FormControl(null),
      manufacturer: new FormControl(null, [Validators.required]),
      serialNumber: new FormControl(null),
      warranty: new FormControl(null),
      addValue: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      status: new FormControl(null, [Validators.required]),
      isActive: [true, (Validators.requiredTrue)],
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
    this.dialog = true;

  }
  onClose() {
    this.fbassets.reset();
    this.ShowassetsDetails = false;
  }
  editAssets(assets: any) {
    this.dialog = true;
    this.submitLabel = "Update Assets";
  }
  onSubmit() { }

}
