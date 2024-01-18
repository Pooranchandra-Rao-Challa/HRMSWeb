import { PlatformLocation } from '@angular/common';
import { HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeesList, HolidaysViewDto, LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { SelfEmployeeDto, selfEmployeeMonthlyLeaves } from 'src/app/_models/dashboard';
import { EmployeeLeaveDto } from 'src/app/_models/employes';
import { AdminService } from 'src/app/_services/admin.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-employeeleave.dialog',
  templateUrl: './employeeleave.dialog.component.html'
})
export class EmployeeLeaveDialogComponent {
  fbLeave!: FormGroup;
  employees: EmployeesList[] = [];
  leaveType: LookupDetailsDto[] = [];
  leaveReasons: LookupViewDto[] = [];
  leaves: EmployeeLeaveDto[] = [];
  filteredLeaveTypes: LookupViewDto[] = [];
  maxLength: MaxLength = new MaxLength();
  filterCriteria: string[] = ['PT', 'AT'];
  filteringClsPls: any;
  disabledDates: Date[] = [];
  holidays: HolidaysViewDto[] = [];
  minDate: Date = new Date(new Date());
  maxDate: Date = new Date(new Date()); // Set the maxDate to a future date
  emailURL: string;
  errorMessage: string;
  empDetails: SelfEmployeeDto;
  currentRoute: any;
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  monthlyLeaves: selfEmployeeMonthlyLeaves[] = [];
  dialog: boolean = false;
  selectedLeaveType: string;
  empName: string;
  monthName: string;
  hasPendingLeaveInMonth: any;

