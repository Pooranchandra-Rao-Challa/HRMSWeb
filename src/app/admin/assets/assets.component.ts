
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import { Table } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { ConfirmationDialogService } from 'src/app/_alerts/confirmationdialog.service';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { AssetsDetailsViewDto, AssetsDto, AssetsViewDto, LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { ConfirmationRequest, ITableHeader, PhotoFileProperties } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MAX_LENGTH_20, MAX_LENGTH_256, MAX_LENGTH_3, MAX_LENGTH_50, MAX_LENGTH_7, MIN_LENGTH_2, RG_ALPHA_NUMERIC } from 'src/app/_shared/regex';
import autoTable from 'jspdf-autotable';
import { ValidateFileThenUpload } from 'src/app/_validators/upload.validators';
import { ImagecropService } from 'src/app/_services/_imagecrop.service';
import { ReportService } from 'src/app/_services/report.service';
import * as FileSaver from "file-saver";

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html'
})
export class AssetsComponent {
  globalFilterFields: string[] = ['assetType', 'assetCategory', 'count', 'assetName', 'PurchasedDate', 'ModelNumber', 'Manufacturer',
    'SerialNumber', 'Warranty', 'AddValue', 'Description', 'Status', 'isActive'];
  @ViewChild('filter') filter!: ElementRef;
  assetTypes: LookupViewDto[] = [];
  assetCategories: LookupViewDto[] = [];
  assetstatus: LookupViewDto[] = [];
  assets: AssetsViewDto[] = [];
  asset = new AssetsDto();
  fbassets!: FormGroup;
  mediumDate: string = MEDIUM_DATE;
  addFlag: boolean;
  addFlag1: boolean;
  dialog: boolean = false;
  submitLabel!: string;
  ShowassetsDetails: boolean = false;
  deleteAsset = new AssetsDetailsViewDto();
  confirmationRequest: ConfirmationRequest = new ConfirmationRequest();
  permissions: any;
  isSubmitting: boolean = false;
  minDateValue: Date = new Date();
  selectedAssetTypeId: number = 0;
  id: number
  @ViewChild("fileUpload", { static: true }) fileUpload: ElementRef;
  fileTypes: string = ".pdf, .jpg, .jpeg, .png, .gif"
  @Output() ImageValidator = new EventEmitter<PhotoFileProperties>();
  employeeName: string;
  defaultPhoto: string;
  profileImage = '';
  imageToCrop: File;
  value: number;

  constructor(private adminService: AdminService, private formbuilder: FormBuilder,
    private alertMessage: AlertmessageService, private lookupService: LookupService,
    private confirmationDialogService: ConfirmationDialogService, private jwtService: JwtService, private imageCropService: ImagecropService,
    private reportService:ReportService,) {
  }


