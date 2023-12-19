import { DatePipe, formatDate } from '@angular/common';
import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeesList, LookupDetailsDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { SelfEmployeeDto } from 'src/app/_models/dashboard';
import { employeeAttendanceDto, EmployeeLeaveDto } from 'src/app/_models/employes';
import { AdminService } from 'src/app/_services/admin.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MAX_LENGTH_256 } from 'src/app/_shared/regex';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styles: [
  ]
})
export class AttendanceComponent {
  month: number = new Date().getMonth() + 1;
  days: number[] = [];
  maxLength: MaxLength = new MaxLength();
  year: number = 2023;
  employeesList!: EmployeesList[];
  filteredData: employeeAttendanceDto[];
  employeeAttendanceList: employeeAttendanceDto[];
  globalFilterFields: string[] = ['EmployeeName',];
  selectedMonth: Date;
  permissions: any;
  dialog: boolean = false;
  fbAttendance!: FormGroup;
  fbleave!: FormGroup;
  checkPreviousAttendance = true;
  notUpdatedDates: any;
  confirmationDialog: boolean = false;
  LeaveTypes: LookupDetailsDto[] = [];
  filteredLeaveTypes: LookupDetailsDto[] = [];
  leaves: EmployeeLeaveDto[] = [];
  NotUpdatedEmployees: EmployeesList[] = [];
  showingLeavesOfColors: boolean = false;
  infoMessage: boolean;


  constructor(private adminService: AdminService, private dashBoardService: DashboardService, private datePipe: DatePipe, private jwtService: JwtService, public ref: DynamicDialogRef,
    private formbuilder: FormBuilder, private alertMessage: AlertmessageService, private employeeService: EmployeeService, private lookupService: LookupService) {
    this.selectedMonth = FORMAT_DATE(new Date(this.year, this.month - 1, 1));
    this.selectedMonth.setHours(0, 0, 0, 0);
  }

