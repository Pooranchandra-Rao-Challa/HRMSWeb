import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { AdminService } from 'src/app/_services/admin.service';
import { HttpEvent } from '@angular/common/http';
import { Observable, filter } from 'rxjs';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { ConfirmationRequest, ITableHeader, MaxLength } from 'src/app/_models/common';
import { HolidayDto, HolidaysViewDto } from 'src/app/_models/admin';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { DateValidators } from 'src/app/_validators/dateRangeValidator';
import { MIN_LENGTH_2, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { JwtService } from 'src/app/_services/jwt.service';
import { ConfirmationDialogService } from 'src/app/_alerts/confirmationdialog.service';
interface Year {
  year: string;
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
  years: any
  permissions: any;
  holidayToEdit: HolidaysViewDto;
  mediumDate: string = MEDIUM_DATE
  currentDialog: ViewDialogs = ViewDialogs.none;
  ViewDialogs = ViewDialogs;
  minDateValue: any;
  confirmationRequest: ConfirmationRequest = new ConfirmationRequest();
  constructor(
    private formbuilder: FormBuilder,
    private AdminService: AdminService,
    private alertMessage: AlertmessageService,
    private jwtService: JwtService,
    private confirmationDialogService: ConfirmationDialogService) { }

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
    this.permissions = this.jwtService.Permissions
    this.initializeYears();
    this.holidayForm();
    this.initHoliday();
    this.initHolidayForm();
    this.minDateValue = new Date();
  }
  // Initialize form with form controls
  holidayForm() {
    const currentYear = new Date().getFullYear();
    this.fbHoliday = this.formbuilder.group({
      holidayId: null,
      title: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      fromDate: [null, [Validators.required, this.dateValidator.bind(this)]],
      toDate: [null],
      description: new FormControl('', [Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      isActive: new FormControl(true, Validators.requiredTrue),
      year: new FormControl(currentYear),
      holidayDetails: this.formbuilder.array([])
    }, {
      validators: Validators.compose([
        DateValidators.dateRangeValidator('fromDate', 'toDate', { 'fromDate': true }),
      ])
    });

  }

  // Method to add holiday details to the form
  addHolidayDetails() {
    if (this.fbHoliday.invalid) {
      return;
    }
    const fromDateValue = this.fbHoliday.get('fromDate').value;
  const isDuplicateDate = this.faholdyDetail().value.some((holiday: HolidaysViewDto) =>
    new Date(holiday.fromDate).getTime() === new Date(fromDateValue).getTime()
  );
  if (isDuplicateDate) {
    this.alertMessage.displayErrorMessage('The selected from Date already Added in List.');
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
      year: '',
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
    const currentYear = new Date().getFullYear();
    const formGroup = this.formbuilder.group({
      holidayId: new FormControl({ value: holidayDetails.holidayId, disabled: true }),
      title: new FormControl({ value: holidayDetails.title, disabled: true }),
      fromDate: new FormControl({ value: holidayDetails.fromDate, disabled: true }),
      toDate: new FormControl({ value: holidayDetails.toDate, disabled: true }),
      description: new FormControl({ value: holidayDetails.description, disabled: true }),
      year: new FormControl({ value: holidayDetails.year || currentYear, disabled: true }),
      isActive: new FormControl({ value: holidayDetails.isActive, disabled: true }),
    });
    return formGroup;
  }
  formArrayControls(i: number, formControlName: string) {
    return this.faholdyDetail().controls[i].get(formControlName);
  }
  get FormControls() {
    return this.fbHoliday.controls;
  }

  // Method to initialize the holidayForm FormGroup for edit purposes
  initHolidayForm() {
    const currentYear = new Date().getFullYear();
    this.editHolidayForm = new FormGroup({
      holidayId: new FormControl(),
      title: new FormControl('', Validators.required),
      fromDate: new FormControl('', Validators.required),
      toDate: new FormControl(''),
      description: new FormControl('', Validators.required),
      year: new FormControl(currentYear),
      isActive: new FormControl(''),
    },
      {
        validators: Validators.compose([
          DateValidators.dateRangeValidator('fromDate', 'toDate', { 'fromDate': true }),
        ])
      });
  }
  // Method to initialize holidays based on the selected year
  initHoliday(): void {
    if (this.selectedYear) {
      const year = this.selectedYear.year;
      this.AdminService.GetHolidays(year).subscribe((resp) => {
        this.holidays = resp as unknown as HolidaysViewDto[];
      });
    }
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
      editedHoliday.toDate = editedHoliday.toDate ? FORMAT_DATE(new Date(editedHoliday.toDate)) : null;
      holidays = [editedHoliday as HolidayDto];
    } else {
      holidays = this.fbHoliday.get('holidayDetails').value.map((holiday: HolidaysViewDto) => ({
        ...holiday,
        fromDate: FORMAT_DATE(new Date(holiday.fromDate)),
        toDate: holiday.toDate ? FORMAT_DATE(new Date(holiday.toDate)) : null,
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
  // Custom date validator to check if a selected date already exists as a holiday
  dateValidator(control: FormControl): { [s: string]: boolean } {
    const date = new Date(control.value);
    for (const holiday of this.holidays) {
      if (new Date(holiday.fromDate).getTime() === date.getTime()) {
        const dateString = date.toLocaleDateString(); // format the date as a string
        this.alertMessage.displayErrorMessage(`The selected date exists as a holiday For ${holiday.title}.`);
        return { 'dateExists': true };
      }
    }
    return null;
  }
  get isFromDateSelected() {
    return this.FormControls['fromDate'] && this.FormControls['fromDate'].value;
  }
  // Method to show the dialog for editing or deleting a holiday
  showDialog(holiday: any, view: ViewDialogs) {
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
    if (view === ViewDialogs.delete) {
      this.confirmationDialogService.comfirmationDialog(this.confirmationRequest).subscribe(userChoice => {
        if (userChoice) {
          this.deleteHoliday();
        }
      });
    }
  }
  // Method to check if a date is in the past
  isPastDate(date: string): boolean {
    const currentDate = new Date();
    const fromDate = new Date(date);
    return fromDate < currentDate;
  }
  // Method to check if a past year is selected
  isPastYearSelected(): boolean {
    const currentYear = new Date().getFullYear();
    const selectedYear = Number(this.selectedYear?.year);
    return selectedYear < currentYear;
  }
  // // Method to initialize the years array
  initializeYears(): void {
    const currentYear = new Date().getFullYear().toString();
    this.AdminService.GetYearsFromHolidays().subscribe((years) => {
      this.years = years as unknown as Year[];
      this.selectedYear = this.years.find((year) => year.year.toString() === currentYear);
      if (!this.selectedYear) {
        this.selectedYear = { year: currentYear };
      }
      this.initHoliday();

    });
  }
  // Method to get the dynamic holiday dialog header based on the selected year
  getHolidayDialogHeader(): string {
    return this.selectedYear ? `Holiday For ${this.selectedYear.year}` : 'Holiday';
  }

  onClose() {
    this.fbHoliday.reset();
    this.faholdyDetail().clear();
    this.faholdyDetail().value.length == 0
  }
  // Method to handle the global filter for the table
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  // Method to clear the table filter
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  // Method to hide the dialog
  hideDialog() {
    this.currentDialog = ViewDialogs.none;
  }

  // Getter for determining if the delete dialog should be shown
  get showDelete(): boolean {
    return this.currentDialog == ViewDialogs.delete;
  }
  // Setter for hiding the delete dialog
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