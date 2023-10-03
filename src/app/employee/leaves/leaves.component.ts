import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ITableHeader } from 'src/app/_models/common';
import { EmployeesList, HolidaysViewDto } from 'src/app/_models/admin';
import { JwtService } from 'src/app/_services/jwt.service';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { LeaveDto } from 'src/app/_models/employes';
import { SecurityService } from 'src/app/demo/service/security.service';
import { AdminService } from 'src/app/_services/admin.service';


interface LeaveType {
  name: string;
  code: string;
}

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styles: [
  ]
})
export class LeavesComponent {
  leaves: LeaveDto[] = [];
  globalFilterFields: string[] = ['leaveTypeId', 'fromDate', 'toDate', 'toDate', 'note', 'acceptedBy', 'acceptedAt', 'approvedBy', 'approvedAt']
  @ViewChild('filter') filter!: ElementRef;
  fbLeave!: FormGroup;
  permissions: any;
  dialog: boolean = false;
  faleaveDetails!: FormArray;
  leaveType: LeaveType[] | undefined;
  employees: EmployeesList[] = [];


  headers: ITableHeader[] = [
    { field: 'leaveTypeId', header: 'leaveTypeId', label: 'Leave Type' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'note', header: 'note', label: 'Leave Description' },
    { field: 'rejected', header: 'rejected', label: 'Rejected' },
    { field: 'acceptedBy', header: 'acceptedBy', label: 'Accepted By' },
    { field: 'acceptedAt', header: 'acceptedAt', label: 'Accepted At' },
    { field: 'approvedBy', header: 'approvedBy', label: 'Approved By' },
    { field: 'approvedAt', header: 'approvedAt', label: 'Approved At' },
  ];

  constructor(
    private formbuilder: FormBuilder,
    private jwtService: JwtService,
    private globalFilterService: GlobalFilterService,
    private securityService: SecurityService,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.getLeaves();
    this.getEmployees();
    this.permissions = this.jwtService.Permissions
    this.leaveType = [
      { name: 'CL', code: 'cl' },
      { name: 'PL', code: 'pl' },
      { name: 'SL', code: 'sl' }
    ];
    this.leaveForm();
    this.addLeaveDetails();
  }
  
  getLeaves() {
    this.securityService.getleaves().then(resp => {
      this.leaves = resp;
    });
  }

  getEmployees() {
    this.adminService.getEmployeesList().subscribe(resp => {
      this.employees = resp as unknown as EmployeesList[];
    });
  }
  
  onGlobalFilter(table: Table, event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.globalFilterService.filterTableByDate(table, searchTerm);
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
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
  faleaveDetail(): FormArray {
    return this.fbLeave.get("leaveDetails") as FormArray
  }

  formArrayControls(i: number, formControlName: string) {
    return this.faleaveDetail().controls[i].get(formControlName);
  }
  generaterow(leaveDetails: LeaveDto = new LeaveDto()): FormGroup {
    const formGroup = this.formbuilder.group({
      fromDate: new FormControl(leaveDetails.fromDate),
      toDate: new FormControl(leaveDetails.toDate),
      leaveTypeId: new FormControl(leaveDetails.leaveTypeId),
      note: new FormControl(leaveDetails.note),
      acceptedBy: new FormControl(leaveDetails.acceptedBy),
      acceptedAt: new FormControl(leaveDetails.acceptedAt),
      approvedBy: new FormControl(leaveDetails.approvedBy),
      approvedAt: new FormControl(leaveDetails.approvedAt),
      rejected: new FormControl(leaveDetails.rejected),
    });
    return formGroup;
  }
  addLeave() {
    this.dialog = true;
  }
  addLeaveDetails() {
    this.faleaveDetails = this.fbLeave.get("leaveDetails") as FormArray
    this.faleaveDetails.push(this.generaterow())
  }
}
