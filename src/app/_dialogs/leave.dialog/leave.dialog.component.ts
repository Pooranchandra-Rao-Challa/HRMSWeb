import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeesList, HolidaysViewDto, LookupViewDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { EmployeeLeaveDto } from 'src/app/_models/employes';
import { AdminService } from 'src/app/_services/admin.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-leave.dialog',
  templateUrl: './leave.dialog.component.html'
})
export class LeaveDialogComponent {
  fbLeave!: FormGroup;
  employees: EmployeesList[] = [];
  leaveType: LookupViewDto[] = [];
  leaves: EmployeeLeaveDto[] = [];
  filteredLeaveTypes: LookupViewDto[] = [];
  maxLength: MaxLength = new MaxLength();
  filterCriteria: string[] = ['PT', 'AT'];
  disabledDates: Date[] = [];
  holidays: HolidaysViewDto[] = [];
  year: string;

  constructor(
    private formbuilder: FormBuilder,
    private adminService: AdminService,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    public ref: DynamicDialogRef,
    public alertMessage: AlertmessageService) { }

  ngOnInit(): void {
    this.getEmployees();
    this.getLeaveTypes();
    this.leaveForm();

    const today = new Date();
    const currentYear = today.getFullYear();
    this.year = new Date().getFullYear().toString(); // Set year dynamically
    this.adminService.GetHolidays(this.year).subscribe(
      (response) => {
        console.log(response);
        this.holidays = response as unknown as HolidaysViewDto[];
        this.initializeDisabledDates(currentYear);
      },
      (error) => {
        console.error('Failed to fetch holiday dates:', error);
      }
    );
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
    });
  }

  getLeaveTypes() {
    this.lookupService.DayWorkStatus().subscribe(resp => {
      this.leaveType = resp as unknown as LookupViewDto[];
      this.filteredLeaveTypes = this.leaveType.filter(item => !this.filterCriteria.includes(item.name));
    })
  }

  leaveForm() {
    this.fbLeave = this.formbuilder.group({
      employeeLeaveId: [null],
      employeeId: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl(null),
      leaveTypeId: new FormControl('', [Validators.required]),
      note: new FormControl('', [Validators.required]),
      acceptedBy: new FormControl(null),
      acceptedAt: new FormControl(null),
      approvedBy: new FormControl(null),
      approvedAt: new FormControl(null),
      rejected: new FormControl(null),
    });
  }

  get FormControls() {
    return this.fbLeave.controls;
  }

  save(): Observable<HttpEvent<EmployeeLeaveDto[]>> {
    return this.employeeService.CreateEmployeeLeaveDetails(this.fbLeave.value)
  }

  onSubmit() {
    this.fbLeave.get('fromDate').setValue(FORMAT_DATE(new Date(this.fbLeave.get('fromDate').value)));
    this.fbLeave.get('toDate').setValue(this.fbLeave.get('toDate').value ? FORMAT_DATE(new Date(this.fbLeave.get('toDate').value)) : null);
    if (this.fbLeave.valid) {
      this.save().subscribe(resp => {
        if (resp) {
          this.ref.close(true);
          this.alertMessage.displayAlertMessage(ALERT_CODES["ELD001"]);
        }
      });
    }
    else {
      this.fbLeave.markAllAsTouched();
    }
  }

}
