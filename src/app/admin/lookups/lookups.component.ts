import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FormArrayValidationForDuplication } from 'src/app/_validators/unique-branch-validators';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_20, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookups.component.html'
})

export class LookupsComponent implements OnInit {
  globalFilterFields: string[] = ['code', 'name', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('lookUp') lookUp: Table; // Reference to the main table
  @ViewChild('lookUpDetails') lookUpDetails: Table;
  showDialog: boolean = false;
  fblookup!: FormGroup;
  falookUpDetails!: FormArray;
  addfields: any;
  addFlag: boolean = true;
  submitLabel!: string;
  lookups: LookupViewDto[] = [];
  ShowlookupDetails: boolean = false;
  isLookupChecked: boolean = false;
  isbool: boolean;
  permissions: any;
  maxLength: MaxLength = new MaxLength();
  mediumDate: string = MEDIUM_DATE
  selectedColumnHeader!: ITableHeader[];
  _selectedColumns!: ITableHeader[];
  constructor(private formbuilder: FormBuilder, private adminService: AdminService, private alertMessage: AlertmessageService,
    private jwtService: JwtService) { }


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
  lookupHeader: ITableHeader[] = [
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
  ]
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.selectedColumnHeader.filter((col) => val.includes(col));
  }
  get FormControls() {
    return this.fblookup.controls;
  }
  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;

    this.lookupForm();
    this.onChangeisLookupChecked();
    this._selectedColumns = this.selectedColumnHeader;
    this.selectedColumnHeader = [
      { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
      { field: 'createdBy', header: 'createdBy', label: 'Created By' },
      { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
      { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
    ];
  }

  lookupForm() {
    this.addfields = []
    this.fblookup = this.formbuilder.group({
      lookupId: [0],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      isActive: new FormControl('', [Validators.required,]),
      lookUpDetails: this.formbuilder.array([], FormArrayValidationForDuplication())
    });
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
    })
  }
  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }

  generaterow(lookupDetail: LookupDetailsDto = new LookupDetailsDto()): FormGroup {
    return this.formbuilder.group({
      lookupId: [lookupDetail.lookupId],
      lookupDetailId: [lookupDetail.lookupDetailId],
      code: new FormControl(lookupDetail.code, [Validators.required, Validators.minLength(2)]),
      name: new FormControl(lookupDetail.name, [Validators.required, Validators.minLength(2)]),
      description: new FormControl(lookupDetail.description),
      isActive: new FormControl(lookupDetail.isActive, [Validators.required])
    })
  }
  formArrayControls(i: number, formControlName: string) {
    return this.falookupDetails().controls[i].get(formControlName);
  }

  falookupDetails(): FormArray {
    return this.fblookup.get("lookUpDetails") as FormArray
  }
  //  post/update lookup
  savelookup(): Observable<HttpEvent<LookupViewDto>> {
    if (this.addFlag) {
      return this.adminService.CreateLookUp(this.fblookup.value)
    }
    else return this.adminService.UpdateLookUp(this.fblookup.value)
  }
  isLookupIdReadonly(): boolean {
    return this.fblookup.get('lookupId').value !== null;
  }
  isUniqueLookupCode() {
    const existingLookupCodes = this.lookups.filter(lookup =>
      lookup.code === this.fblookup.value.code &&
      lookup.lookupId !== this.fblookup.value.lookupId
    )
    return existingLookupCodes.length > 0;
  }

  isUniqueLookupName() {
    const existingLookupNames = this.lookups.filter(lookup =>
      lookup.name === this.fblookup.value.name &&
      lookup.lookupId !== this.fblookup.value.lookupId
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
    debugger
    if (this.fblookup.valid) {
      this.savelookup().subscribe(resp => {
        if (resp) {
          this.GetLookUp(false);
          this.isLookupChecked = false;
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
  
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  clear() {
    this.clearTableFiltersAndSorting(this.lookUp);
    this.clearTableFiltersAndSorting(this.lookUpDetails);
  }

  clearTableFiltersAndSorting(table: Table) {
    // Clear column filters
    table.clear();
    this.filter.nativeElement.value = '';

    // Reset column sorting
    // table.sortField = null;
    // table.sortOrder = 1;
  }
  addLookupDetails() {
    this.ShowlookupDetails = true;
    this.falookUpDetails = this.fblookup.get("lookUpDetails") as FormArray
    this.falookUpDetails.push(this.generaterow())

  }
  addLookupDialog() {
    this.fblookup.reset();
    this.addFlag = true;
    this.addLookupDetails();
    this.fblookup.controls['isActive'].setValue(true);
    this.falookUpDetails = this.fblookup.get("lookUpDetails") as FormArray
    for (let i = 0; i < this.falookUpDetails.length; i++) {
      const subLookupGroup = this.falookUpDetails.at(i);
      subLookupGroup.get('isActive').setValue(true); // Set isActive for each sub-lookup detail
    }
    this.submitLabel = "Add Lookup";
    this.showDialog = true;
  }
  onClose() {
    this.fblookup.reset();
    this.ShowlookupDetails = false;
    this.falookupDetails().clear();
  }
  editLookUp(lookup: LookupViewDto) {
    console.log(lookup)
    lookup.expandLookupDetails.forEach((lookupDetails: LookupDetailsDto) => {
      lookupDetails.lookupId = lookup.lookupId;
      this.falookupDetails().push(this.generaterow(lookupDetails));
    })
    this.fblookup.patchValue(lookup);
    this.addFlag = false;
    this.submitLabel = "Update Lookup";
    this.showDialog = true;
    this.ShowlookupDetails = true;
  }

}

