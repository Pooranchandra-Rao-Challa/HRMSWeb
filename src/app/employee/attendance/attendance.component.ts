import { DatePipe, formatDate, getLocaleFirstDayOfWeek } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { ATTENDANCE_DATE, FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeesList, LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { SelfEmployeeDto } from 'src/app/_models/dashboard';
import { employeeAttendanceDto, EmployeeLeaveDto } from 'src/app/_models/employes';
import { AdminService } from 'src/app/_services/admin.service';
import { LOGIN_URI } from 'src/app/_services/api.uri.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { ReportService } from 'src/app/_services/report.service';
import { MAX_LENGTH_256 } from 'src/app/_shared/regex';
import * as FileSaver from "file-saver";


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
  employeeAttendanceList: employeeAttendanceDto[];
  globalFilterFields: string[] = ['EmployeeName'];
  selectedMonth: Date;
  permissions: any;
  leaveReasons: LookupViewDto[] = [];
  dialog: boolean = false;
  fbAttendance!: FormGroup;
  fbleave!: FormGroup;
  checkPreviousAttendance = true;
  PreviousAttendance: employeeAttendanceDto[];
  notUpdatedDates: any;
  confirmationDialog: boolean = false;
  LeaveTypes: LookupDetailsDto[] = [];
  filteredLeaveTypes: LookupDetailsDto[] = [];
  leaves: EmployeeLeaveDto[] = [];
  NotUpdatedEmployees: EmployeesList[] = [];
  showingLeavesOfColors: boolean = false;
  infoMessage: boolean;
  value: number;
  canUpdatePreviousdayAttendance: boolean;
  selfEmployeeLeaveCount: SelfEmployeeDto;


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
    this.canUpdatePreviousdayAttendance = true;
    this.infoMessage = false;
    this.permissions = this.jwtService.Permissions;
    this.initAttendance();
    this.initLeaveForm();
    this.getDaysInMonth(this.year, this.month);
    this.initDayWorkStatus();
    this.getLeaves();
  }

  initLeaveForm() {
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
      previousWorkstatus: new FormControl(''),
      note: new FormControl('', [Validators.maxLength(MAX_LENGTH_256)]),
      isHalfDayLeave: new FormControl(),
      acceptedBy: new FormControl(null),
      acceptedAt: new FormControl(null),
      approvedBy: new FormControl(null),
      approvedAt: new FormControl(null),
      rejected: new FormControl(null),
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
      default:
        return null;
    }
  }
  initAttendance() {
    this.employeeService.GetAttendance(this.month, this.year).subscribe((resp) => {
      this.employeeAttendanceList = resp as unknown as employeeAttendanceDto[];
      this.CheckPreviousDayAttendance();
    });
  }

  showConfirmationDialog() {
    this.initDayWorkStatus();
    if (this.NotUpdatedEmployees.length === 0)
      this.alertMessage.displayInfo(ALERT_CODES["EAAS006"]);
    else
      this.confirmationDialog = true;
  }

  getLeaves() {
    this.employeeService.getEmployeeLeaveDetails().subscribe((resp) =>
      this.leaves = resp as unknown as EmployeeLeaveDto[]
    );
  }

  save(data) {
    this.employeeService.AddAttendance(data).subscribe(
      (response) => {
        if (response) {
          this.alertMessage.displayAlertMessage(ALERT_CODES["EAAS001"]);
          this.confirmationDialog = false;
          this.initAttendance();
          this.CheckPreviousDayAttendance();
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
    this.save(EmployeesList);
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
      } else if (this.checkPreviousAttendance) {
        this.checkPreviousAttendance = false;
        this.CheckPreviousDayAttendance();
      }
    });
  }
  getCountLeavescount(type: string): number {
    const formattedDate = this.datePipe.transform(this.notUpdatedDates, 'dd-MM-yyyy');
    return this.PreviousAttendance?.filter(each => each[formattedDate] === type).length;
  }

  CheckPreviousDayAttendance() {
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getNotUpdatedEmployeesList(formattedDate, this.checkPreviousAttendance);
  }
  getEmployeeLeavesBasedOnId(emp: any, leaveType: string): void {
    this.dashBoardService.GetEmployeeDetails(emp.EmployeeId).subscribe((resp) => {
      this.selfEmployeeLeaveCount = resp as SelfEmployeeDto;
      this.filterLeaveType('CL', leaveType, this.selfEmployeeLeaveCount?.allottedCasualLeaves - this.selfEmployeeLeaveCount?.usedCasualLeavesInYear);
      this.filterLeaveType('PL', leaveType, this.selfEmployeeLeaveCount?.allottedPrivilegeLeaves - this.selfEmployeeLeaveCount?.usedPrivilegeLeavesInYear);
    });
  }

  filterLeaveType(type: string, leaveType: string, leaveBalance: number): void {
    if (leaveBalance <= 0 && leaveType !== type)
      this.filteredLeaveTypes = this.filteredLeaveTypes.filter(each => each.name !== type);
  }

  openDialog(emp: any, date: string, leaveType: string) {
    if (this.canUpdatePreviousdayAttendance) {
      this.patchFormValues(emp, date, leaveType);
      return;
    }
    if (!this.permissions?.CanManageAttendance || !this.isValidDate(date)) {
      return;
    }
    this.patchFormValues(emp, date, leaveType);
  }
  
  isValidDate(date: string): boolean {
    const formattedDate = this.isFutureDate(this.datePipe.transform(new Date(this.isFutureDate(date)), 'dd-MM-yyyy'));
    const currentDate = this.isFutureDate(this.datePipe.transform(new Date(), 'dd-MM-yyyy'));
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
  
    if (formattedDate.toISOString() === currentDate.toISOString() && this.checkPreviousAttendance) {
      this.alertMessage.displayInfo(ALERT_CODES["EAAS007"]);
      return false;
    }
  
    return !(
      formattedDate.toISOString() > currentDate.toISOString() ||
      (formattedDate.toISOString() <= this.isFutureDate(this.datePipe.transform(dayBeforeYesterday, 'dd-MM-yyyy')).toISOString() &&
        formattedDate.toISOString() !== this.isFutureDate(this.notUpdatedDates).toISOString()) ||
      (formattedDate.toISOString() < currentDate.toISOString() && !this.checkPreviousAttendance)
    );
  }
  

  patchFormValues(emp,date,leaveType){
    this.filteredLeaveTypes = this.LeaveTypes;
    const result = this.leaves.find(
      each => each.employeeId === emp.EmployeeId && this.datePipe.transform(each.fromDate, 'yyyy-MM-dd') === this.datePipe.transform(this.isFutureDate(date), 'yyyy-MM-dd')
    );

    this.getEmployeeLeavesBasedOnId(emp, leaveType);
    this.dialog = true;
    this.fbleave.reset();

    if (result && !result?.rejected) {
      this.fbleave.patchValue({
        employeeId: result?.employeeId,
        employeeName: result?.employeeName,
        leaveTypeId: result?.leaveTypeId,
        fromDate: FORMAT_DATE(new Date(this.datePipe.transform(result?.fromDate, 'yyyy-MM-dd'))),
        note: result?.note,
        previousWorkstatus:result?.leaveTypeId,
        notReported: false,
        isHalfDayLeave: result?.isHalfDayLeave,
        leaveReasonId: result?.leaveReasonId
      });
    } else {
      const statusId = this.LeaveTypes.find(each => each.name === leaveType)?.lookupDetailId;
      this.fbleave.patchValue({
        employeeId: emp.EmployeeId,
        employeeName: emp.EmployeeName,
        leaveTypeId: statusId,
        previousWorkstatus:statusId,
        fromDate: FORMAT_DATE(new Date(this.datePipe.transform(this.isFutureDate(date), 'yyyy-MM-dd'))),
        notReported: false,
        isHalfDayLeave: false
      });
    }
    console.log(this.fbleave.value);
  }

  get FormControls() {
    return this.fbleave.controls;
  }

  isFutureDate(dateString: string) {
    const stringDateParts = dateString.split('-');
    const day = parseInt(stringDateParts[0], 10);
    const month = parseInt(stringDateParts[1], 10) - 1; // Subtract 1 from the month because months are 0-indexed
    const year = parseInt(stringDateParts[2], 10);
    const stringDateObject = new Date(year, month, day);
    return stringDateObject;
  }

  isLeaveTypeSelected(type: number): boolean {
    return this.LeaveTypes.some(each => each.lookupDetailId === type && (each.name === 'PL' || each.name === 'CL'));
  }
  updateEmployeeAttendance(){
    this.employeeService.updateEmployeeAttendance(this.fbleave.value).subscribe(resp => {
      if (resp) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["EAAS008"]);
        this.CheckPreviousDayAttendance();
      }
      else
        return this.alertMessage.displayErrorMessage(ALERT_CODES["EAAS009"]);
      this.initAttendance();
      this.getLeaves();
    });
  }
  addAttendance() {
    if(this.fbleave.get('previousWorkstatus').value){
      this.updateEmployeeAttendance();
      return
    }
    const StatusId = this.LeaveTypes.find(each => each.lookupDetailId === this.fbleave.get('leaveTypeId').value);
    if (StatusId.name == 'PT' || StatusId.name == 'AT') {
      this.fbAttendance.patchValue({
        employeeId: this.fbleave.get('employeeId').value,
        dayWorkStatusId: StatusId.lookupDetailId,
        date: this.fbleave.get('fromDate').value,
        notReported: false
      });
      this.save([this.fbAttendance.value]);
    }
    else {
      this.fbleave.patchValue({
        acceptedBy: this.jwtService.UserId,
        approvedBy: this.jwtService.UserId,
        rejected: false
      });
      this.saveEmployeeLeave();
    }
    this.dialog = false;
  }


  saveEmployeeLeave() {
    this.employeeService.CreateAttendance(this.fbleave.value).subscribe(resp => {
      if (resp) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["ELD001"]);
        this.CheckPreviousDayAttendance();
      }
      else
        return this.alertMessage.displayErrorMessage(ALERT_CODES["ELR002"]);
      this.initAttendance();
      this.getLeaves();
    });
  }

  checkLeaveType(id) {
    this.fbleave.get('note').setValue('');
    const StatusId = this.LeaveTypes.find(each => each.lookupDetailId === this.fbleave.get('leaveTypeId').value);
    if (StatusId.name != 'PT' && StatusId.name != 'AT') {
      this.fbleave.get('note').setValue('Leave is Updated through Attendance form by Admin the approve is generated Automatically.');
      this.lookupService.LeaveReasons(id).subscribe(resp => {
        if (resp) {
          this.leaveReasons = resp as unknown as LookupViewDto[];
        }
      })
    }
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

  downloadAttendanceReport() {
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
}
