import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
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
  dialog: boolean = false;
  fblookup!: FormGroup;
  falookUpDetails!: FormArray;
  addfields: any;
  addFlag: boolean = true;
  submitLabel!: string;
  maxLength: any;
  lookups: LookupViewDto[] = [];
  lookup: LookUpHeaderDto = new LookUpHeaderDto();
  ShowlookupDetails: boolean = false;
  isLookupChecked: boolean = false;
  constructor(private formbuilder: FormBuilder, private adminService: AdminService) { }

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
    { field: 'Code', header: 'Code', label: 'Code' },
    { field: 'Name', header: 'Name', label: 'Name' },
    { field: 'Description', header: 'Description', label: 'Description' },
    { field: 'IsActive', header: 'IsActive', label: 'Is Active' },
    { field: 'CreatedAt', header: 'CreatedAt', label: 'Created Date' },
    { field: 'CreatedBy', header: 'CreatedBy', label: 'Created By' },
    { field: 'UpdatedAt', header: 'UpdatedAt', label: 'Updated Date' },
    { field: 'UpdatedBy', header: 'UpdatedBy', label: 'Updated By' },
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


  lookupForm() {
    this.addfields = []
    this.fblookup = this.formbuilder.group({
      lookUpId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      isActive: [null],
      lookUpDetails: this.formbuilder.array([], FormArrayValidationForDuplication())
    });
  }

  generaterow(lookupDetail: LookupDetailViewDto = new LookupDetailViewDto()): FormGroup {
    return this.formbuilder.group({
      lookupId: [lookupDetail.lookupId],
      lookupDetailId: [lookupDetail.lookupDetailId],
      code: new FormControl(lookupDetail.code, [Validators.required,]),
      name: new FormControl(lookupDetail.name, [Validators.required, Validators.minLength(2)]),
      isActive: [lookupDetail.isActive],
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


  showDialog() {
    this.fblookup.reset();
    this.dialog = true;
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
    this.dialog = true;

  }
  onClose() {
    this.fblookup.reset();
    this.ShowlookupDetails = false;
    this.falookupDetails().clear();
  }
  editLookUp(role: any) {
    this.addLookupDetails();
    this.fblookup.controls['name'].enable();
    this.fblookup.controls['isActive'].setValue(true);
    this.submitLabel = "Add Lookup";
    this.dialog = true;
    this.submitLabel = "Update Lookup";

  }
  onSubmit() { }

}
