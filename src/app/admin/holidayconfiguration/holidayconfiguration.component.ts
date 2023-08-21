import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Leave, LookUpHeaderDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { AdminService } from 'src/app/_services/admin.service';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { ITableHeader } from 'src/app/_models/common';

interface Year {
  year: string;
  code: string;
}
@Component({
  selector: 'app-holidayconfiguration',
  templateUrl: './holidayconfiguration.component.html',
  styles: [
  ]
})
export class HolidayconfigurationComponent {
  holidays: any
  globalFilterFields: string[] = ['leaveTitle', 'date', 'leaveDescription']
  @ViewChild('filter') filter!: ElementRef;
  dialog: boolean = false;
  fbleave!: FormGroup;
  addfields: any;
  submitLabel!: string;
  maxLength: any;
  faleaveDetails!: FormArray;
  date: Date | undefined;
  holiday: any;
  addFlag: boolean = true;
  ShowleaveDetails: boolean = false;
   selectedYear : Year |undefined;
  years: Year[] | undefined;


  constructor(
    private formbuilder: FormBuilder,
    private AdminService: AdminService,
    private alertMessage: AlertmessageService) { }

  headers: ITableHeader[] = [
    { field: 'leaveTitle', header: 'leaveTitle', label: 'Holiday Title' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'leaveDescription', header: 'leaveDescription', label: 'Holiday Description' },
  ];

  ngOnInit(): void {
    this.leaveForm();
	this. initializeYears();
    // this.initHoliday() 
  }
  leaveForm() {
    this.addfields = []
    this.fbleave = this.formbuilder.group({
      id: [],
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
    this.addFlag = true;
    // Push current values into the FormArray
    this.faleaveDetail().push(this.generaterow(this.fbleave.getRawValue()));
    
    // Reset form controls for the next entry
    this.fbleave.patchValue({
      id: [],
      leaveTitle: '',
      fromDate: '',
      toDate: '', 
      leaveDescription: ''
    });
   
  }
  generaterow(leaveDetails: Leave = new Leave()): FormGroup {
    if (!this.addFlag) this.holidays.id = this.holiday.id;
    return this.formbuilder.group({
      id: new FormControl(leaveDetails.id, [Validators.required]),
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
    // Load the selected holiday into the form
    this.fbleave.patchValue({
      id: holiday.id,
      leaveTitle: holiday.leaveTitle,
      fromDate: holiday.fromDate,
      toDate: holiday.toDate,
      leaveDescription: holiday.leaveDescription
    });

    // Clear the existing FormArray
    this.faleaveDetail().clear();

    // For each leaveDetail in the selected holiday, push a FormGroup into the FormArray
    holiday.leaveDetails.forEach((leaveDetail: any) => {
      this.faleaveDetail().push(this.formbuilder.group({
        id: new FormControl(leaveDetail.id, [Validators.required]),
        leaveTitle: new FormControl(leaveDetail.leaveTitle, [Validators.required]),
        fromDate: new FormControl(leaveDetail.fromDate, [Validators.required]),
        toDate: new FormControl(leaveDetail.toDate, [Validators.required]),
        leaveDescription: new FormControl(leaveDetail.leaveDescription, [])
      }));
    });

    this.submitLabel = "Update Holiday";
    this.dialog = true;
    this.addFlag = false;
  }
  saveHoliday() { }
  // saveHoliday(): Observable<HttpEvent<any>> {
  //    if (this.addFlag) return this.AdminService.CreateHoliday(this.fbleave.value);
  //  else return this.AdminService.UpdateHoliday(this.fbleave.value);
  // }

  onSubmit() {
    console.log(this.fbleave.value);
    // if (this.fbleave.valid) {
    //   this.saveHoliday().subscribe((resp) => {
    //     if (resp) {
    //       this.initHoliday();
    //       this.leaveForm();
    //       this.dialog = false;
    //       this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMHG001" : "SMAMHG002"]);
    //     }
    //   });
    // } else {
    //   this.fbleave.markAllAsTouched();
    // }

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

  initializeYears(): void {
    this.years = [
      { year: '2019', code: 'NY' },
      { year: '2020', code: 'TW' },
      { year: '2021', code: 'TW1' },
      { year: '2023', code: 'TW3' }
    ];
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
}