  constructor(
    private formbuilder: FormBuilder,
    private adminService: AdminService,
    public jwtService: JwtService,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    private dashBoardService: DashboardService,
    public ref: DynamicDialogRef,
    public alertMessage: AlertmessageService,
    private platformLocation: PlatformLocation,
    private router: Router) {

    this.emailURL = `${platformLocation.protocol}//${platformLocation.hostname}:${platformLocation.port}/`
    const today = new Date();
    const currentYear = today.getFullYear();
    let year = new Date().getFullYear().toString(); // Set year dynamically
    this.adminService.GetHolidays(year).subscribe(
      (response) => {
        this.holidays = response as unknown as HolidaysViewDto[];
        this.initializeDisabledDates(currentYear);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnInit(): void {
    this.getEmployees();
    this.leaveForm();
  }


  // Initialize the disabled dates array for all months of the year
  initializeDisabledDates(currentYear: number): void {
    const datesToDisable: Date[] = [];

    for (let currentMonth = 0; currentMonth < 12; currentMonth++) {
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

      for (let day = 1; day <= 31; day++) {
        const currentDate = new Date(firstDayOfMonth);
        currentDate.setDate(day);

        if (currentDate >= firstDayOfMonth && currentDate <= lastDayOfMonth) {
          if (this.isWeekend(currentDate) || this.isHoliday(currentDate, this.holidays)) {
            datesToDisable.push(currentDate);
          }
        }
      }
    }
    this.disabledDates = datesToDisable;
  }

  // Check if a date is a weekend (Saturday or Sunday)
  isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  isHoliday(date: Date, holidayDates: HolidaysViewDto[]): boolean {
    const dateString = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    return holidayDates.some((holiday) => {
      const holidayFromDate = new Date(holiday.fromDate);
      const holidayToDate = new Date(holiday.toDate);

      if (!isNaN(holidayFromDate.getTime())) {
        // Check if the date is the same as fromDate
        const formattedHolidayFromDateString = holidayFromDate.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        });

        if (dateString === formattedHolidayFromDateString) {
          return true;
        }
      }

      if (!isNaN(holidayFromDate.getTime()) && !isNaN(holidayToDate.getTime())) {
        // Both fromDate and toDate are available, check if the date falls within the range
        const formattedHolidayFromDateString = holidayFromDate.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        });

        const formattedHolidayToDateString = holidayToDate.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        });

        if (
          dateString >= formattedHolidayFromDateString &&
          dateString <= formattedHolidayToDateString
        ) {
          return true;
        }
      }
      return false;
    });

  }

  getEmployees() {
    this.adminService.getEmployeesList().subscribe(resp => {
      this.employees = resp as unknown as EmployeesList[];
      this.currentRoute = this.router.url;
      if (this.currentRoute === '/dashboard/employee') {
        const defaultEmployeeId = this.jwtService.EmployeeId;
        this.fbLeave.get('employeeId')?.setValue(defaultEmployeeId);
        const selectedEmployee = this.employees.find(employee => String(employee.employeeId) === String(defaultEmployeeId));
        if (selectedEmployee) {
          this.fbLeave.get('employeeId')?.patchValue(selectedEmployee.employeeId);
          this.employees = [selectedEmployee];
        }
        if (defaultEmployeeId) {
          this.handleEmployeeLeaves();
        }
      } else if (this.currentRoute.startsWith('/employee/employeeleaves')) {
        this.employees = resp as unknown as EmployeesList[];
      }
    });
  }

  getLeaveTypes() {
    this.lookupService.DayWorkStatus().subscribe(resp => {
      this.leaveType = resp as unknown as LookupViewDto[];
      this.filteredLeaveTypes = this.leaveType.filter(item => !this.filterCriteria.includes(item.name));
      this.filteringClsPls = (
        (this.empDetails.allottedPrivilegeLeaves - this.empDetails.usedPrivilegeLeavesInYear) > 0 &&
        (this.empDetails.allottedCasualLeaves - this.empDetails.usedCasualLeavesInYear) > 0
      ) ? [] : ['PL', 'CL'];
      this.filteredLeaveTypes = this.leaveType.filter(item => {
        if (item.name === 'CL' && (this.empDetails.allottedCasualLeaves - this.empDetails.usedCasualLeavesInYear) > 0) {
          return true;
        }
        return !this.filteringClsPls.includes(item.name) && !this.filterCriteria.includes(item.name) && item.name !== 'LWP';
      });
    })
  }

  getLeaveReasonsByLeaveTypeId(id: number) {
    this.lookupService.LeaveReasons(id).subscribe(resp => {
      this.leaveReasons = resp as unknown as LookupViewDto[];
    })
  }

  onClose() {
    this.dialog = false;
  }

  handleEmployeeLeaves() {
    var employeeState = this.FormControls['employeeId'].disable;
    var empId: number;
    if (employeeState) {
      empId = this.FormControls['employeeId'].value;
    }
    else {
      empId = this.jwtService.EmployeeId;
    }
    this.onEmployeeSelect(empId);
  }

  onEmployeeSelect(employeeId: number) {
    this.dashBoardService.GetEmployeeDetails(employeeId).subscribe((resp) => {
      this.empDetails = resp as unknown as SelfEmployeeDto;
      this.getLeaveTypes();
    });
  }

  leaveForm() {
    this.fbLeave = this.formbuilder.group({
      employeeLeaveId: [null],
      employeeId: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl(null),
      isHalfDayLeave: new FormControl(false),
      isDeleted: new FormControl(false),
      isFromAttendance: new FormControl(false),
      leaveTypeId: new FormControl('', [Validators.required]),
      leaveReasonId: new FormControl(null),
      note: new FormControl('', [Validators.required]),
      acceptedBy: new FormControl(null),
      acceptedAt: new FormControl(null),
      approvedBy: new FormControl(null),
      approvedAt: new FormControl(null),
      rejected: new FormControl(null),
      comments: new FormControl(null),
      url: new FormControl(null)
    });
  }

  get FormControls() {
    return this.fbLeave.controls;
  }

  onChangeIsHalfDay() {
    const isHalfDayLeave = this.fbLeave.get('isHalfDayLeave').value;
    if (!isHalfDayLeave) {
      this.fbLeave.get('toDate').enable();
    } else {
      this.fbLeave.get('toDate').disable();
    }
  }

  save(): Observable<HttpEvent<EmployeeLeaveDto[]>> {
    return this.employeeService.CreateEmployeeLeaveDetails(this.fbLeave.value);
  }

  confirmation() {
    var employeeState = this.FormControls['employeeId'].disable;
    var empId: number;
    if (employeeState) {
      empId = this.FormControls['employeeId'].value;
    }
    else {
      empId = this.jwtService.EmployeeId;
    }
    const leaveType = this.leaveType.find(item => item.lookupDetailId === this.fbLeave.get('leaveTypeId').value);
    if (leaveType.name === 'CL') {
      this.dashBoardService.GetEmployeeLeavesForMonth(this.month, empId, this.year)
        .subscribe(resp => {
          this.monthlyLeaves = resp as unknown as selfEmployeeMonthlyLeaves[];          
          this.hasPendingLeaveInMonth = this.monthlyLeaves.some(leave => leave.leaveType === 'CL' && leave.status === 'Pending');
          const isLeaveRejected = this.monthlyLeaves.find(leave =>  leave.status === 'Rejected' && leave.leaveType === 'CL');          
          const isDeletedCL = this.monthlyLeaves.find(leave => leave.isDeleted === true && leave.leaveType === 'CL');          
          const clIsNotDeleted = this.monthlyLeaves.find(leave => (leave.isDeleted === false || leave.isDeleted === null) && leave.leaveType === 'CL');
          if(isLeaveRejected){
            this.onSubmit();
          }
          else if ((this.hasPendingLeaveInMonth && clIsNotDeleted) ||(this.hasPendingLeaveInMonth && isDeletedCL !==null && clIsNotDeleted && isLeaveRejected)) {
            this.dialog = true;
            const leaveWithEmployeeName = this.monthlyLeaves.find(leave => leave.employeeName);
            this.empName = leaveWithEmployeeName ? leaveWithEmployeeName.employeeName : 'Unknown';
            this.monthName = new Date(this.year, this.month - 1, 1).toLocaleString('default', { month: 'long' });
          }
          else if (this.hasPendingLeaveInMonth && isDeletedCL && isLeaveRejected) {
            this.onSubmit();
          }
          else {
            this.onSubmit();
          }
        });
    }
    else {
      this.onSubmit();
    }
  }

  onSubmit() {
    this.fbLeave.get('fromDate').setValue(FORMAT_DATE(new Date(this.fbLeave.get('fromDate').value)));
    this.fbLeave.get('toDate').setValue(this.fbLeave.get('toDate').value ? FORMAT_DATE(new Date(this.fbLeave.get('toDate').value)) : null);
    this.fbLeave.get('url').setValue(this.emailURL);
    if (this.fbLeave.valid) {
      this.save().subscribe(resp => {
        if (resp) {
          this.ref.close(true);
          let result = resp as unknown as any;
          if (!result.isSuccess || (result.isSuccess && result.message !== null)) {
            this.alertMessage.displayErrorMessage(result.message);
          }
          const leaveType = this.leaveType.find(item => item.lookupDetailId === this.fbLeave.get('leaveTypeId').value);
          if ((result.message === null && leaveType.name === 'CL') || leaveType.name === 'PL') {
            this.alertMessage.displayAlertMessage(ALERT_CODES["ELD001"]);
          }
          if (leaveType && leaveType.name === 'WFH') {
            this.alertMessage.displayAlertMessage(ALERT_CODES["WFH001"]);
          }
        }
      },
        (error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.alertMessage.displayErrorMessage(ALERT_CODES["ELD002"]);
          } else {
            const leaveType = this.leaveType.find(item => item.lookupDetailId === this.fbLeave.get('leaveTypeId').value);
            if (leaveType && leaveType.name === 'WFH') {
              this.alertMessage.displayErrorMessage(ALERT_CODES["WFH002"]);
            } else {
              this.alertMessage.displayErrorMessage(ALERT_CODES["ELD002"]);
            }

          }
        });
      this.ref.close(true);
    }
    else {
      this.fbLeave.markAllAsTouched();
    }
  }

  hideLeavereason() {
    const leaveReasonControl = this.fbLeave.get('leaveReasonId');
    const selectedLeaveTypeId = this.fbLeave.get('leaveTypeId').value;
    const leaveType = this.leaveType.find(item => item.lookupDetailId === selectedLeaveTypeId);
    if (leaveType && leaveType.name === 'WFH') {
      // If leave type is 'WFH', remove validators for 'leaveReasonId'
      leaveReasonControl.clearValidators();
      leaveReasonControl.setErrors(null);
      return false;
    } else {
      // If leave type is not 'WFH', set validators for 'leaveReasonId'
      leaveReasonControl.setValidators([Validators.required]);
      return true;
    }
  }

}