import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { AdminService } from 'src/app/_services/admin.service';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { HolidayDto, HolidaysViewDto } from 'src/app/_models/admin';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { DateValidators } from 'src/app/_validators/dateRangeValidator';
import { isNullOrUndefined } from 'util';
import { MIN_LENGTH_2, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
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
  globalFilterFields: string[] = ['title', 'fromDate', 'toDate', 'toDate', 'description', 'createdAt', 'updatedAt', 'updatedBy', 'createdBy']
  @ViewChild('filter') filter!: ElementRef;
  dialog: boolean = false;
  holiday:  any
  editDialog: boolean = false;
  fbleave!: FormGroup;
  holidayForm!: FormGroup;
  submitLabel!: string;
  maxLength: MaxLength = new MaxLength();
  addFlag: boolean = true;
  ShowleaveDetails: boolean = false;
  selectedYear: Year | undefined;
  years: Year[] | undefined;
  holidayToEdit: HolidaysViewDto;
  mediumDate: string = MEDIUM_DATE
  deletedialog:boolean;
  deleteAsset:any
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
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated At' },
  ];
  ngOnInit(): void {
    this.leaveForm();
    this.initializeYears();
    this.selectedYear = this.years.find(y => y.year === '2023');
    this.initHoliday();
    this.initForm();
  }
  leaveForm() {
    this.fbleave = this.formbuilder.group({
      holidayId: null,
      title: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      fromDate: [null, (Validators.required)],
      toDate: new FormControl(null, Validators.required),
      description:new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      isActive: new FormControl([true], Validators.required),
      leaveDetails: this.formbuilder.array([])
    }, {
      validators: Validators.compose([
        DateValidators.dateRangeValidator('fromDate', 'toDate', { 'fromDate': true }),
      ])
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
      holidayId: null,
      title: '',
      fromDate: '',
      toDate: '',
      description: '',
      isActive: true,
    });
    // Clear validation errors
    this.fbleave.markAsPristine();
    this.fbleave.markAsUntouched();
  }
  generaterow(leaveDetails: HolidaysViewDto = new HolidaysViewDto()): FormGroup {
    return this.formbuilder.group({
      holidayId: new FormControl(leaveDetails.holidayId),
      title: new FormControl(leaveDetails.title,),
      fromDate: new FormControl(leaveDetails.fromDate,),
      toDate: new FormControl(leaveDetails.toDate,),
      description: new FormControl(leaveDetails.description, []),
      isActive: new FormControl(leaveDetails.isActive, [])
    })
  }
  formArrayControls(i: number, formControlName: string) {
    return this.faleaveDetail().controls[i].get(formControlName);
  }
  get FormControls() {
    return this.fbleave.controls;
  }
  initForm() {
    this.holidayForm = new FormGroup({
      holidayId: new FormControl(),
      title: new FormControl('', Validators.required),
      fromDate: new FormControl('', Validators.required),
      toDate: new FormControl(''),
      description: new FormControl('', Validators.required),
      isActive: new FormControl(''),
    },
      {
        validators: Validators.compose([
          DateValidators.dateRangeValidator('fromDate', 'toDate', { 'fromDate': true }),
        ])
      });
  }
  initHoliday() {
    const year = this.selectedYear.year;
    this.AdminService.GetHolidays(year).subscribe((resp) => {
      this.holidays = resp as unknown as HolidaysViewDto[];
      console.log(this.holidays);
    });
  }

  dateValidator(control: FormControl): {[s: string]: boolean} {
    const date = control.value as Date;
    if (this.holidays.some(holiday => new Date(holiday.fromDate).getTime() === date.getTime())) {
      return { 'dateExists': true };
    }
    return null;
  }

  deleteassettype() {
    this.holidayToEdit = this.holiday;
    this.holiday = new HolidayDto();
    this.holiday.holidayId = this.deleteAsset.holidayId;
    this.holiday.title = this.deleteAsset.title;
    this.holiday.fromDate = this.deleteAsset.fromDate;
    this.holiday.toDate = this.deleteAsset.toDate;
    this.holiday.description = this.deleteAsset.description;
    this.holiday.isActive = false; // Set isActive to false when deleting
    this.holidayForm .patchValue(this.holiday);
    this.onSubmit();
    this.addFlag = false;
    this.deletedialog = false;
  }
  editHoliday(holiday: HolidaysViewDto) {
    this.holidayToEdit = holiday;
    // Formatting the dates
    const fromDate = FORMAT_DATE(new Date(holiday.fromDate));
    const toDate = FORMAT_DATE(new Date(holiday.toDate));
    this.holidayForm.setValue({
      holidayId: holiday.holidayId,
      title: holiday.title,
      fromDate: fromDate,
      toDate: toDate,
      description: holiday.description,
      isActive: holiday.isActive
    });
    this.submitLabel = "Update Holiday";
    this.editDialog = true;
    this.addFlag = false;
  }
  saveHoliday(): Observable<HttpEvent<any>> {
    const leaveDetails = this.fbleave.get('leaveDetails').value;
    return this.AdminService.CreateHoliday(leaveDetails);
  }

  onSubmit() {
    const holiday = this.holidayForm.value;
    if (holiday.holidayId) {
      this.AdminService.CreateHoliday([{ ...holiday, }]).subscribe(res => {
        this.initHoliday();
        this.leaveForm();
        this.editDialog = false;
        this.alertMessage.displayAlertMessage(ALERT_CODES["SMH002"]);
      });
    } else {
      this.saveHoliday().subscribe(res => {
        this.initHoliday();
        this.leaveForm();
        this.dialog = false;
        this.editDialog = false;
        this.alertMessage.displayAlertMessage(ALERT_CODES["SMH001"]);
      });
    }
  }
  confirmDelete(){
    this.deletedialog = true;
  }
  Dialog(leave:any){
    this.deleteAsset = leave;
    this.deletedialog = true;
    
  }
  deleted(){
    this.deletedialog =false
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
      { year: '2022', code: 'TW1' },
      { year: '2023', code: 'TW3' },

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
