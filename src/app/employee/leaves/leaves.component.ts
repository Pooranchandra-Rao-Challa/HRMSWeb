import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { LeaveDto } from 'src/app/_models/employes';
import { SecurityService } from 'src/app/demo/service/security.service';
import { LeaveDialogComponent } from 'src/app/_dialogs/leave.dialog/leave.dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

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
  ActionTypes = Actions;
  leaveDialogComponent = LeaveDialogComponent;
  dialogRequest: DialogRequest = new DialogRequest();


  headers: ITableHeader[] = [
    {field:'employeeId',header:'employeeId',label:'Employee Name'},
    { field: 'leaveTypeId', header: 'leaveTypeId', label: 'Leave Type' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'note', header: 'note', label: 'Leave Description' },
    { field: 'acceptedBy', header: 'acceptedBy', label: 'Accepted By' },
    { field: 'acceptedAt', header: 'acceptedAt', label: 'Accepted At' },
    { field: 'approvedBy', header: 'approvedBy', label: 'Approved By' },
    { field: 'approvedAt', header: 'approvedAt', label: 'Approved At' },
    { field: 'rejected', header: 'rejected', label: 'Status' },
  ];

  constructor(
    private globalFilterService: GlobalFilterService,
    private securityService: SecurityService,
    private dialogService: DialogService,
    public ref: DynamicDialogRef) { }

  ngOnInit(): void {
    this.getLeaves();
  }
  
  getLeaves() {
    this.securityService.getleaves().then(resp => {
      this.leaves = resp;
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
