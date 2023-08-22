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
import { HolidayDto, HolidaysViewDto } from 'src/app/_models/admin';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';

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
  holidays: HolidaysViewDto[] = [];
  holiday:any
  globalFilterFields: string[] = ['leaveTitle', 'date', 'leaveDescription']
  @ViewChild('filter') filter!: ElementRef;
  dialog: boolean = false;
  editDialog: boolean = false;
  fbleave!: FormGroup;
  addfields: any;
  submitLabel!: string;
  maxLength: any;
  faleaveDetails!: FormArray;
  date: Date | undefined;
  addRow = false;
  addFlag: boolean = true;
  ShowleaveDetails: boolean = false;
  selectedYear : Year |undefined;
  years: Year[] | undefined;
  mediumDate: string = MEDIUM_DATE


  constructor(
    private formbuilder: FormBuilder,
    private AdminService: AdminService,
    private alertMessage: AlertmessageService) { }

  headers: ITableHeader[] = [
    { field: 'title', header: 'title', label: 'Holiday Title' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'description', header: 'description', label: 'Holiday Description' },
    { field: 'isActive', header: 'isActive', label: 'IsActive' },
    { field: 'createdAt', header: 'createdAt', label: 'Created At' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated At' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  ngOnInit(): void {
    this.leaveForm();
    
	this.initializeYears();
  this.selectedYear = this.years.find(y => y.year === '2023');
     this.initHoliday() 
  }
  leaveForm() {
    this.addfields = []
    this.fbleave = this.formbuilder.group({
      holidayId:null,
      title: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      description: new FormControl(''),
      isActive:true,
      leaveDetails: this.formbuilder.array([])
    });
  }

  faleaveDetail(): FormArray {
    return this.fbleave.get("leaveDetails") as FormArray
  }
  addLeaveDetails() {
      this.ShowleaveDetails = true;
    // Push current values into the FormArray
    this.faleaveDetail().push(this.generaterow(this.fbleave.getRawValue()));

    // Reset form controls for the next entry
    this.fbleave.patchValue({
      holidayId:null,
      title: '',
      fromDate: '',
      toDate: '', 
      description: '',
      isActive:true,
    });
  }
  generaterow(leaveDetails: HolidaysViewDto = new HolidaysViewDto()): FormGroup {
    if (!this.addFlag) this.holidays= this.holiday.holidayId;
    return this.formbuilder.group({
      holidayId: new FormControl(leaveDetails.holidayId),
      title: new FormControl(leaveDetails.title,),
      fromDate: new FormControl(leaveDetails.fromDate,),
      toDate: new FormControl(leaveDetails.toDate,),
      description: new FormControl(leaveDetails.description, []),
      isActive:new FormControl(leaveDetails.isActive, [])
    })
  }
  formArrayControls(i: number, formControlName: string) {
    return this.faleaveDetail().controls[i].get(formControlName);
  }
  get FormControls() {
    return this.fbleave.controls;
  }
  initHoliday() {
    const year = this.selectedYear.year;
    this.AdminService.GetHolidays(year).subscribe((resp) => {
      this.holidays = resp as unknown as HolidaysViewDto[];
      console.log(this.holidays);
    });
  }

  editLeave(holiday: any) {
    // Load the selected holiday into the form
    this.submitLabel = "Update Holiday";
    this.editDialog = true;
    this.addFlag = false;
  }
  
  saveHoliday(): Observable<HttpEvent<any>> {
    const leaveDetails = this.fbleave.get('leaveDetails').value;
    return this.AdminService.CreateHoliday(leaveDetails);
  }

  onSubmit() {
    if ( this.faleaveDetail().length > 0) {
      this.saveHoliday().subscribe((resp) => {
        if (resp) {
          this.initHoliday();
          this.leaveForm();
          this.dialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMHG001" : "SMAMHG002"]);
        }
      });
    } else {
      if (this.faleaveDetail().length === 0) {
        alert("Please add at least one record.");
      }
      this.fbleave.markAllAsTouched();
    }
  }
  showDialog() {
    this.fbleave.reset();
    this.dialog = true;
  }
  addLeaveDialog() {
    this.submitLabel = "Add Holidays";
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
