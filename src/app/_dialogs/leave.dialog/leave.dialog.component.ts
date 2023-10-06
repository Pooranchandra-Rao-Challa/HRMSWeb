import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeesList, LookupViewDto } from 'src/app/_models/admin';
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

