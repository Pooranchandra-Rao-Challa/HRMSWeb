import { DatePipe } from '@angular/common';
import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { LeaveDialogComponent } from 'src/app/_dialogs/leave.dialog/leave.dialog.component';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeesList, LookupDetailsDto } from 'src/app/_models/admin';
import { DialogRequest, LeaveDialog } from 'src/app/_models/common';
import { employeeAttendanceDto, EmployeeLeaveDto } from 'src/app/_models/employes';
import { AdminService } from 'src/app/_services/admin.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styles: [
  ]
})
export class AttendanceComponent {
  month: number = new Date().getMonth() + 1;
  days: number[] = [];
  year: number = 2023;
  employeesList!: EmployeesList[];
  employeeAttendanceList: employeeAttendanceDto[];
  globalFilterFields: string[] = ['EmployeeName',];
  selectedMonth: Date;
  permissions: any;
  dialog: boolean = false;
  fbAttendance!: FormGroup;
  fbleave!: FormGroup;
  checkPreviousAttendance = true;
  notUpdatedDates: any;
  display: boolean = false;
  LeaveTypes: LookupDetailsDto[] = [];
  NotUpdatedEmployees: EmployeesList[] = [];


  constructor(private adminService: AdminService, private datePipe: DatePipe, private jwtService: JwtService, public ref: DynamicDialogRef, private dialogService: DialogService,
    private formbuilder: FormBuilder, private alertMessage: AlertmessageService, private employeeService: EmployeeService, private lookupService: LookupService) { }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.CheckPreviousDayAttendance();
    this.initLeaveForm();
    this.initAttendance();
    this.getDaysInMonth(this.year, this.month);
    this.initEmployees();
    this.initDayWorkStatus();
  }

  initLeaveForm() {
    this.fbAttendance = this.formbuilder.group({
      attendanceId: new FormControl(0),
      notReported: new FormControl(false),
      employeeId: new FormControl('', [Validators.required]),
      dayWorkStatusId: new FormControl('', [Validators.required]),
      date: new FormControl('')
    });
    this.fbleave = this.formbuilder.group({
      employeeLeaveId: [null],
      employeeId: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl(null),
      leaveTypeId: new FormControl('', [Validators.required]),
      note: new FormControl(''),
      acceptedBy: new FormControl(null),
      acceptedAt: new FormControl(null),
      approvedBy: new FormControl(null),
      approvedAt: new FormControl(null),
      rejected: new FormControl(null),
    });
  }

  initEmployees() {
    this.adminService.getEmployeesList().subscribe(resp => {
      this.employeesList = resp as unknown as EmployeesList[];
    });
  }
  initDayWorkStatus() {
    this.lookupService.DayWorkStatus().subscribe(resp => {
      this.LeaveTypes = resp as unknown as LookupDetailsDto[];
    })
  }
  initAttendance() {
    this.employeeService.GetAttendance(this.month, this.year).subscribe((resp) => {
      this.employeeAttendanceList = resp as unknown as employeeAttendanceDto[];
    });
  }

  showConfirmationDialog() {
    if (typeof this.notUpdatedDates === 'undefined')
      this.alertMessage.displayErrorMessage(ALERT_CODES["EAAS006"]);
    else
      this.display = true;
  }

  save(data) {
    this.employeeService.AddAttendance(data).subscribe(
      (response) => {
        if (response) {
          this.alertMessage.displayAlertMessage(ALERT_CODES["EAAS001"]);
          this.display = false;
          this.initAttendance();
          this.CheckPreviousDayAttendance();
        }
        else
          this.alertMessage.displayErrorMessage(ALERT_CODES["EAAS002"]);
      }
    );
  }

  addPresent() {
    const EmployeesList = [];
    this.NotUpdatedEmployees.forEach(each => {
      let type = this.LeaveTypes.filter(x => x.name === 'PT');
      this.fbAttendance.patchValue({
        employeeId: each.employeeId,
        dayWorkStatusId: type[0].lookupDetailId,
        date: FORMAT_DATE(new Date(this.notUpdatedDates)),
        notReported: false
      })
      EmployeesList.push(this.fbAttendance.value)
    })
    this.save(EmployeesList)
  }

  onReject() {
    this.display = false;
  }

  getNotUpdatedEmployeesList(date, checkPreviousDate) {
    this.employeeService.GetNotUpdatedEmployees(date, checkPreviousDate).subscribe(resp => {
      this.NotUpdatedEmployees = resp as unknown as EmployeesList[];
      if (this.NotUpdatedEmployees.length > 0) {
        this.notUpdatedDates = resp[0].date;
        if (this.notUpdatedDates)
          return this.alertMessage.displayErrorMessage(ALERT_CODES["EAAS003"] + "  " + `${this.datePipe.transform(this.notUpdatedDates, 'dd-MM-yyyy')}`);
      }
      else if (this.checkPreviousAttendance) {
        this.checkPreviousAttendance = false;
        this.CheckPreviousDayAttendance();
      }
    });
  }

  CheckPreviousDayAttendance() {
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getNotUpdatedEmployeesList(formattedDate, this.checkPreviousAttendance);
  }

  openDialog(empId: number, date: string, leaveType: string) {
    const formattedDate = this.datePipe.transform(this.isFutureDate(date), 'dd-MM-yyyy');
    const currentDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
    if (formattedDate > currentDate || formattedDate <= this.datePipe.transform(dayBeforeYesterday, 'dd-MM-yyyy')) //Disable Click for future Dates
      return
    else if (formattedDate < currentDate && !this.checkPreviousAttendance)
      return;
    else if (formattedDate === currentDate && this.checkPreviousAttendance)
      return this.alertMessage.displayErrorMessage(ALERT_CODES["EAAS007"]);
    else {
      this.dialog = true;
      this.fbleave.reset();
      const StatusId = this.LeaveTypes.filter(each => each.name === leaveType)
      this.fbleave.patchValue({
        employeeId: empId,
        leaveTypeId: StatusId[0]?.lookupDetailId,
        fromDate: FORMAT_DATE(new Date(this.datePipe.transform(this.isFutureDate(date), 'yyyy-MM-dd'))),
        notReported: false
      });
    }
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


  addAttendance() {
    this.fbleave.patchValue({
      acceptedBy: this.jwtService.UserId,
      approvedBy: this.jwtService.UserId,
      rejected: false
    });
    this.saveAttendance().subscribe(resp => {
      if (resp) {
        this.dialog = false;
        this.initAttendance();
        this.alertMessage.displayAlertMessage(ALERT_CODES["EAAS001"]);
      }
      else
        return this.alertMessage.displayErrorMessage(ALERT_CODES["EAAS002"]);
    })
  }

  checkLeaveType() {
    this.fbleave.get('note').setValue('');
    const StatusId = this.LeaveTypes.filter(each => each.lookupDetailId === this.fbleave.get('leaveTypeId').value);
    if (StatusId[0].name != 'PT' && StatusId[0].name != 'AT')
      this.fbleave.get('note').setValue('Leave is Updated through Attendance form by Admin the approve is generated Automatically.');
  }

  saveAttendance(): Observable<HttpEvent<EmployeeLeaveDto[]>> {
    return this.employeeService.CreateEmployeeLeaveDetails(this.fbleave.value);
  }



  gotoPreviousMonth() {
    if (this.month > 1)
      this.month--;
    else {
      this.month = 12;        // Reset to December
      this.year--;            // Decrement the year
    }
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

}