  ngOnInit() {
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
      date: new FormControl()
    });
    this.fbleave = this.formbuilder.group({
      employeeLeaveId: [null],
      employeeId: new FormControl('', [Validators.required]),
      employeeName: new FormControl(''),
      fromDate: new FormControl("", [Validators.required]),
      toDate: new FormControl(null),
      leaveTypeId: new FormControl('', [Validators.required]),
      note: new FormControl('', [Validators.maxLength(MAX_LENGTH_256)]),
      acceptedBy: new FormControl(null),
      acceptedAt: new FormControl(null),
      approvedBy: new FormControl(null),
      approvedAt: new FormControl(null),
      rejected: new FormControl(null),
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
    this.employeeService.getEmployeeLeaveDetails().subscribe((resp) => {
      this.leaves = resp as unknown as EmployeeLeaveDto[];
    });
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
    this.save(EmployeesList);
  }

  onReject() {
    this.confirmationDialog = false;
  }

  getNotUpdatedEmployeesList(date, checkPreviousDate) {
    this.employeeService.GetNotUpdatedEmployees(date, checkPreviousDate).subscribe((resp) => {
      this.NotUpdatedEmployees = resp as unknown as EmployeesList[];
      this.filteredData = this.filterEmployeeAttendanceList(date, checkPreviousDate);
  
      if (this.handleNotUpdatedEmployees()) {
        return;
      }
  
      if (this.checkPreviousAttendance) {
        this.checkPreviousAttendance = false;
        this.CheckPreviousDayAttendance();
      }
    });
  }
  
  filterEmployeeAttendanceList(date, checkPreviousDate) {
    date=new Date(date);
    const filteredData = this.employeeAttendanceList.filter((each) =>
      each[this.datePipe.transform(checkPreviousDate ? date.setDate(date.getDate() - 1): date, 'dd-MM-yyyy')] === 'NU'
    );
    return filteredData;
  }
  
  handleNotUpdatedEmployees() {
    if (this.NotUpdatedEmployees.length > 0) {
      this.notUpdatedDates = this.NotUpdatedEmployees[0].date;
      if (this.notUpdatedDates && this.permissions?.CanManageAttendance && !this.infoMessage) {
        this.infoMessage = true;
        this.alertMessage.displayInfo(ALERT_CODES["EAAS003"] + "  " + `${this.datePipe.transform(this.notUpdatedDates, 'dd-MM-yyyy')}`);
        return true;
      }
    }
    return false;
  }
  

  CheckPreviousDayAttendance() {
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getNotUpdatedEmployeesList(formattedDate, this.checkPreviousAttendance);
  }
  getEmployeeDataBasedOnId(emp: any, leaveType: string): void {
    this.dashBoardService.GetEmployeeDetails(emp.EmployeeId).subscribe((resp) => {
      const result = resp as SelfEmployeeDto;
      this.filterLeaveType('CL', leaveType, result.allottedCasualLeaves - result.usedCasualLeavesInYear);
      this.filterLeaveType('PL', leaveType, result.allottedPrivilegeLeaves - result.usedPrivilegeLeavesInYear);
    });
  }

  filterLeaveType(type: string, leaveType: string, leaveBalance: number): void {
    if (leaveBalance > 0 && leaveType !== type)
      this.filteredLeaveTypes = this.filteredLeaveTypes.filter(each => each.name !== type);
  }

  openDialog(emp: any, date: string, leaveType: string) {
    if (this.permissions?.CanManageAttendance) {
      const formattedDate = this.datePipe.transform(this.isFutureDate(date), 'dd-MM-yyyy');
      const currentDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
      const dayBeforeYesterday = new Date();
      dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
      if (formattedDate > currentDate || (formattedDate <= this.datePipe.transform(dayBeforeYesterday, 'dd-MM-yyyy')
        && formattedDate !== this.datePipe.transform(this.notUpdatedDates, 'dd-MM-yyyy')))
        return
      else if (formattedDate < currentDate && !this.checkPreviousAttendance)
        return;
      else if (formattedDate === currentDate && this.checkPreviousAttendance)
        return this.alertMessage.displayInfo(ALERT_CODES["EAAS007"]);
      else {
        this.filteredLeaveTypes = this.LeaveTypes;
        const result = this.leaves.filter(each => each.employeeId === emp.EmployeeId && this.datePipe.transform(each.fromDate, 'yyyy-MM-dd') === this.datePipe.transform(this.isFutureDate(date), 'yyyy-MM-dd'));
        this.getEmployeeDataBasedOnId(emp, leaveType);
        this.dialog = true;
        this.fbleave.reset();
        if (result.length > 0) {
          this.fbleave.patchValue({
            employeeId: result[0]?.employeeId,
            employeeName: result[0]?.employeeName,
            leaveTypeId: result[0]?.leaveTypeId,
            fromDate: FORMAT_DATE(new Date(this.datePipe.transform(result[0]?.fromDate, 'yyyy-MM-dd'))),
            note: result[0]?.note,
            notReported: false
          });
        }
        else {
          const StatusId = this.LeaveTypes.filter(each => each.name === leaveType)
          this.fbleave.patchValue({
            employeeId: emp.EmployeeId,
            employeeName: emp.EmployeeName,
            leaveTypeId: StatusId[0]?.lookupDetailId,
            fromDate: FORMAT_DATE(new Date(this.datePipe.transform(this.isFutureDate(date), 'yyyy-MM-dd'))),
            notReported: false
          });
        }
      }
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
    const StatusId = this.LeaveTypes.filter(each => each.lookupDetailId === this.fbleave.get('leaveTypeId').value);
    if (StatusId[0].name == 'PT' || StatusId[0].name == 'AT') {
      this.fbAttendance.patchValue({
        employeeId: this.fbleave.get('employeeId').value,
        dayWorkStatusId: StatusId[0].lookupDetailId,
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
      this.saveAttendance();
    }
    this.dialog = false;
  }


  saveAttendance() {
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

  checkLeaveType() {
    this.fbleave.get('note').setValue('');
    const StatusId = this.LeaveTypes.filter(each => each.lookupDetailId === this.fbleave.get('leaveTypeId').value);
    if (StatusId[0].name != 'PT' && StatusId[0].name != 'AT')
      this.fbleave.get('note').setValue('Leave is Updated through Attendance form by Admin the approve is generated Automatically.');
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
}
