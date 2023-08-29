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
import { MIN_LENGTH_2, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
interface Year {
  year: string;
  code: string;
}
export enum DMLOpetiaons {
  update,
  create,
  delete
}
export enum ViewDialogs {
  add,
  edit,
  delete,
  none
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
  fbHoliday!: FormGroup;
  editHolidayForm!: FormGroup;
  maxLength: MaxLength = new MaxLength();
  selectedYear: Year | undefined;
  years: Year[] | undefined;
  holidayToEdit: HolidaysViewDto;
  mediumDate: string = MEDIUM_DATE
  currentDialog: ViewDialogs = ViewDialogs.none;
  ViewDialogs = ViewDialogs;

  constructor(
    private formbuilder: FormBuilder,
    private AdminService: AdminService,
    private alertMessage: AlertmessageService) { }

  // Define table headers
  headers: ITableHeader[] = [
    { field: 'title', header: 'title', label: 'Holiday Title' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'description', header: 'description', label: 'Holiday Description' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];
  ngOnInit(): void {
    this.holidayForm();
    this.initializeYears();
    this.selectedYear = this.years.find(y => y.year === '2023');
    this.initHoliday();
    this.initHolidayForm();
  }
  // Initialize form with form controls
  holidayForm() {
    this.fbHoliday = this.formbuilder.group({
      holidayId: null,
      title: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      fromDate: [null, [Validators.required, this.dateValidator.bind(this)]],
      toDate: new FormControl(null),
      description: new FormControl('', [Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      isActive: new FormControl([true], Validators.requiredTrue),
      holidayDetails: this.formbuilder.array([])
    }, {
      validators: Validators.compose([
        DateValidators.dateRangeValidator('fromDate', 'toDate', { 'fromDate': true }),
      ])
    });
  }
  addHolidayDetails() {
    if (this.fbHoliday.invalid) {
      return;
    }
    // Push current values into the FormArray
    this.faholdyDetail().push(this.generaterow(this.fbHoliday.getRawValue()));
    // Reset form controls for the next entry
    this.fbHoliday.patchValue({
      holidayId: null,
      title: '',
      fromDate: '',
      toDate: '',
      description: '',
      isActive: true,
    });
    // Clear validation errors
    this.fbHoliday.markAsPristine();
    this.fbHoliday.markAsUntouched();
  }
  faholdyDetail(): FormArray {
    return this.fbHoliday.get("holidayDetails") as FormArray
  }
  // Method to generate a FormGroup for a single row in the holidayDetails array
  generaterow(holidayDetails: HolidaysViewDto = new HolidaysViewDto()): FormGroup {
    return this.formbuilder.group({
      holidayId: new FormControl(holidayDetails.holidayId),
      title: new FormControl(holidayDetails.title,),
      fromDate: new FormControl(holidayDetails.fromDate,),
      toDate: new FormControl(holidayDetails.toDate,),
      description: new FormControl(holidayDetails.description, []),
      isActive: new FormControl(holidayDetails.isActive, [])
    })
  }

  formArrayControls(i: number, formControlName: string) {
    return this.faholdyDetail().controls[i].get(formControlName);
  }
  get FormControls() {
    return this.fbHoliday.controls;
  }
  // Method to initialize the holidayForm FormGroup for edit purposes
  initHolidayForm() {
    this.editHolidayForm = new FormGroup({
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
  // Method to initialize holidays based on the selected year
  initHoliday() {
    const year = this.selectedYear.year;
    this.AdminService.GetHolidays(year).subscribe((resp) => {
      this.holidays = resp as unknown as HolidaysViewDto[];
    });
  }
  // Method to delete a holiday (Is Active False)
  deleteHoliday() {
    if (this.currentDialog !== ViewDialogs.delete) return;
    this.editHolidayForm.get('isActive').setValue(false); // Set isActive to false in the form
    this.onSubmit(DMLOpetiaons.delete);
  }
  // Method to edit an existing holiday
  editHoliday() {
    if (this.currentDialog !== ViewDialogs.edit) return;
    this.onSubmit(DMLOpetiaons.update);

  }
  // Method to save a holiday (either new or edited)
  saveHoliday(): Observable<HttpEvent<any>> {
    let holidays: HolidayDto[];
    if (this.currentDialog === ViewDialogs.edit || this.currentDialog === ViewDialogs.delete) {
      const editedHoliday = this.editHolidayForm.value;
      editedHoliday.fromDate = FORMAT_DATE(new Date(editedHoliday.fromDate));
      editedHoliday.toDate = FORMAT_DATE(new Date(editedHoliday.toDate));
      holidays = [editedHoliday as HolidayDto];
    } else {
      holidays = this.fbHoliday.get('holidayDetails').value.map((holiday: HolidaysViewDto) => ({
        ...holiday,
        fromDate: FORMAT_DATE(new Date(holiday.fromDate)),
        toDate: FORMAT_DATE(new Date(holiday.toDate)),
      } as HolidayDto));
    }
    return this.AdminService.CreateHoliday(holidays);
  }

  // Method to submit the holiday form
  onSubmit(operation: DMLOpetiaons = DMLOpetiaons.create) {
    this.saveHoliday().subscribe(res => {
      this.initHoliday();
      this.holidayForm();
      if (this.currentDialog == ViewDialogs.add)
        this.alertMessage.displayAlertMessage(ALERT_CODES["SMH001"]);
      else if (this.currentDialog == ViewDialogs.delete)
        this.alertMessage.displayAlertMessage(ALERT_CODES["SMH004"]);
      else if (this.currentDialog == ViewDialogs.edit)
        this.alertMessage.displayAlertMessage(ALERT_CODES["SMH002"]);

      this.hideDialog();
    });
  }
  dateValidator(control: FormControl): { [s: string]: boolean } {
    const date = new Date(control.value);
    for (const holiday of this.holidays) {
      if (new Date(holiday.fromDate).getTime() === date.getTime()) {
        const dateString = date.toLocaleDateString(); // format the date as a string
        this.alertMessage.displayErrorMessage(`The selected date '(${dateString})' already exists as a holiday named '(${holiday.title})'.`);
        return { 'dateExists': true };
      }
    }
    return null;
  }
  showDialog1(holiday: any, view: ViewDialogs) {
    this.currentDialog = view;
    if (view === ViewDialogs.edit || view === ViewDialogs.delete) {
      this.holidayToEdit = Object.assign({}, holiday);
      this.holidayToEdit.fromDate = FORMAT_DATE(new Date(holiday.fromDate));
      this.holidayToEdit.toDate = FORMAT_DATE(new Date(holiday.toDate));
      delete this.holidayToEdit.createdAt
      delete this.holidayToEdit.createdBy
      delete this.holidayToEdit.updatedAt
      delete this.holidayToEdit.updatedBy
      this.editHolidayForm.setValue(this.holidayToEdit);
    }
  }
  isPastDate(date: string): boolean {
    const currentDate = new Date();
    const fromDate = new Date(date);
    return fromDate < currentDate;
  }
  onClose() {
    this.fbHoliday.reset();
    this.faholdyDetail().clear();
    this.faholdyDetail().value.length == 0
  }
  // Initialize the years array
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

  hideDialog() {
    this.currentDialog = ViewDialogs.none;
  }

  get showDelete(): boolean {
    return this.currentDialog == ViewDialogs.delete;
  }
  set showDelete(flag: any) {
    this.currentDialog = ViewDialogs.none;
  }

  get showAdd(): boolean {
    return this.currentDialog == ViewDialogs.add;
  }
  set showAdd(flag: any) {
    this.currentDialog = ViewDialogs.none;
  }

  get showEdit(): boolean {
    return this.currentDialog == ViewDialogs.edit;
  }
  set showEdit(flag: any) {
    this.currentDialog = ViewDialogs.none;
  }

  clearSelectionOnHide() {
    this.holidayToEdit = new HolidaysViewDto();
  }
}
