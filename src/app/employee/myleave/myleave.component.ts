
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Actions, ConfirmationRequest, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { EmployeeLeaveDetailsDto, EmployeeLeaveDto } from 'src/app/_models/employes';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtService } from 'src/app/_services/jwt.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { NgPluralCase } from '@angular/common';
import { LeaveConfirmationService } from 'src/app/_services/leaveconfirmation.service';
import { EmployeeLeaveDialogComponent } from 'src/app/_dialogs/employeeleave.dialog/employeeleave.dialog.component';
import { ConfirmationDialogService } from 'src/app/_alerts/confirmationdialog.service';

@Component({
  selector: 'app-myleave',
  templateUrl: './myleave.component.html',
  styles: [
  ]
})
export class MyleaveComponent {
  globalFilterFields: string[] = ['employeeName', 'leaveType', 'fromDate', 'toDate', 'note', 'acceptedBy', 'acceptedAt', 'approvedBy']
  @ViewChild('filter') filter!: ElementRef;
  mediumDate: string = MEDIUM_DATE
  permissions: any;
  leaves: EmployeeLeaveDto[] = [];
  year: number = new Date().getFullYear();
  confirmationRequest: ConfirmationRequest = new ConfirmationRequest();
  selectedColumnHeader!: ITableHeader[];
  _selectedColumns!: ITableHeader[];
  selectedStatus: any;
  ActionTypes = Actions;
  employeeleaveDialogComponent = EmployeeLeaveDialogComponent;
  dialogRequest: DialogRequest = new DialogRequest();

  statuses: any[] = [
    { name: 'Pending', key: 'P' },
    { name: 'Accepted', key: 'A' },
    { name: 'Approved', key: 'Ap' },
    { name: 'Rejected', key: 'R' }
  ];

  headers: ITableHeader[] = [
    // { field: 'status', header: 'status', label: 'Status' },
    { field: 'leaveType', header: 'leaveType', label: 'Leave Type' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'isHalfDayLeave', header: 'isHalfDayLeave', label: 'Half Day Leave' },
    { field: 'isDeleted', header: 'isDeleted', label: 'Deleted' },
    { field: 'acceptedAt', header: 'acceptedAt', label: 'Accepted At' },
    { field: 'approvedAt', header: 'approvedAt', label: 'Approved At' },
  ];

  constructor(
    private globalFilterService: GlobalFilterService,
    private employeeService: EmployeeService,
    public ref: DynamicDialogRef,
    private jwtService: JwtService,
    public alertMessage: AlertmessageService,
    private dialogService: DialogService,
    private confirmationDialogService: ConfirmationDialogService) {

  }
  set selectedColumns(val: any[]) {
    this._selectedColumns = this.selectedColumnHeader.filter((col) => val.includes(col));
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.selectedStatus = this.statuses[0];
    this.getLeaves();
    this._selectedColumns = this.selectedColumnHeader;
    this.selectedColumnHeader = [
      { field: 'note', header: 'note', label: 'Leave Description' },
      { field: 'acceptedBy', header: 'acceptedBy', label: 'Accepted By' },
      { field: 'approvedBy', header: 'approvedBy', label: 'Approved By' },
      { field: 'rejectedBy', header: 'rejectedBy', label: 'Rejected By' },
      { field: 'rejectedAt', header: 'rejectedAt', label: 'Rejected At' },
      { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    ];
  }

  getLeaves() {
    this.employeeService.getMyLeaves(this.jwtService.EmployeeId, this.year).subscribe((resp) => {
      this.leaves = resp as unknown as EmployeeLeaveDto[];      
      this.leaves = this.leaves.filter(leave => leave.status === this.selectedStatus.name);
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.globalFilterService.filterTableByDate(table, searchTerm);
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
    this.selectedColumns = [];
  }

  deleteleaveDetails(employeeLeaveId) {
    this.confirmationDialogService.comfirmationDialog(this.confirmationRequest).subscribe(userChoice => {
      if (userChoice) {
        this.employeeService.DeleteleaveDetails(employeeLeaveId).subscribe((resp) => {
          if (resp) {
            this.alertMessage.displayAlertMessage(ALERT_CODES["ELA003"]);
            this.getLeaves();
          }
          else {
            this.alertMessage.displayErrorMessage(ALERT_CODES["ELA004"]);
          }
        })
      }
    });
  }

  
  openComponentDialog(content: any,
    dialogData, action: Actions = this.ActionTypes.add) {
    if (action == Actions.save && content === this.employeeleaveDialogComponent) {
        this.dialogRequest.dialogData = dialogData;
        this.dialogRequest.header = "Leave";
        this.dialogRequest.width = "60%";
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