  AssetsheaderTable: ITableHeader[] = [
    { field: 'assetType', header: 'assetType', label: 'Assets Type' },
    { field: 'assetCategory', header: 'assetCategory', label: 'Assets Category' },
    { field: 'count', header: 'count', label: 'Count' },
  ];
  AssetsTypeTable: ITableHeader[] = [
    { field: 'employeeName', header: 'employeeName', label: 'Employee Name' },
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Asset Name' },
    { field: 'purchasedDate', header: 'purchasedDate', label: 'Purchased Date' },
    { field: 'modelNumber', header: 'modelNumber', label: 'Model Number' },
    { field: 'manufacturer', header: 'manufacturer', label: 'Manufacturer' },
    { field: 'serialNumber', header: 'serialNumber', label: 'Serial Number' },
    { field: 'warranty', header: 'warranty', label: 'Warranty' },
    { field: 'addValue', header: 'addValue', label: 'Add Value' },
    { field: 'description', header: 'description', label: 'Description' },
    { field: 'status', header: 'status', label: 'Status' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    // { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    // { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    // { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    // { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.defaultPhoto = './assets/layout/images/projectsDefault.jpg';
    this.assetsForm();
    this.initAssets(this.selectedAssetTypeId);
    this.initAssetCategories();
    this.initStatus();
    this.ImageValidator.subscribe((p: PhotoFileProperties) => {
      //console.log(p);

      if (this.fileTypes.indexOf(p.FileExtension) > 0 && p.Resize || (p.Size / 1024 / 1024 < 1
        && (p.isPdf || (!p.isPdf && p.Width <= 300 && p.Height <= 300)))) {
        this.fbassets.get('thumbnail').setValue(p.File);
      } else {
        this.alertMessage.displayErrorMessage(p.Message);
      }

    })
    this.fileUpload.nativeElement.onchange = (source) => {
      for (let index = 0; index < this.fileUpload.nativeElement.files.length; index++) {
        const file = this.fileUpload.nativeElement.files[index];
        ValidateFileThenUpload(file, this.ImageValidator, 1, '300 x 300 pixels', true);
      }
    }
  }

  initAssetTypesbyCategories(id: number) {
    this.lookupService.AssetTypes(id).subscribe((resp) => {
      if (resp) {
        this.assetTypes = resp as unknown as LookupDetailsDto[];
      }
    });
  }
  cancelSelection(event: Event): void{
    event.preventDefault();
    this.fbassets.get('thumbnail').setValue(null);
  }
  initAssetCategories() {
    this.lookupService.AssetCategories().subscribe((resp) => {
      this.assetCategories = resp as unknown as LookupViewDto[];
    });
  }

  initStatus() {
    this.lookupService.AssetStatus().subscribe((resp) => {
      this.assetstatus = resp as unknown as LookupViewDto[];
    });
  }


  initAssets(assetId: number) {
    this.adminService.GetAssets(assetId).subscribe((resp) => {
      this.assets = resp as unknown as AssetsViewDto[];
      this.assets.forEach(element => {
        element.expandassets = JSON.parse(element.assets) as unknown as AssetsDetailsViewDto[];
      });
    })
  }

  assetsForm() {
    this.fbassets = this.formbuilder.group({
      assetId: new FormControl(null),
      code: new FormControl(null, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      assetTypeId: new FormControl(null, [Validators.required]),
      assetCategoryId: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      purchasedDate: new FormControl(null, [Validators.required]),
      modelNumber: new FormControl(null, Validators.maxLength(MAX_LENGTH_50)),
      manufacturer: new FormControl(null, [Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      serialNumber: new FormControl(null, Validators.maxLength(MAX_LENGTH_20)),
      warranty: new FormControl(null, Validators.maxLength(MAX_LENGTH_3)),
      addValue: new FormControl(null, Validators.maxLength(MAX_LENGTH_7)),
      description: new FormControl(null, Validators.maxLength(MAX_LENGTH_256)),
      thumbnail:new FormControl(),
      statusId: new FormControl(null, [Validators.required]),
      isActive: (true),
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

  async addAssetsDialog() {
    this.fbassets.reset();
    this.fbassets.controls['isActive'].setValue(true);
    this.submitLabel = "Add Assets";
    this.addFlag = true;
    await this.initAssetTypesbyCategories(this.selectedAssetTypeId);
    this.dialog = true;
  }

  onClose() {
    this.fbassets.reset();
    this.ShowassetsDetails = false;
  }

  restrictSpaces(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    // Prevent the first key from being a space
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0)
      event.preventDefault();

    // Restrict multiple spaces
    if (event.key === ' ' && target.selectionStart > 0 && target.value.charAt(target.selectionStart - 1) === ' ') {
      event.preventDefault();
    }
  }

  deleteDialog(assetstypes: AssetsDetailsViewDto) {
    this.deleteAsset = assetstypes;
    this.confirmationDialogService.comfirmationDialog(this.confirmationRequest).subscribe(userChoice => {
      if (userChoice) {
        this.asset = this.deleteAsset
        this.asset.purchasedDate = new Date(this.deleteAsset.purchasedDate);
        this.asset.isActive = false;
        this.fbassets.patchValue(this.asset);
        this.addFlag1 = true;
        this.onSubmit();
      }
    });
  }

  editAssets(assets: AssetsDetailsViewDto) {
    this.asset = assets;
    this.asset.purchasedDate = new Date(assets.purchasedDate);
    this.fbassets.patchValue(this.asset);
    this.initAssetTypesbyCategories(this.asset.assetCategoryId);
    this.addFlag = false;
    this.dialog = true;
    this.addFlag1 = false;
    this.submitLabel = "Update Assets";
  }

  saveAssets(): Observable<HttpEvent<AssetsDto>> {
    if (this.addFlag) return this.adminService.CreateAssets(this.fbassets.value)
    else return this.adminService.UpdateAssets(this.fbassets.value)
  }

  save() {
    this.fbassets.value.purchasedDate = FORMAT_DATE(this.fbassets.value.purchasedDate);
    this.saveAssets().subscribe(resp => {
      if (resp) {
        this.initAssets(this.selectedAssetTypeId);
        this.onClose();
        this.dialog = false;
        if (this.addFlag) {
          this.alertMessage.displayAlertMessage(ALERT_CODES["AAS001"]);
        } else {
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag1 ? "AAS003" : "AAS002"]);
        }
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["AAS004"])
      }
    });
  }

  onSubmit() {
    if (this.isUniqueAssetsCode()) {
      this.alertMessage.displayErrorMessage(
        `Assets Code :"${this.fbassets.value.code}" Already Exists.`
      );
    }  else {
      this.save();
    }
    // else if (this.isUniqueAssetsName()) {
    //   this.alertMessage.displayErrorMessage(
    //     `Assets Name :"${this.fbassets.value.name}" Already Exists.`
    //   );
    // }
    
  }

  isUniqueAssetsCode() {
    const existingAssetsCode = this.assets.filter(assets =>
      assets.expandassets.find((expandAsset) =>
        expandAsset.code === this.fbassets.get('code').value &&
        expandAsset.assetId !== this.fbassets.get('assetId').value
      ))
    return existingAssetsCode.length > 0;
  }

  // isUniqueAssetsName() {
  //   const existingAssetsCode = this.assets.filter(assets =>
  //     assets.expandassets.find((expandAsset) =>
  //       expandAsset.name === this.fbassets.get('name').value &&
  //       expandAsset.assetId !== this.fbassets.get('assetId').value
  //     ))
  //   return existingAssetsCode.length > 0;
  // }
 
  fileChangeEvent(event: any): void {
    if (event.target.files.length) {
        this.imageToCrop = event;
    } else {
        this.profileImage = '';
    }
}

onCrop(image: File): void {
    this.imageCropService.onCrop(image, this.fbassets, 'photo');
}

  exportPdf() {
    const doc = new jsPDF('l', 'mm', 'a4');
    this.addLetterhead(doc);
    this.addBodyContent(doc);
    this.addFooter(doc);
    doc.save('assets.pdf');
  }
  addLetterhead(doc: jsPDF) {
    const headerBackgroundColor = [255, 242, 229];
    doc.setFillColor.apply(doc, headerBackgroundColor);
    const rectangleWidth = doc.internal.pageSize.width;
    const rectangleHeight = 40;
    doc.rect(0, 0, rectangleWidth, rectangleHeight, 'F');

    const logoWidth = 35;
    const logoHeight = 30;
    const logoX = 15;
    const logoY = 4;
    doc.addImage('assets/layout/images/calibrage-logo.png', 'PNG', logoX, logoY, logoWidth, logoHeight);

    const additionalTextX = 60;
    const additionalTextY = 35;
    const additionalText = 'Tel:+91-40-48525410  Web:WWW.calibrage.in  Email:info@calibrage.in';
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Set text color (black in RGB)
    doc.text(additionalText, additionalTextX, additionalTextY);

    // Set the position for the address text on the left side
    const addressX = 220; // Adjust the space between logo and address
    const addressY = 10; // Adjust the vertical position as needed
    const addressText =
      'Calibrage Info System Pvt.Ltd _ Inrhythm Solutions building, _ 4th Floor-4A, PL NO:1023,_Gurukul Society,_Madhapur, Hyderabad-500081.';
    const fontSize = 12;
    doc.setFontSize(fontSize);
    const addressParts = addressText.split('_');

    // Adjust the line height
    const lineHeight = fontSize * 0.5;
    doc.setLineHeightFactor(lineHeight);

    // Add each part of the address text on a new line without adding space
    addressParts.forEach((part, index) => {
      const yPos = addressY + index * lineHeight;
      doc.text(part.trim(), addressX, yPos);
    });
    doc.setLineHeightFactor(1.2);
  }

  addBodyContent(doc: jsPDF) {
    const head = [['Asset Type', 'Asset Category', 'Count', 'Employee Name', 'Asset Code', 'Asset Name', 'Purchased Date', 'Model Number', 'Manufacturer',
      'Serial Number', 'Warranty', 'AddValue', 'Description', 'Status']];

    autoTable(doc, {
      head: head,
      body: this.toPdfFormat(),
      startY: 45, // Adjust the starting Y position for the body content
      headStyles: { fillColor: [255, 129, 14] }
    });
  }

  addFooter(doc: jsPDF) {
    // Customize the footer as needed
    const footerText = 'Authorized Signature';
    doc.setFontSize(12);
    doc.text(footerText, 243, doc.internal.pageSize.height - 25);

  }

  toPdfFormat() {
    let data = [];
    for (let i = 0; i < this.assets.length; i++) {
      const asset = this.assets[i];
      const expandAssets = asset.expandassets;
      // Generate an array with empty strings as needed
      const numberOfEmptyStrings = 11;
      const mainGridEmptyStrings = Array(numberOfEmptyStrings).fill('');
      data.push([
        asset.assetType,
        asset.assetCategory,
        asset.count,
        ...mainGridEmptyStrings]);

      // Push data from expandassets
      for (let j = 0; j < expandAssets.length; j++) {
        const expandAsset = expandAssets[j];
        const numberOfEmptyStrings = 3;
        const innerGridEmptyStrings = Array(numberOfEmptyStrings).fill('');
        data.push([
          ...innerGridEmptyStrings,
          expandAsset.employeeName,
          expandAsset.code,
          expandAsset.name,
          expandAsset.purchasedDate,
          expandAsset.modelNumber,
          expandAsset.manufacturer,
          expandAsset.serialNumber,
          expandAsset.warranty,
          expandAsset.addValue,
          expandAsset.description,
          expandAsset.status,
        ]);
      }
    }
    return data;
  }

  downloadAssetsReport(){
    this.reportService.DownloadAssets(this.selectedAssetTypeId)
    .subscribe((resp)=>
      {
        if (resp.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * resp.loaded / resp.total);
          this.value = percentDone;
        }
        if (resp.type === HttpEventType.Response) {
          const file = new Blob([resp.body], { type: 'text/csv' });
          const document = window.URL.createObjectURL(file);
          FileSaver.saveAs(document, "AssetsReport.csv");
        }
    })
  }
}
