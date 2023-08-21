import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Leave, LookUpHeaderDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { ITableHeader } from '../lookups/lookups.component';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-holidayconfiguration',
  templateUrl: './holidayconfiguration.component.html',
  styles: [
  ]
})
export class HolidayconfigurationComponent {
  holidays:any
  globalFilterFields: string[] = ['leaveTitle', 'date', 'leaveDescription']
  @ViewChild('filter') filter!: ElementRef;
  dialog: boolean = false;
  fbleave!: FormGroup;
  addfields: any;
  submitLabel!: string;
  maxLength: any;
  faleaveDetails!: FormArray;
  date: Date | undefined;
  holiday: Leave[] = [];
  ShowleaveDetails: boolean = false;

  constructor(
    private formbuilder: FormBuilder, 
    private AdminService: AdminService) { }

  headers: ITableHeader[] = [
    { field: 'leaveTitle', header: 'leaveTitle', label: 'Holiday Title' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'leaveDescription', header: 'leaveDescription', label: 'Holiday Description' },
  ];

  ngOnInit(): void {
    this.leaveForm();
   // this.initHoliday() 
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
 
  faleaveDetail(): FormArray {
    return this.fbleave.get("leaveDetails") as FormArray
  }
  addLeaveDetails() {
    this.ShowleaveDetails = true;
  
    this.faleaveDetail().push(this.generaterow())
  }
  generaterow(leaveDetails: Leave = new Leave()): FormGroup {
    return this.formbuilder.group({
     // id: new FormControl(leaveDetails.id,[Validators.required]),
      leaveTitle: new FormControl(leaveDetails.leaveTitle, [Validators.required]),
      fromDate: new FormControl(leaveDetails.fromDate, [Validators.required]),
      toDate: new FormControl(leaveDetails.toDate, [Validators.required]),
      leaveDescription: new FormControl(leaveDetails.leaveDescription, []),
    })
  }
  // Get form array controls for the specified index and form control name
  formArrayControls(i: number, formControlName: string) {
    return this.faleaveDetail().controls[i].get(formControlName);
  }
  get FormControls() {
    return this.fbleave.controls;
  }
  // initHoliday() {
  //   this.AdminService.getHolidays().subscribe((resp) => {
  //     this.holidays = resp as unknown as HolidayViewDto[];
  //   });
  // }

  editLeave(holiday: any) {
    this.addLeaveDetails();
    this.submitLabel = "Add Holiday";
    this.dialog = true;
    this.submitLabel = "Update Holiday";

  }
  onSubmit() {

   }

  showDialog() {
    this.fbleave.reset();
    this.dialog = true;
  }
  addLeaveDialog() {
    this.addLeaveDetails();
    this.submitLabel = "Add Holiday";
    this.dialog = true;

  }
  onClose() {
    this.fbleave.reset();
    this.ShowleaveDetails = false;
    this.faleaveDetail().clear();
  }
    
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
}
