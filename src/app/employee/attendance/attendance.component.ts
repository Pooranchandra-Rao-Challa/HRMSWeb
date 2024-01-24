import { DatePipe, formatDate, getLocaleFirstDayOfWeek } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { ATTENDANCE_DATE, FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeesList, LookupDetailsDto, LookupViewDto, ProjectViewDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { SelfEmployeeDto } from 'src/app/_models/dashboard';
import { employeeAttendanceDto, EmployeeLeaveDto, EmployeeLeaveOnDateDto, NotUpdatedAttendanceDatesListDto } from 'src/app/_models/employes';
import { AdminService } from 'src/app/_services/admin.service';
import { LOGIN_URI } from 'src/app/_services/api.uri.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { ReportService } from 'src/app/_services/report.service';
import { MAX_LENGTH_256 } from 'src/app/_shared/regex';
import * as FileSaver from "file-saver";

enum AttendanceReportTypes {
  MonthlyAttendanceReport = 'Monthly Attendance Report',
  YearlyAttendanceReport = 'Yearly Attendance Report',
  DatewiseAttendanceReport = 'Datewise Attendance Report',
  ProjectwiseAttendanceReport = 'Projectwise Attendance Report',
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styles: [
  ]
})
export class AttendanceComponent {
  @ViewChild('filter') filter!: ElementRef;
  month: number = new Date().getMonth() + 1;
  DatedFormat: string = ATTENDANCE_DATE
  days: number[] = [];
  maxLength: MaxLength = new MaxLength();
  year: number = new Date().getFullYear();
  day: number = new Date().getDate();
  employeeAttendanceList: employeeAttendanceDto[];
  globalFilterFields: string[] = ['EmployeeName'];
  NotUpdatedAttendanceDate: any;
  selectedMonth: Date;
  permissions: any;
  leaveReasons: LookupViewDto[] = [];
  dialog: boolean = false;
  projects: ProjectViewDto[] = [];
  fbAttendance!: FormGroup;
  fbDatewiseAttendanceReport!: FormGroup;
  fbProjectwiseAttendanceReport!: FormGroup;
  fbleave!: FormGroup;
  NotUpdatedAttendanceDatesList: NotUpdatedAttendanceDatesListDto[]
  PreviousAttendance: employeeAttendanceDto[];
  notUpdatedDates: any;
  confirmationDialog: boolean = false;
  LeaveTypes: LookupDetailsDto[] = [];
  filteredLeaveTypes: LookupDetailsDto[] = [];
  leaves: EmployeeLeaveDto[] = [];
  NotUpdatedEmployees: EmployeesList[] = [];
  showingLeavesOfColors: boolean = false;
  infoMessage: boolean;
  DatewiseAttendanceReportDialog: boolean = false;
  ProjectwiseAttendanceReportDialog: boolean = false;
  AttendanceReportsTypes: any[];
  value: number;
  selfEmployeeLeaveCount: SelfEmployeeDto;
  filteredLeaveReasons: LookupViewDto[] = [];
  employeeLeaveOnDate: EmployeeLeaveOnDateDto[] = [];
  today = new Date(this.year, this.month - 1, this.day);
  canUpdatePreviousDayAttendance: boolean = false;
  maxDate: Date = new Date();

  constructor(
    private adminService: AdminService,
    private reportService: ReportService,
    private dashBoardService: DashboardService,
    private datePipe: DatePipe,
    private jwtService: JwtService,
    public ref: DynamicDialogRef,
    private formbuilder: FormBuilder,
    private alertMessage: AlertmessageService,
    private employeeService: EmployeeService,
    private lookupService: LookupService) {
    this.selectedMonth = FORMAT_DATE(new Date(this.year, this.month - 1, 1));
    this.selectedMonth.setHours(0, 0, 0, 0);
  }

