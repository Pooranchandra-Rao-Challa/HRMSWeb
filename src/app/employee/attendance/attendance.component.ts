import { ListRange } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { List } from 'gojs';
import { Table } from 'primeng/table';
import { Leave } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeesList, LookupDetailsDto } from 'src/app/_models/admin';
import { Employee, employeeAttendanceDto } from 'src/app/_models/employes';
import { AdminService } from 'src/app/_services/admin.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
// import { Employee, Leave } from 'src/app/demo/api/security';
// import { SecurityService } from 'src/app/demo/service/security.service';


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
  globalFilterFields: string[] = ['EmployeeName'];
  selectedMonth: Date;
  permissions: any;
  dialog: boolean = false;
  fbleave!: FormGroup;
  checkPreviousAttendance = true;
  notUpdatedDates: any;
  display: boolean = false;
  LeaveTypes: LookupDetailsDto[] = [];
  NotUpdatedEmployees: EmployeesList[] = [];

  constructor(private adminService: AdminService, private datePipe: DatePipe, private jwtService: JwtService, private router: Router,
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

  onMonthSelect(event) {
    this.month = this.selectedMonth.getMonth() + 1; // Month is zero-indexed
    this.year = this.selectedMonth.getFullYear();
    this.initAttendance();
  }

  showConfirmationDialog() {
    if (typeof this.notUpdatedDates === 'undefined')
      this.alertMessage.displayErrorMessage(ALERT_CODES["EAAS006"]);
    else
      this.display = true;

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

  initLeaveForm() {
    this.fbleave = this.formbuilder.group({
      attendanceId: new FormControl(0),
      notReported: new FormControl(false),
      employeeId: new FormControl('', [Validators.required]),
      dayWorkStatusId: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      toDate: new FormControl(''),
      note: new FormControl('')
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
      console.log(this.employeeAttendanceList)
    });
  }

  showDialog(empId: number, date, leaveType: string) {
    if (this.isFutureDate(date))
      return
    else {
      this.dialog = true;
      this.fbleave.reset();
      const StatusId = this.LeaveTypes.filter(each => each.name == leaveType)
      this.fbleave.patchValue({
        attendanceId: 0,
        employeeId: empId,
        dayWorkStatusId: StatusId[0]?.lookupDetailId,
        date: FORMAT_DATE(new Date(this.datePipe.transform(date, 'yyyy-dd-MM'))),
        notReported: false
      });
    }
  }

  get FormControls() {
    return this.fbleave.controls;
  }

  isFutureDate(dateString: string): boolean {
    const stringDateParts = dateString.split('-');
    const day = parseInt(stringDateParts[0], 10);
    const month = parseInt(stringDateParts[1], 10) - 1; // Subtract 1 from the month because months are 0-indexed
    const year = parseInt(stringDateParts[2], 10);
    const stringDateObject = new Date(year, month, day);
    const currentDate = new Date();
    return stringDateObject > currentDate;
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

  addSingleAttendance() {
    if (this.fbleave.get('dayWorkStatusId').value != 263 && this.fbleave.get('dayWorkStatusId').value != 264 && this.fbleave.get('note').value == null)
      return this.alertMessage.displayErrorMessage(ALERT_CODES["EAAS004"]);
    else {
      this.employeeService.CreateAttendance(this.fbleave.value).subscribe(response => {
        if (response) {
          this.alertMessage.displayAlertMessage(ALERT_CODES["EAAS005"]);
          this.dialog = false;
          this.initAttendance();
        }
        else
          this.alertMessage.displayErrorMessage(ALERT_CODES["EAAS002"]);
      });
      if (this.fbleave.get('dayWorkStatusId').value != 263 && this.fbleave.get('dayWorkStatusId').value != 264)
        this.router.navigate(['employee/leaves']);
    }
  }

  addPresent() {
    const EmployeesList = [];
    this.NotUpdatedEmployees.forEach(each => {
      let type = this.LeaveTypes.filter(x => x.name === 'PT');
      this.fbleave.patchValue({
        employeeId: each.employeeId,
        dayWorkStatusId: type[0].lookupDetailId,
        date: FORMAT_DATE(new Date(this.notUpdatedDates)),
        notReported: false
      })
      EmployeesList.push(this.fbleave.value)
    })
    this.save(EmployeesList)
  }

  gotoPreviousMonth() {
    if (this.month > 1)
      this.month--;
    else {
      this.month = 12;        // Reset to December
      this.year--;            // Decrement the year
    }
    this.initAttendance();
  }

  gotoNextMonth() {
    if (this.month < 12)
      this.month++;
    else {
      this.month = 1; // Reset to January
      this.year++;    // Increment the year
    }
    this.initAttendance();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getAttendanceType(employee: any, i: number): string {
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
