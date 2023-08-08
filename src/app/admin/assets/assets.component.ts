import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Assets } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { ITableHeader } from 'src/app/security/user/user.component';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styles: [
  ]
})
export class AssetsComponent {

  @ViewChild('filter') filter!: ElementRef;

  assets: Assets[] = [];
  globalFilterFields: string[] = ['name', 'purchasedDate', 'modelNumber', 'manufacturer', 'serialNumber', 'warranty', 'addValue', 'description', 'status'];
  fbassets!: FormGroup;
  dialog: boolean = false;
  submitLabel!: string ;
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
  headers: ITableHeader[] = [
    { field: 'Name', header: 'Name', label: 'Name' },
    { field: 'PurchasedDate', header: 'PurchasedDate', label: 'PurchasedDate' },
    { field: 'ModelNumber', header: 'ModelNumber', label: 'ModelNumber' },
    { field: 'Manufacturer', header: 'Manufacturer', label: 'Manufacturer' },
    { field: 'SerialNumber', header: 'SerialNumber', label: 'SerialNumber' },
    { field: 'Warranty', header: 'Warranty', label: 'Warranty' },
    { field: 'AddValue', header: 'AddValue', label: 'AddValue' },
    { field: 'Description', header: 'Description', label: 'Description' },
    { field: 'Status', header: 'Status', label: 'Status' },
  ];

  ngOnInit() {
    this.assetsForm();
    this.initassets();
  }
  get assetsFormControls() {
    return this.fbassets.controls;
  }
  initassets() {
    this.securityService.getassets().then(
      (data: Assets[]) =>
      (this.assets = data)
    );
  }
  assetsForm() {
    this.addfields = []
    this.fbassets = this.formbuilder.group({
      code: new FormControl('', [Validators.required]),
      assetType:new FormControl('',[Validators.required]),
      assetCategory:new FormControl('',[Validators.required]),
      name: new FormControl('', [Validators.required]),
      purchasedDate: new FormControl('', [Validators.required]),
      modelNumber: new FormControl('', [Validators.required]),
      manufacturer: new FormControl('', [Validators.required]),
      serialNumber: new FormControl('', [Validators.required]),
      warranty: new FormControl('', [Validators.required]),
      addValue: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      isActive: [true, (Validators.requiredTrue)],
      createdAt: new FormControl('', [Validators.required]),
      updatedAt: new FormControl('', [Validators.required]),
      createdBy: new FormControl('', [Validators.required]),
      updatedBy: new FormControl('', [Validators.required]),
      assetsDetails: this.formbuilder.array([])
    });
  }
  generaterow(assetsDetails: Assets = new Assets()): FormGroup {
    return this.formbuilder.group({
      id: [assetsDetails.id],
      code: new FormControl(assetsDetails.code, [Validators.required]),
      name: new FormControl(assetsDetails.name, [Validators.required]),
      purchasedDate: new FormControl(assetsDetails.purchasedDate, [Validators.required]),
      modelNumber: new FormControl(assetsDetails.modelNumber, [Validators.required]),
      manufacturer: new FormControl(assetsDetails.manufacturer, [Validators.required]),
      serialNumber: new FormControl(assetsDetails.serialNumber, [Validators.required]),
      warranty: new FormControl(assetsDetails.warranty, [Validators.required]),
      addValue: new FormControl(assetsDetails.addValue, [Validators.required]),
      description: new FormControl(assetsDetails.description, [Validators.required]),
      status: new FormControl(assetsDetails.status, [Validators.required]),
      isActive: new FormControl(assetsDetails.isActive, [Validators.required]),
      createdAt: new FormControl(assetsDetails.createdAt, [Validators.required]),
      updatedAt: new FormControl(assetsDetails.updatedAt, [Validators.required]),
      createdBy: new FormControl(assetsDetails.createdBy, [Validators.required]),
      updatedBy: new FormControl(assetsDetails.updatedBy, [Validators.required]),

    })
  }
  faassetsDetail(): FormArray {
    return this.fbassets.get("assetsDetails") as FormArray
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
  addassetsDetails() {
    this.ShowassetsDetails = true;
    this.faassetsDetails = this.fbassets.get("assetsDetails") as FormArray
    this.faassetsDetails.push(this.generaterow())

  }
  addAssetsDialog() {
    this.addassetsDetails();
    this.submitLabel = "Add Assets";
    this.dialog = true;

  }
  onClose() {
    this.fbassets.reset();
    this.ShowassetsDetails = false;
    this.faassetsDetail().clear();
  }
  editAssets(assets: any) {
    this.addassetsDetails();
    this.submitLabel = "Add Assets";
    this.dialog = true;
    this.submitLabel = "Update Assets";

  }
  onSubmit() { }

}
