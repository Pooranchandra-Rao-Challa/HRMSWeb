import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { LookupDetailViewDto, LookUpHeaderDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';

export interface ITableHeader {
  field: string;
  header: string;
  label: string;
}
@Component({
  selector: 'app-lookup',
  templateUrl: './lookups.component.html'
})

export class LookupsComponent implements OnInit {
  globalFilterFields: string[] = ['code', 'name', 'isActive', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
  @ViewChild('filter') filter!: ElementRef;
  dialog: boolean = false;
  fblookup!: FormGroup;
  falookUpDetails!: FormArray;
  addfields: any;
  submitLabel!: string;
  maxLength: any;
  lookup: LookUpHeaderDto[] = [];
  ShowlookupDetails: boolean = false;
  constructor(private formbuilder: FormBuilder, private lookupservice: SecurityService) { }

  headers: ITableHeader[] = [
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
  ];


  ngOnInit(): void {
    this.lookupForm();
    this.intiRoles();
  }
  get FormControls() {
    return this.fblookup.controls;
  }
  intiRoles() {
    this.lookupservice.getlookup().then((data: LookUpHeaderDto[]) => (this.lookup = data));
    
  }
  lookupForm() {
    this.addfields = []
    this.fblookup = this.formbuilder.group({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      isActive: [null],
      lookUpDetails: this.formbuilder.array([])
    });
  }

  generaterow(lookupDetail: LookupDetailViewDto = new LookupDetailViewDto()): FormGroup {
    return this.formbuilder.group({
      lookupId: [lookupDetail.lookupId],
      lookupDetailId: [lookupDetail.lookupDetailId],
      code: new FormControl(lookupDetail.code, [Validators.required,]),
      name: new FormControl(lookupDetail.name, [Validators.required, Validators.minLength(2)]),
      remarks: new FormControl(lookupDetail.remarks, []),
      listingorder: new FormControl(lookupDetail.listingorder, [Validators.required,]),
      isActive: [lookupDetail.isActive],
    })
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
    console.log(this.ShowlookupDetails)
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
