import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EmployeesList } from 'src/app/_models/admin';
import { AdminService } from 'src/app/_services/admin.service';

interface LeaveType {
  name: string;
  code: string;
}

@Component({
  selector: 'app-leave.dialog',
  templateUrl: './leave.dialog.component.html',
  styles: [
  ]
})
export class LeaveDialogComponent {
  fbLeave!: FormGroup;
  leaveType: LeaveType[] | undefined;
  employees: EmployeesList[] = [];

  constructor(
    private formbuilder: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.getEmployees();
    this.leaveType = [
      { name: 'CL', code: 'cl' },
      { name: 'PL', code: 'pl' },
      { name: 'SL', code: 'sl' }
    ];
    this.leaveForm();
  }

  getEmployees() {
    this.adminService.getEmployeesList().subscribe(resp => {
      this.employees = resp as unknown as EmployeesList[];
    });
  }
  
  leaveForm() {
    this.fbLeave = this.formbuilder.group({
      id: new FormControl(''),
      employeeId: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      leaveTypeId: new FormControl(''),
      note: new FormControl(''),
      acceptedBy: new FormControl(''),
      acceptedAt: new FormControl(''),
      approvedBy: new FormControl(''),
      approvedAt: new FormControl(''),
      rejected: new FormControl(true),
      leaveDetails: this.formbuilder.array([])
    });
  }

  get FormControls() {
    return this.fbLeave.controls;
  }
}
