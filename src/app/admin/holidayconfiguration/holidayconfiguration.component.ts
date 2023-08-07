import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Leave, LookUpHeaderDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { ITableHeader } from '../lookups/lookups.component';

@Component({
  selector: 'app-holidayconfiguration',
  templateUrl: './holidayconfiguration.component.html',
  styles: [
  ]
})
export class HolidayconfigurationComponent {
  globalFilterFields: string[] = ['leaveTitle', 'date', 'leaveDescription']
  @ViewChild('filter') filter!: ElementRef;
  dialog: boolean = false;
  fbleave!: FormGroup;
  addfields: any;
  submitLabel!: string;
  maxLength: any;
  faleaveDetails!: FormArray;
  date: Date | undefined;

  leave: Leave[] = [];
  ShowleaveDetails: boolean = false;

  constructor(private formbuilder: FormBuilder, private leaveservice: SecurityService) { }

  headers: ITableHeader[] = [
    { field: 'leaveTitle', header: 'leaveTitle', label: 'Leave Title' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'leaveDescription', header: 'leaveDescription', label: 'Leave Description' },
  ];


  ngOnInit(): void {
    this.leaveForm();
    this.initLeave();
  }
  get FormControls() {
    return this.fbleave.controls;
  }
  initLeave() {
    this.leaveservice.getleaves().then((data: Leave[]) => (this.leave = data));
  }
  leaveForm() {
    this.addfields = []
    this.fbleave = this.formbuilder.group({
      leaveTitle: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      leaveDescription: new FormControl('', [Validators.required]),
      leaveDetails: this.formbuilder.array([])
    });
  }
  generaterow(leaveDetails: Leave = new Leave()): FormGroup {
    return this.formbuilder.group({
      id: new FormControl(leaveDetails.id,[Validators.required]),
      leaveTitle: new FormControl(leaveDetails.leaveTitle, [Validators.required]),
      fromDate: new FormControl(leaveDetails.fromDate, [Validators.required]),
      toDate: new FormControl(leaveDetails.toDate, [Validators.required]),
      leaveDescription: new FormControl(leaveDetails.leaveDescription, []),
    })
  }
  faleaveDetail(): FormArray {
    return this.fbleave.get("leaveDetails") as FormArray
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }


  showDialog() {
    this.fbleave.reset();
    this.dialog = true;
  }
  addLeaveDetails() {
    this.ShowleaveDetails = true;
    this.faleaveDetails = this.fbleave.get("leaveDetails") as FormArray
    this.faleaveDetails.push(this.generaterow())

  }
  addLeaveDialog() {
    this.addLeaveDetails();
    this.submitLabel = "Add Leave";
    this.dialog = true;

  }
  onClose() {
    this.fbleave.reset();
    this.ShowleaveDetails = false;
    this.faleaveDetail().clear();
  }
  editLeave(leave: any) {
    this.addLeaveDetails();
    this.submitLabel = "Add Leave";
    this.dialog = true;
    this.submitLabel = "Update Leave";

  }
  onSubmit() { }
}
