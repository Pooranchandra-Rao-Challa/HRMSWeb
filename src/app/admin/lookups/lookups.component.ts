import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { elementAt, Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FormArrayValidationForDuplication } from 'src/app/_common/unique-branch-validators';
import { LookupDetailsDto, LookupDetailViewDto, LookUpHeaderDto, LookupViewDto } from 'src/app/_models/admin';
import { ITableHeader } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { MAX_LENGTH_20, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';


@Component({
  selector: 'app-lookup',
  templateUrl: './lookups.component.html'
})

export class LookupsComponent implements OnInit {
  globalFilterFields: string[] = ['code', 'name', 'isActive', 'createdAt']
  @ViewChild('filter') filter!: ElementRef;
  showDialog: boolean = false;
  fblookup!: FormGroup;
  falookUpDetails!: FormArray;
  addfields: any;
  addFlag: boolean = true;
  submitLabel!: string;
  maxLength: any;
  lookups: LookupViewDto[] = [];
  lookupDetails: LookupDetailViewDto = new LookupDetailViewDto();
  lookup: LookUpHeaderDto = new LookUpHeaderDto();
  ShowlookupDetails: boolean = false;
  isLookupChecked: boolean = false;
  isbool: boolean;
  constructor(private formbuilder: FormBuilder, private adminService: AdminService, private alertMessage: AlertmessageService) { }

  lookupHeader: ITableHeader[] = [
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];
  lookupDetailsHeader: ITableHeader[] = [
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'description', header: 'description', label: 'Description' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ]


  ngOnInit(): void {
    this.lookupForm();
    this.onChangeisLookupChecked();

  }
  get FormControls() {
    return this.fblookup.controls;
  }
  onChangeisLookupChecked() {
    this.GetLookUp(this.isLookupChecked)
  }
  // getmethod
  GetLookUp(isbool: boolean) {
    this.adminService.GetLookUp(isbool).subscribe((resp) => {
      this.lookups = resp as unknown as LookupViewDto[];
      this.lookups.forEach(element => {
        element.expandLookupDetails = JSON.parse(element.lookupDetails) as unknown as LookupDetailsDto[];
      });
      console.log(this.lookups);
    })
  }
  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }
  lookupForm() {
    this.addfields = []
    this.fblookup = this.formbuilder.group({
      lookupId: [0],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      isActive: [true],
      lookUpDetails: this.formbuilder.array([], FormArrayValidationForDuplication())
    });
  }
  //  post lookup 
  savelookup(): Observable<HttpEvent<LookUpHeaderDto>> {
    if (this.addFlag) {
      return this.adminService.CreateLookUp(this.fblookup.value)
    }
    else return this.adminService.UpdateLookUp(this.fblookup.value)
  }

  isUniqueLookupCode() {
    const existingLookupCodes = this.lookups.filter(lookup =>
      lookup.code === this.fblookup.value.code &&
      lookup.lookupId !== this.fblookup.value.lookUpId
    )
    return existingLookupCodes.length > 0;
  }

  isUniqueLookupName() {
    const existingLookupNames = this.lookups.filter(lookup =>
      lookup.name === this.fblookup.value.name &&
      lookup.lookupId !== this.fblookup.value.lookUpId
    )
    return existingLookupNames.length > 0;
  }
  onSubmit() {
    if (this.fblookup.valid) {
      if (this.addFlag) {
        if (this.isUniqueLookupCode()) {
          this.alertMessage.displayErrorMessage(
            `Lookup Code :"${this.fblookup.value.code}" Already Exists.`
          );
        } else if (this.isUniqueLookupName()) {
          this.alertMessage.displayErrorMessage(
            `Lookup Name :"${this.fblookup.value.name}" Already Exists.`
          );
        } else {
          this.save();
        }
      } else {
        this.save();
      }
    } else {
      this.fblookup.markAllAsTouched();
    }
  }

  save() {
    if (this.fblookup.valid) {
      this.savelookup().subscribe(resp => {
        if (resp) {
          debugger
          this.GetLookUp(false);
          this.onClose();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SML001" : "SML002"]);
        }
      })
    }
    else {
      this.fblookup.markAllAsTouched();
    }
  }
  generaterow(lookupDetail: LookupDetailViewDto = new LookupDetailViewDto()): FormGroup {
    return this.formbuilder.group({
      lookupId: [0],
      lookupDetailId: [0],
      code: new FormControl(lookupDetail.code, [Validators.required,]),
      name: new FormControl(lookupDetail.name, [Validators.required, Validators.minLength(2)]),
      isActive: [lookupDetail.isActive = true],
    })
  }
  formArrayControls(i: number, formControlName: string) {
    return this.falookupDetails().controls[i].get(formControlName);
  }

  falookupDetails(): FormArray {
    return this.fblookup.get("lookUpDetails") as FormArray
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }


  addLookupDetails() {
    this.ShowlookupDetails = true;
    this.falookUpDetails = this.fblookup.get("lookUpDetails") as FormArray
    this.falookUpDetails.push(this.generaterow())

  }
  addLookupDialog() {
    this.addLookupDetails();
    this.fblookup.controls['name'].enable();
    this.fblookup.controls['isActive'].setValue(true);
    this.submitLabel = "Add Lookup";
    this.showDialog = true;
  }
  onClose() {
    this.fblookup.reset();
    this.ShowlookupDetails = false;
    this.falookupDetails().clear();
  }
  initlookupDetails(lookupId: number) {
    this.adminService.GetlookupDetails(lookupId).subscribe((resp) => {
      this.lookupDetails = resp[0] as unknown as LookupDetailViewDto;
      this.lookupDetails.expandLookupDetails = JSON.parse(this.lookupDetails.lookupDetails);
      this.lookupDetails.expandLookupDetails.forEach((lookupDetails: LookupDetailViewDto) => {
        this.falookupDetails().push(this.generaterow(lookupDetails));
      })
    });
  }
  editLookUp(lookup: LookupViewDto) {
    this.initlookupDetails(lookup.lookupId);
    this.lookup.lookupId = lookup.lookupId;
    this.lookup.code = lookup.code;
    this.lookup.name = lookup.name;
    this.lookup.isActive = lookup.isActive;
    this.lookup.lookupDetails = this.lookupDetails.expandLookupDetails;
    this.fblookup.patchValue(lookup);
    this.addFlag = false;
    this.submitLabel = "Update Lookup";
    this.showDialog = true;
    this.ShowlookupDetails = true;
  }

}

