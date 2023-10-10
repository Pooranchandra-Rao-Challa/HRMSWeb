import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { EmployeeLeaveDto } from 'src/app/_models/employes';
import { LeaveDialogComponent } from 'src/app/_dialogs/leave.dialog/leave.dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtService } from 'src/app/_services/jwt.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { LookupService } from 'src/app/_services/lookup.service';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styles: [
  ]
})
export class LeavesComponent {
  globalFilterFields: string[] = ['employeeId', 'leaveTypeId', 'fromDate', 'toDate', 'toDate', 'note', 'acceptedBy', 'acceptedAt', 'approvedBy', 'approvedAt']
  @ViewChild('filter') filter!: ElementRef;
  ActionTypes = Actions;
  leaveDialogComponent = LeaveDialogComponent;
  dialogRequest: DialogRequest = new DialogRequest();
  fbLeave!: FormGroup;
  leaves: EmployeeLeaveDto[] = [];
  leaveTypes: LookupDetailsDto[] = [];
  filteredLeaveTypes: LookupViewDto[] = [];
  leaveTypeMap: { [key: number]: string } = {};
  mediumDate: string = MEDIUM_DATE
  dialog: boolean = false;
  selectedAction: string | null = null;

  headers: ITableHeader[] = [
    { field: 'employeeName', header: 'employeeName', label: 'Employee Name' },
    { field: 'leaveTypeId', header: 'leaveTypeId', label: 'Leave Type' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'note', header: 'note', label: 'Leave Description' },
    { field: 'acceptedBy', header: 'acceptedBy', label: 'Accepted By' },
    { field: 'acceptedAt', header: 'acceptedAt', label: 'Accepted At' },
    { field: 'approvedBy', header: 'approvedBy', label: 'Approved By' },
    { field: 'approvedAt', header: 'approvedAt', label: 'Approved At' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'status', header: 'status', label: 'Status' }
  ];

  constructor(
    private globalFilterService: GlobalFilterService,
    private employeeService: EmployeeService,
    private lookupService: LookupService,
    private dialogService: DialogService,
    public ref: DynamicDialogRef,
    private formbuilder: FormBuilder,
    private jwtService: JwtService) { }

  ngOnInit(): void {
    this.getLeaves();
    this.getLeaveTypes();
    this.leaveForm();
  }

  getLeaves() {
    this.employeeService.getEmployeeLeaveDetails().subscribe((resp) => {
      this.leaves = resp as unknown as EmployeeLeaveDto[];
      console.log(resp);
    })
  }

  getLeaveTypes() {
    this.lookupService.DayWorkStatus().subscribe((resp) => {
      this.leaveTypes = resp as unknown as LookupViewDto[];
      this.leaveTypes.forEach((type) => {
        this.leaveTypeMap[type.lookupDetailId] = type.name;
      });
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
      employeeLeaveId: [null],
      employeeId: new FormControl('', [Validators.required]),
      employeeName: new FormControl(''),
      code: new FormControl(''),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl(),
      leaveTypeId: new FormControl('', [Validators.required]),
      note: new FormControl('', [Validators.required]),
      acceptedBy: new FormControl(''),
      acceptedAt: new FormControl(null),
      approvedBy: new FormControl(''),
      approvedAt: new FormControl(null),
      rejected: new FormControl(null),
      status: new FormControl(null),
    });
  }
  confirmationDialog(action: string) {
    this.dialog = true;
    this.selectedAction = action;
  }
  approveleave() {
    const acceptedBy = this.jwtService.GivenName;
    const approvedBy = this.jwtService.GivenName;
    for (const empLeave of this.leaves) {
      this.fbLeave.patchValue({
        employeeLeaveId: empLeave.employeeLeaveId,
        employeeId: empLeave.employeeId,
        employeeName: empLeave.employeeName,
        code: empLeave.code,
        fromDate: FORMAT_DATE(new Date(empLeave.fromDate)),
        toDate: empLeave.toDate ? FORMAT_DATE(new Date(empLeave.toDate)) : null,
        leaveTypeId: empLeave.leaveTypeId,
        note: empLeave.note,
        acceptedBy: acceptedBy,
        acceptedAt: empLeave.acceptedAt ? FORMAT_DATE(new Date(empLeave.acceptedAt)) : null,
        approvedBy: approvedBy,
        approvedAt: empLeave.approvedAt ? FORMAT_DATE(new Date(empLeave.approvedAt)) : null,
        rejected: false,
        status: empLeave.status,
        createdBy: empLeave.createdBy
      });
      console.log(this.fbLeave.value);
    }
    this.onSubmit();
    this.dialog =false;
  }

  rejectedLeave() {
    for (const empLeave of this.leaves) {
      this.fbLeave.patchValue({
        employeeLeaveId: empLeave.employeeLeaveId,
        employeeId: empLeave.employeeId,
        employeeName: empLeave.employeeName,
        code: empLeave.code,
        fromDate: FORMAT_DATE(new Date(empLeave.fromDate)),
        toDate: empLeave.toDate ? FORMAT_DATE(new Date(empLeave.toDate)) : null,
        leaveTypeId: empLeave.leaveTypeId,
        note: empLeave.note,
        acceptedBy: empLeave.acceptedBy,
        acceptedAt: empLeave.acceptedAt ? FORMAT_DATE(new Date(empLeave.acceptedAt)) : null,
        approvedBy: empLeave.approvedBy,
        approvedAt: empLeave.approvedAt ? FORMAT_DATE(new Date(empLeave.approvedAt)) : null,
        rejected: true,
        status: empLeave.status,
        createdBy: empLeave.createdBy
      });
    }
    console.log(this.fbLeave.value)
    this.onSubmit();
    this.dialog =false;
  }

  onYesButtonClick() {
    if (this.selectedAction === 'approve') {
      this.approveleave();
    } else if (this.selectedAction === 'reject') {
      this.rejectedLeave();
    }
  }

  save(): Observable<HttpEvent<EmployeeLeaveDto[]>> {
    return this.employeeService.CreateEmployeeLeaveDetails(this.fbLeave.value)
  }

  onSubmit() {
    this.save().subscribe(resp => { })
    console.log(this.fbLeave.value);
  }

  openComponentDialog(content: any,
    dialogData, action: Actions = this.ActionTypes.add) {
    if (action == Actions.save && content === this.leaveDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Leave";
      this.dialogRequest.width = "70%";
    }
    this.ref = this.dialogService.open(content, {
      data: this.dialogRequest.dialogData,
      header: this.dialogRequest.header,
      width: this.dialogRequest.width
    });
    this.ref.onClose.subscribe((res: any) => {
      if (res) this.getLeaves();
      event.preventDefault(); // Prevent the default form submission
    });
  }

}
