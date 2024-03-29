import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { AdminService } from 'src/app/_services/admin.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, filter } from 'rxjs';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { ConfirmationRequest, ITableHeader, MaxLength } from 'src/app/_models/common';
import { HolidayDto, HolidaysViewDto } from 'src/app/_models/admin';
import { DATE_OF_JOINING, FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { DateValidators } from 'src/app/_validators/dateRangeValidator';
import { MIN_LENGTH_2, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { JwtService } from 'src/app/_services/jwt.service';
import { ConfirmationDialogService } from 'src/app/_alerts/confirmationdialog.service';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { DatePipe, formatDate } from '@angular/common';
import { ReportService } from 'src/app/_services/report.service';
import * as FileSaver from "file-saver";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
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
  years: any;
  year: number = new Date().getFullYear();
  permissions: any;
  holidayToEdit: HolidaysViewDto;
  mediumDate: string = MEDIUM_DATE
  currentDialog: ViewDialogs = ViewDialogs.none;
  ViewDialogs = ViewDialogs;
  minDateValue: any;
  confirmationRequest: ConfirmationRequest = new ConfirmationRequest();
  value: number;

  constructor(
    private formbuilder: FormBuilder,
    private AdminService: AdminService,
    private alertMessage: AlertmessageService,
    private jwtService: JwtService,
    private reportService: ReportService,
    private confirmationDialogService: ConfirmationDialogService,
    private globalFilterService: GlobalFilterService,
    private datePipe: DatePipe) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

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
    this.fbHoliday = this.formbuilder.group({
      holidayId: null,
      title: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      fromDate: [null, [Validators.required, this.dateValidator.bind(this)]],
      toDate: [null],
      description: new FormControl('', Validators.minLength(MIN_LENGTH_2)),
      isActive: new FormControl(true, Validators.requiredTrue),
      year: new FormControl(''),
      holidayDetails: this.formbuilder.array([])
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
      this.alertMessage.displayErrorMessage(ALERT_CODES["SMH005"]);
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
    const formGroup = this.formbuilder.group({
      holidayId: new FormControl({ value: holidayDetails.holidayId, disabled: true }),
      title: new FormControl({ value: holidayDetails.title, disabled: true }),
      fromDate: new FormControl({ value: holidayDetails.fromDate, disabled: true }),
      toDate: new FormControl({ value: holidayDetails.toDate, disabled: true }),
      description: new FormControl({ value: holidayDetails.description, disabled: true }),
      year: new FormControl({ value: holidayDetails.year, disabled: true }),
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
    this.editHolidayForm = new FormGroup({
      holidayId: new FormControl(),
      title: new FormControl('', Validators.required),
      fromDate: new FormControl('', Validators.required),
      toDate: new FormControl(''),
      description: new FormControl(''),
      year: new FormControl(''),
      isActive: new FormControl(''),
    },
      {
        validators: Validators.compose([
          DateValidators.dateRangeValidator('fromDate', 'toDate', { 'fromDate': true, 'toDate': false }),
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
      editedHoliday.year = editedHoliday.fromDate.getFullYear()
      holidays = [editedHoliday as HolidayDto];
    } else {
      holidays = this.fbHoliday.get('holidayDetails').value.map((holiday: HolidaysViewDto) => ({
        ...holiday,
        fromDate: FORMAT_DATE(new Date(holiday.fromDate)),
        toDate: holiday.toDate ? FORMAT_DATE(new Date(holiday.toDate)) : null,
        year: holiday.fromDate.getFullYear()
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
      if (holiday.toDate === null) {
        this.holidayToEdit.toDate = null;
      } else {
        this.holidayToEdit.toDate = FORMAT_DATE(new Date(holiday.toDate));
      }
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
    this.holidayForm();
    this.faholdyDetail().value.length == 0
  }
  restrictSpaces(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    // Prevent the first key from being a space
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0)
      event.preventDefault();

    // Restrict multiple spaces
    if (event.key === ' ' && target.selectionStart > 0 && target.value.charAt(target.selectionStart - 1) === ' ') {
      event.preventDefault();
    }
  }

  // Method to handle the global filter for the table
  onGlobalFilter(table: Table, event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.globalFilterService.filterTableByDate(table, searchTerm);
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

  downloadHolidayReport() {
    this.reportService.DownloadHolidays(this.year)
      .subscribe((resp) => {
        if (resp.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * resp.loaded / resp.total);
          this.value = percentDone;
        }
        if (resp.type === HttpEventType.Response) {
          const file = new Blob([resp.body], { type: 'text/csv' });
          const document = window.URL.createObjectURL(file);
          const currentDate = new Date().toLocaleString().replace(/[/\\?%*:|"<>.]/g, '-');
          const csvName = `HolidaysReport${currentDate}.csv`;
          FileSaver.saveAs(document, csvName);
        }
      })
  }

  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }
  async pdfHeader() {
    try {
      const headerImage1 = await this.getBase64ImageFromURL('../../assets/layout/images/Calibrage_logo1.png');
      const headerImage2 = await this.getBase64ImageFromURL('../../assets/layout/images/head_right.PNG');
      const pageWidth = 595.28; // Standard A4 page width in pdfmake
      const imageWidth = (pageWidth / 3) - 10; // Adjusted width for each image (subtracting 10 for margins)
      const spacerWidth = (pageWidth / 3) - 10; // Adjusted width for spacer (subtracting 10 for margins)

      let row = {
        columns: [
          {
            image: headerImage1,
            width: imageWidth,
            alignment: 'left',
            margin: [0, 0, 0, 0] // Remove any margins
          },
          {
            width: spacerWidth,
            text: '', // Empty spacer column
            alignment: 'center' // Remove any margins
          },
          {
            image: headerImage2,
            width: imageWidth,
            alignment: 'right',
            margin: [0, 0, 0, 0] // Remove any margins
          },
        ],
        alignment: 'justify',
        margin: [20, 0, 20, 0] // Remove any margins
      };


      return row;
    } catch (error) {
      console.error("Error occurred while formatting key and values:", error);
      throw error; // Propagate the error
    }
  }
  async exportPdf() {
    const pageSize = { width: 595.28, height: 841.89 };
    const headerImage = await this.pdfHeader();
    const waterMark = await this.getBase64ImageFromURL('../../assets/layout/images/transparent_logo.png');
    const holidaysContent = await this.generateHolidaysContent();
    const createFooter = (currentPage: number) => ({
      margin: [0, 0, 0, 0],
      height: 20,
      background: '#ff810e',
      width: 595.28,
      columns: [
        { canvas: [{ type: 'rect', x: 0, y: 0, w: 530.28, h: 20, color: '#ff810e' }] },
        {
          stack: [
            {
              text: 'Copyrights © 2024 Calibrage Info Systems Pvt Ltd.',
              fontSize: 11, color: '#fff', absolutePosition: { x: 20, y: 3 }
            },
            {
              text: `Page ${currentPage}`,
              color: '#000000', background: '#fff', margin: [0, 0, 0, 0], fontSize: 12, absolutePosition: { x: 540, y: 3 },
            }
          ],
        }
      ],
    });

    const docDefinition = {
      header: () => (headerImage),
      footer: (currentPage: number) => createFooter(currentPage),
      background: [{
        image: waterMark,
        absolutePosition: { x: (pageSize.width - 200) / 2, y: (pageSize.height - 200) / 2 },
      }],
      content: [
        { text: 'Holidays List\n', style: 'header', alignment: 'center' },
        holidaysContent
      ],
      pageMargins: [40, 90, 40, 20],
      styles: {
        header: { fontSize: 24 },
        tableheader: { fontSize: 15, alignment: 'center', fillColor: '#dbdbdb' },
        borderedText: { border: [1, 1, 1, 1], borderColor: 'rgb(0, 0, 255)', fillColor: '#eeeeee', width: 100, height: 150, margin: [12, 20, 0, 0] },
        defaultStyle: { font: 'Typography', fontSize: 12 },
      },
    };
    const currentDate = new Date().toLocaleString().replace(/[/\\?%*:|"<>.]/g, '-');
    pdfMake.createPdf(docDefinition).download(`HolidaysReport ${currentDate}.pdf`);;
  }

  async generateHolidaysContent() {
    const check = await this.getBase64ImageFromURL('assets/layout/images/check.jpg');
    const cancle = await this.getBase64ImageFromURL('assets/layout/images/cancle.jpg');
    const content = [
      [
        { text: 'Holiday Name', style: 'tableheader' },
        { text: 'From Date', style: 'tableheader' },
        { text: 'To Date', style: 'tableheader' },
        { text: 'Is Active', style: 'tableheader' }
      ],
      ...this.holidays.map(holiday => [
        { text: holiday.title || '' },
        { text: this.datePipe.transform(holiday.fromDate, DATE_OF_JOINING) || '', alignment: 'center' },
        { text: this.datePipe.transform(holiday.toDate, DATE_OF_JOINING) || '', alignment: 'center' },
        {
          image: holiday.isActive ? check : cancle, width: holiday.isActive ? 23 : 11,
          height: holiday.isActive ? 23 : 11, alignment: 'center'
        }
      ])
    ];

    return {
      table: {
        headerRows: 1,
        widths: [155, 110, 110, 100],
        body: content,
      },
    };
  }

}