  ngOnInit() {
    this.infoMessage = false;
    this.permissions = this.jwtService.Permissions;
    this.canUpdatePreviousDayAttendance = this.permissions.CanUpdatePreviousDayAttendance;
    this.initAttendance();
    this.initLeaveForm();
    this.initProjects();
    this.getDaysInMonth(this.year, this.month);
    this.initDayWorkStatus();
    this.loadLeaveReasons();
    this.getLeaves();
  }

  initLeaveForm() {
    this.fbProjectwiseAttendanceReport = this.formbuilder.group({
      projectId: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required])
    })
    this.fbDatewiseAttendanceReport = this.formbuilder.group({
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required])
    })
    this.fbAttendance = this.formbuilder.group({
      attendanceId: new FormControl(0),
      notReported: new FormControl(false),
      employeeId: new FormControl('', [Validators.required]),
      dayWorkStatusId: new FormControl('', [Validators.required]),
      date: new FormControl(),
      isHalfDayLeave: new FormControl(),
    });
    this.fbleave = this.formbuilder.group({
      employeeLeaveId: [null],
      employeeId: new FormControl('', [Validators.required]),
      employeeName: new FormControl(''),
      fromDate: new FormControl("", [Validators.required]),
      toDate: new FormControl(null),
      leaveTypeId: new FormControl('', [Validators.required]),
      leaveReasonId: new FormControl(''),
      previousWorkStatusId: new FormControl(''),
      note: new FormControl('', [Validators.maxLength(MAX_LENGTH_256)]),
      isHalfDayLeave: new FormControl(),
      acceptedBy: new FormControl(null),
      acceptedAt: new FormControl(null),
      approvedBy: new FormControl(null),
      approvedAt: new FormControl(null),
      rejected: new FormControl(null),
      isFromAttendance: new FormControl(null),
    });
  }

  initProjects() {
    this.adminService.GetProjects().subscribe(resp => {
      this.projects = resp as unknown as ProjectViewDto[];
    });
  }
  initDayWorkStatus() {
    this.lookupService.DayWorkStatus().subscribe(resp => {
      const LeaveTypes = resp as unknown as LookupDetailsDto[];
      this.LeaveTypes = [];
      if (LeaveTypes) {
        LeaveTypes.forEach(item => {
          this.LeaveTypes.push({
            ...item,
            displayName: this.getLeaveTypeDisplayName(item.name)
          });
        });

      }
    })
  }
  getAttendanceReportTypeOptions() {
    const options = [];
    for (const key in AttendanceReportTypes) {
      if (AttendanceReportTypes.hasOwnProperty(key)) {
        options.push({ label: AttendanceReportTypes[key], value: key });
      }
    }
    return options;
  }
  getLeaveTypeDisplayName(name: string): string {
    switch (name) {
      case 'PT':
        return 'PT (Present)';
      case 'AT':
        return 'AT (Absent)';
      case 'PL':
        return 'PL (Privilege Leave)';
      case 'CL':
        return 'CL (Casual Leave)';
      case 'LWP':
        return 'LWP (Leave Without Pay)';
      case 'WFH':
        return 'WFH (Working from Home)';
      default:
        return null;
    }
  }
  initAttendance() {
    this.employeeService.GetAttendance(this.month, this.year).subscribe((resp) => {
      let employeesAttendance = resp as unknown as employeeAttendanceDto[];
      this.employeeAttendanceList = employeesAttendance.sort((a, b) => { return a.EmployeeName.localeCompare(b.EmployeeName) });
      this.initNotUpdatedAttendanceDatesList();
      if (this.NotUpdatedAttendanceDate)
        this.getNotUpdatedEmployeesList(this.NotUpdatedAttendanceDate, false);
      else
        this.CheckPreviousDayAttendance();
    });
  }

  initNotUpdatedAttendanceDatesList() {
    this.employeeService.GetNotUpdatedAttendanceDatesList(this.month, this.year).subscribe((resp) => {
      const NotUpdatedAttendanceDatesList = resp as unknown as NotUpdatedAttendanceDatesListDto[];
      this.NotUpdatedAttendanceDatesList = [] as unknown as NotUpdatedAttendanceDatesListDto[];
      if (NotUpdatedAttendanceDatesList)
        NotUpdatedAttendanceDatesList.forEach(item => {
          if (item?.date) {
            this.NotUpdatedAttendanceDatesList.push({
              date: this.datePipe.transform(item.date, 'dd MMM, yyyy'),
              dayOfWeek: this.getDayName(new Date(item.date).getDay())
            });
          }
        });

    });
  }
  getDayName(dayOfWeek: number): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayOfWeek];
  }

  onDropdownChange(value) {
    if (value)
      this.NotUpdatedAttendanceDate = this.datePipe.transform(new Date(value), 'yyyy-MM-dd');
    if (value == null)
      this.NotUpdatedAttendanceDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getNotUpdatedEmployeesList(this.NotUpdatedAttendanceDate, false)
  }

  showConfirmationDialog() {
    this.initDayWorkStatus();
    if (this.NotUpdatedEmployees.length === 0)
      this.alertMessage.displayInfo(ALERT_CODES["EAAS006"]);
    else
      this.confirmationDialog = true;
  }

  getLeaves() {
    this.employeeService.getEmployeeLeaveDetails(this.month, this.year,this.jwtService.EmployeeId).subscribe((resp) =>
      this.leaves = resp as unknown as EmployeeLeaveDto[]
    );
  }

  saveAttendance(data) {
    this.employeeService.AddAttendance(data).subscribe(
      (response) => {
        if (response) {
          this.alertMessage.displayAlertMessage(ALERT_CODES["EAAS001"]);
          this.confirmationDialog = false;
          this.initAttendance();
        }
        else
          this.alertMessage.displayErrorMessage(ALERT_CODES["EAAS002"]);
      }
    );
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
  addEmployeesAttendance() {
    const EmployeesList = [];
    this.NotUpdatedEmployees.forEach(each => {
      let type = this.LeaveTypes.find(x => x.name === 'PT');
      this.fbAttendance.patchValue({
        employeeId: each.employeeId,
        dayWorkStatusId: type.lookupDetailId,
        date: FORMAT_DATE(new Date(this.notUpdatedDates)),
        notReported: false,
        isHalfDayLeave: false,
      })
      EmployeesList.push(this.fbAttendance.value)
    })
    this.saveAttendance(EmployeesList);
  }

  onReject() {
    this.confirmationDialog = false;
  }


  getNotUpdatedEmployeesList(date, checkPreviousDate) {

    this.employeeService.GetNotUpdatedEmployees(date, checkPreviousDate).subscribe((resp) => {

      this.NotUpdatedEmployees = resp as unknown as EmployeesList[];
      if (this.NotUpdatedEmployees.length > 0) {
        this.notUpdatedDates = this.NotUpdatedEmployees[0].date;
        const formattedDate = this.datePipe.transform(this.notUpdatedDates, 'dd-MM-yyyy');
        const month = new Date(this.notUpdatedDates).getMonth() + 1;
        const year = new Date(this.notUpdatedDates).getFullYear();
        this.employeeService.GetAttendance(month, year).subscribe((resp) => {
          this.PreviousAttendance = resp as unknown as employeeAttendanceDto[];
        });
        if (this.notUpdatedDates && this.permissions?.CanManageAttendance && !this.infoMessage) {
          this.infoMessage = true;
          const message = ALERT_CODES["EAAS003"] + "  " + `${formattedDate}`;
          return this.alertMessage.displayInfo(message);
        }
      }
    });
  }
  getCountLeavescount(type: string): number {
    const formattedDate = this.datePipe.transform(this.notUpdatedDates, 'dd-MM-yyyy');
    return this.PreviousAttendance?.filter(each => each[formattedDate] === type).length;
  }

  CheckPreviousDayAttendance() {
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getNotUpdatedEmployeesList(formattedDate, false);
  }
  getEmployeeLeavesBasedOnId(emp: any, date: string, leaveType: string): void {
    this.filteredLeaveTypes = this.LeaveTypes;
    this.dashBoardService.GetAllottedLeavesBasedOnEId(emp.EmployeeId, this.month, this.year).subscribe((resp) => {
      this.selfEmployeeLeaveCount = resp[0] as SelfEmployeeDto;
      this.getEmployeeLeaveOnDate(emp, date, leaveType);

      this.filterLeaveType('CL', leaveType, this.selfEmployeeLeaveCount?.allottedCasualLeaves - this.selfEmployeeLeaveCount?.usedCasualLeavesInYear);
      this.filterLeaveType('PL', leaveType, this.selfEmployeeLeaveCount?.allottedPrivilegeLeaves - this.selfEmployeeLeaveCount?.usedPrivilegeLeavesInYear);
    });
  }

  getEmployeeLeaveOnDate(emp: any, date: string, leaveType: string) {
    let lt = leaveType.replace('/PT', "")
    let selectedLeaveType = this.LeaveTypes.filter(fn => fn.name == lt)[0] || {};
  
    this.employeeService.getEmployeeLeaveOnDate({
      employeeId: emp.EmployeeId,
      leaveDate: formatDate(this.stringToDate(date), 'yyyy-MM-dd', 'en'),
      leaveTypeId: selectedLeaveType.lookupDetailId
    }).subscribe({
      next: (data) => {
        this.employeeLeaveOnDate = data as unknown as EmployeeLeaveOnDateDto[];
        this.patchFormValues(emp, date, leaveType);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  filterLeaveType(type: string, leaveType: string, leaveBalance: number): void {
    if (leaveBalance <= 0 && leaveType !== type)
      this.filteredLeaveTypes = this.filteredLeaveTypes.filter(each => each.name !== type);
  }

  openDialog(emp: any, date: string, leaveType: string, rowIndex: number) {

    if (this.permissions?.CanUpdatePreviousDayAttendance) {
      this.getEmployeeLeavesBasedOnId(emp, date, leaveType);
      return;
    }
    if (!this.permissions?.CanManageAttendance || this.isPastDate(rowIndex)) {
      return;
    }
    this.getEmployeeLeavesBasedOnId(emp, date, leaveType);
  }

  patchFormValues(emp, date, leaveType) {
    
    let employeeleave: EmployeeLeaveOnDateDto = {}
    if (this.employeeLeaveOnDate.length > 0) {
      employeeleave = this.employeeLeaveOnDate[0]
    }
    this.filteredLeaveReasons = this.leaveReasons.filter(fn => fn.fkeySelfId == employeeleave.leaveTypeId);

    let lt = leaveType.replace('/PT', "")
    let selectDayWork = this.LeaveTypes.filter(fn => fn.name == lt)[0] || {};

    this.dialog = true;
    this.fbleave.reset();

    const defaultValues = {
      employeeId: emp.EmployeeId,
      employeeName: emp.EmployeeName,
      leaveReasonId: employeeleave.leaveReasonId,
      leaveTypeId: selectDayWork.lookupDetailId,
      previousWorkStatusId: selectDayWork.lookupDetailId,
      fromDate: this.stringToDate(date),
      notReported: false,
      isHalfDayLeave: employeeleave.isHalfDayLeave,
      note: employeeleave.note,
      isFromAttendance: true
    };
  
    this.fbleave.patchValue(defaultValues);
    this.fbleave.get('fromDate').disable();
  }

  get FormControls() {
    return this.fbleave.controls;
  }
  get FormReportControls() {
    return this.fbDatewiseAttendanceReport.controls;
  }
  get FormProjectReportControls() {
    return this.fbProjectwiseAttendanceReport.controls;
  }

  stringToDate(dateString: string) {
    const stringDateParts = dateString.split('-');
    const day = parseInt(stringDateParts[0], 10);
    const month = parseInt(stringDateParts[1], 10) - 1; // Subtract 1 from the month because months are 0-indexed
    const year = parseInt(stringDateParts[2], 10);
    const stringDateObject = new Date(year, month, day);
    return stringDateObject;
  }
  isPastDate(rowIndex: number) {
    let dateString = this.getFormattedDate(rowIndex);
    let date = this.stringToDate(dateString);
    return (date < this.today);
  }

  isFutureDate(rowIndex: number) {
    let dateString = this.getFormattedDate(rowIndex);
    let date = this.stringToDate(dateString);
    return (date > this.today);
  }

  isTodayDate(date: string): boolean {
    const today = new Date();
    let formattedDate = new Date(date);

    return (
      today.getFullYear() === formattedDate.getFullYear() &&
      today.getMonth() === formattedDate.getMonth() &&
      today.getDate() === formattedDate.getDate()
    );
  }

  isLeaveTypeSelected(type: number): boolean {
    return this.LeaveTypes.some(each => each.lookupDetailId === type && (each.name === 'PL' || each.name === 'CL'));
  }
  updateEmployeeAttendance() {
    const updateData = {
      ...this.fbleave.value,
      leaveTypeId: this.fbleave.get('leaveTypeId').value,
      fromDate: formatDate(new Date(this.fbleave.get('fromDate').value), 'yyyy-MM-dd', 'en'),
    };
    this.employeeService.updatePreviousDayEmployeeAttendance(updateData).subscribe(resp => {
      let rdata = resp as unknown as any;
      if (!rdata.isSuccess) {
        this.alertMessage.displayErrorMessage(rdata.message);
      }
      else {
        this.alertMessage.displayAlertMessage(ALERT_CODES["EAAS008"]);
      }
      //return this.alertMessage.displayErrorMessage(ALERT_CODES["EAAS009"]);
      this.initAttendance();
      this.getLeaves();
      this.dialog = false;
    });
  }

  addAttendance() {
    this.fbleave.get('fromDate').enable();
    // To update the previous day or updated attendance date of employee the condition will do and stops.
    if (this.fbleave?.get('previousWorkStatusId')?.value) {
      this.updateEmployeeAttendance();
      return;
    }

    // The condition checks the If day work status is not a leave then updates attendance, else updates or creates the
    // employee leave finally closes the opening employee work status update form.
    const DayWorkItem = this.LeaveTypes.find(each => each.lookupDetailId === this.fbleave.get('leaveTypeId').value);
    let fromDate = FORMAT_DATE(this.fbleave.get('fromDate').value);

    if (DayWorkItem.name !== 'PL' && DayWorkItem.name !== 'CL'&& DayWorkItem.name !== 'WFH') {
      this.fbAttendance.patchValue({
        employeeId: this.fbleave.get('employeeId').value,
        dayWorkStatusId: DayWorkItem.lookupDetailId,
        date: fromDate,
        notReported: false
      });
      this.saveAttendance([this.fbAttendance.value]);
    }
    else {
      this.fbleave.patchValue({
        fromDate: fromDate,
        acceptedBy: this.jwtService.EmployeeId,
        approvedBy: this.jwtService.EmployeeId,
        rejected: false
      });
      this.saveEmployeeLeave();

    }
    this.dialog = false;
  }


  saveEmployeeLeave() {
    let fromDate = FORMAT_DATE(this.fbleave.get('fromDate').value);
    this.fbleave.get('isFromAttendance').setValue(true);
    this.employeeService.CreateEmployeeLeaveDetails(this.fbleave.value).subscribe(resp => {
      let rdata = resp as unknown as any;
      if (!rdata.isSuccess)
        this.alertMessage.displayErrorMessage(rdata.message);
      else
        if (resp) {
          if (rdata.message)
            this.alertMessage.displayAlertMessage(rdata.message)
          else
            this.alertMessage.displayAlertMessage(ALERT_CODES["ELD001"]);
          if (fromDate < this.today) {
            const StatusId = this.LeaveTypes.find(each => each.name == "PT").lookupDetailId;
            this.fbAttendance.patchValue({
              employeeId: this.fbleave.get('employeeId').value,
              dayWorkStatusId: StatusId,
              date: fromDate,
              notReported: false
            });
            this.saveAttendance([this.fbAttendance.value]);
          }
        }

      this.initAttendance();
      this.getLeaves();
    });
  }

  checkLeaveType(id) {
    const leaveReasonControl = this.fbleave.get('leaveReasonId');
    this.fbleave.get('note').setValue('');
    const StatusId = this.LeaveTypes.find(each => each.lookupDetailId === this.fbleave.get('leaveTypeId').value);
    if (StatusId.name != 'PT' && StatusId.name != 'AT' && StatusId.name != 'LWP' && StatusId.name != 'WFH') {
      this.fbleave.get('note').setValue('Leave is Updated through Attendance form by Admin the approve is generated Automatically.');
      this.filteredLeaveReasons = this.leaveReasons.filter(fn => fn.fkeySelfId == id)
      leaveReasonControl.setValidators([Validators.required]);
    }
    if (StatusId.name != 'PL' && StatusId.name != 'CL') {
      this.fbleave.get('isHalfDayLeave').setValue(false);
      leaveReasonControl.clearValidators();
      leaveReasonControl.setErrors(null);
      this.fbleave.get('leaveReasonId').setValue(null);
    }
  }




  loadLeaveReasons() {
    this.lookupService.AllLeaveReasons().subscribe(resp => {
      if (resp) {
        this.leaveReasons = resp as unknown as LookupViewDto[];
      }
    })
  }

  gotoPreviousMonth() {
    if (this.month > 1)
      this.month--;
    else {
      this.month = 12;        // Reset to December
      this.year--;            // Decrement the year
    }
    this.selectedMonth = FORMAT_DATE(new Date(this.year, this.month - 1, 1));
    this.selectedMonth.setHours(0, 0, 0, 0);
    this.getDaysInMonth(this.year, this.month);
    this.initAttendance();
  }
  gotoNextMonth() {
    if (this.month < 12)
      this.month++;
    else {
      this.month = 1; // Reset to January
      this.year++;    // Increment the year
    }
    this.selectedMonth = FORMAT_DATE(new Date(this.year, this.month - 1, 1));
    this.selectedMonth.setHours(0, 0, 0, 0);
    this.getDaysInMonth(this.year, this.month);
    this.initAttendance();
  }

  onMonthSelect(event) {
    this.month = this.selectedMonth.getMonth() + 1; // Month is zero-indexed
    this.year = this.selectedMonth.getFullYear();
    this.getDaysInMonth(this.year, this.month);
    this.initAttendance();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  getAttendance(employee: any, i: number): string {
    const formattedDate = this.getFormattedDate(i);
    return employee[formattedDate];
  }

  getFormattedDate(i: number): string {
    const day = i.toString().padStart(2, '0');
    const month = this.month.toString().padStart(2, '0');
    return `${day}-${month}-${this.year}`;
  }

  getDaysInMonth(year: number, month: number) {
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + 1);
    date.setDate(date.getDate() - 1);
    let day = date.getDate();
    this.days = [];
    for (let i = 1; i <= day; i++) {
      this.days.push(i);
    }
  }

  toggleTab() {
    this.showingLeavesOfColors = !this.showingLeavesOfColors;
  }

  clearcard(dt1: Table) {
    dt1.filteredValue = null;
    this.filter.nativeElement.value = '';
  }
  DownloadAttendanceReport(name: string) {
    if (name == AttendanceReportTypes.DatewiseAttendanceReport)
      this.DatewiseAttendanceReportDialog = true;
    else if (name == AttendanceReportTypes.MonthlyAttendanceReport)
      this.downloadMonthlyAttendanceReport()
    else if (name == AttendanceReportTypes.YearlyAttendanceReport)
      this.downloadYearlyAttendanceReport()
    else if (name == AttendanceReportTypes.ProjectwiseAttendanceReport)
      this.ProjectwiseAttendanceReportDialog = true;
  }
  downloadProjectwiseAttendanceReport() {
    const fromDateValue = this.fbProjectwiseAttendanceReport.get('fromDate').value;
    const toDateValue = this.fbProjectwiseAttendanceReport.get('toDate').value;
    this.reportService.DownloadProjectwiseAttendanceReport(
      formatDate(new Date(fromDateValue), 'yyyy-MM-dd', 'en'),
      formatDate(new Date(toDateValue), 'yyyy-MM-dd', 'en'),
      this.fbProjectwiseAttendanceReport.get('projectId').value
    )
      .subscribe((resp) => {
        if (resp.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * resp.loaded / resp.total);
          this.value = percentDone;
        }
        if (resp.type === HttpEventType.Response) {
          const file = new Blob([resp.body], { type: 'text/csv' });
          const document = window.URL.createObjectURL(file);
          FileSaver.saveAs(document, "ProjectwiseAttendanceReport.csv");
          this.ProjectwiseAttendanceReportDialog = false;
        }
      })
  }

  downloadDatewiseAttendanceReport() {
    const fromDateValue = this.fbDatewiseAttendanceReport.get('fromDate').value;
    const toDateValue = this.fbDatewiseAttendanceReport.get('toDate').value;
    this.reportService.DownloadDatewiseAttendanceReport(
      formatDate(new Date(fromDateValue), 'yyyy-MM-d', 'en'),
      formatDate(new Date(toDateValue), 'yyyy-MM-d', 'en'),
    )
      .subscribe((resp) => {
        if (resp.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * resp.loaded / resp.total);
          this.value = percentDone;
        }
        if (resp.type === HttpEventType.Response) {
          const file = new Blob([resp.body], { type: 'text/csv' });
          const document = window.URL.createObjectURL(file);
          FileSaver.saveAs(document, "DatewiseAttendanceReport.csv");
          this.DatewiseAttendanceReportDialog = false;
        }
      })
  }

  downloadYearlyAttendanceReport() {
    this.reportService.DownloadYearlyAttendanceReport(this.year)
      .subscribe((resp) => {
        if (resp.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * resp.loaded / resp.total);
          this.value = percentDone;
        }
        if (resp.type === HttpEventType.Response) {
          const file = new Blob([resp.body], { type: 'text/csv' });
          const document = window.URL.createObjectURL(file);
          FileSaver.saveAs(document, "YearlyAttendanceReport.csv");
        }
      })
  }

  downloadMonthlyAttendanceReport() {
    this.reportService.DownloadMonthlyAttendanceReport(this.month, this.year)
      .subscribe((resp) => {
        if (resp.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * resp.loaded / resp.total);
          this.value = percentDone;
        }
        if (resp.type === HttpEventType.Response) {
          const file = new Blob([resp.body], { type: 'text/csv' });
          const document = window.URL.createObjectURL(file);
          FileSaver.saveAs(document, "MonthlyAttendanceReport.csv");
        }
      })
  }

  canUpdateAttendance(employee, i) {
    let dayWorkingStatus = this.getAttendance(employee, i);
    let isPastDay = this.isPastDate(i);
    let isFutureDay = this.isFutureDate(i);
    let isToday = !isPastDay && !isFutureDay
    let isJointed = dayWorkingStatus != 'NE'
    let weeklyOffOrHoliday = ['WOff', 'HD'].indexOf(dayWorkingStatus) > -1;
    return (isToday || (this.canUpdatePreviousDayAttendance && isPastDay && !isFutureDay)) && (isJointed && !weeklyOffOrHoliday)
  }

  getNonUpdateLabel(employee, rowIndex: number) {
    let dayWorkingStatus = this.getAttendance(employee, rowIndex)
    return dayWorkingStatus == 'NE' ? '' : dayWorkingStatus;
  }
}
