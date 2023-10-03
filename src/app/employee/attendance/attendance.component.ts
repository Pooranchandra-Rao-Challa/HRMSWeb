import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Leave } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeesList, LookupDetailsDto } from 'src/app/_models/admin';
import { Employee, employeeAttendenceDto } from 'src/app/_models/employes';
import { AdminService } from 'src/app/_services/admin.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';
// import { Employee, Leave } from 'src/app/demo/api/security';
// import { SecurityService } from 'src/app/demo/service/security.service';

interface Month {
  Monthname: string;
}
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styles: [
  ]
})
export class AttendanceComponent {
  month: number = 10;
  days: number[] = [];
  year: number = 2023;
  employees!: EmployeesList[];
  employeeAttendenceList: employeeAttendenceDto[];
  globalFilterFields: string[] = ['EmployeeName'];
  selectedMonths: Month | undefined;
  Months: Month[] | undefined;
  dialog: boolean = false;
  fbleave!: FormGroup;
  LeaveType: LookupDetailsDto[] = [];
  NotUpdatesEmployees = [];

  constructor(private securityService: SecurityService, private adminService: AdminService,
    private formbuilder: FormBuilder, private alertMessage: AlertmessageService, private employeeService: EmployeeService, private lookupService: LookupService) { }

  ngOnInit() {
    this.initLeaveForm();
    this.initAtendence();
    this.getDaysInMonth(this.year, this.month);
    this.initEmployees();
    this.initDayWorkStatus();
    this.getNotUpdatedEmployeesList();
  }
  initLeaveForm() {
    this.fbleave = this.formbuilder.group({
      attendanceId: new FormControl(0),
      notReported: new FormControl(false),
      employeeId: new FormControl('', [Validators.required]),
      dayWorkStatusId: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      toDate: new FormControl(''),
      leaveDescription: new FormControl('')
    });
  }
  initEmployees() {
    this.adminService.getEmployeesList().subscribe(resp => {
      this.employees = resp as unknown as EmployeesList[];
    });
  }
  initDayWorkStatus() {
    this.lookupService.DayWorkStatus().subscribe(resp => {
      this.LeaveType = resp as unknown as LookupDetailsDto[];
    })
  }
  initAtendence() {
    this.employeeService.GetAttendence(this.month).subscribe((resp) => {
      this.employeeAttendenceList = resp as unknown as employeeAttendenceDto[];
    });
  }
  getNotUpdatedEmployeesList() {
    this.employeeService.GetNotUpdatedEmployees("2023-10-03").subscribe(resp => {
      this.NotUpdatesEmployees = resp as unknown as EmployeesList[];
    })
  }

  showDialog(empId, date) {
    this.dialog = true;
    this.fbleave.reset();
    this.fbleave.get('employeeId').setValue(empId);
    this.fbleave.get('date').setValue(FORMAT_DATE(new Date(date)));
  }
  get FormControls() {
    return this.fbleave.controls;
  }
  getDaysInMonth(year: number, month: number) {
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + 1);
    date.setDate(date.getDate() - 1);
    let day = date.getDate();
    for (let i = 1; i <= day; i++) {
      this.days.push(i);
    }
  }

  save(data) {
    this.employeeService.AddAttendence(data).subscribe(
      (response) => {
        if (response) {
          this.alertMessage.displayAlertMessage(ALERT_CODES["EAAS001"]);
          this.initAtendence();
        }
        else
          this.alertMessage.displayErrorMessage(ALERT_CODES["EAAS002"]);
      }
    );
  }
  addPresent() {
    const EmployeesList = [];
    this.NotUpdatesEmployees.forEach(each => {
      let type = this.LeaveType.filter(x => x.name === 'PT');
      this.fbleave.patchValue({
        employeeId: each.employeeId,
        dayWorkStatusId: type[0].lookupDetailId,
        date: FORMAT_DATE(new Date("03-oct-2023")),
        notReported: false
      })
      EmployeesList.push(this.fbleave.value)
    })
    this.save(EmployeesList)
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  isEligibleForLeave(employee: any, i: number): string {
    const formattedDate = this.getFormattedDate(i);
    return employee[formattedDate];
  }

  getFormattedDate(i: number): string {
    const day = i.toString().padStart(2, '0');
    const month = this.month.toString().padStart(2, '0');
    return `${day}-${month}-2023`;
  }
}
