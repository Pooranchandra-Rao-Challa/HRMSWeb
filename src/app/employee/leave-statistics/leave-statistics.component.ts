import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { EmployeeLeaveDialogComponent } from 'src/app/_dialogs/employeeleave.dialog/employeeleave.dialog.component';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { EmployeeLeaveDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';

@Component({
  selector: 'app-leave-statistics',
  templateUrl: './leave-statistics.component.html',
  styles: [
  ]
})
export class LeaveStatisticsComponent {
  globalFilterFields: string[] = ['employeeName', 'leaveType', 'fromDate', 'toDate', 'note', 'acceptedBy'];
  @ViewChild('filter') filter!: ElementRef;
  leaves: EmployeeLeaveDto[]=[];
  ActionTypes = Actions;
  employeeleaveDialogComponent = EmployeeLeaveDialogComponent;
  dialogRequest: DialogRequest = new DialogRequest();
  
  headers: ITableHeader[] = [
    { field: 'employeeName', header: 'employeeName', label: 'Employee Name' },
    { field: 'leaveType', header: 'leaveType', label: 'Leave Type' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'note', header: 'note', label: 'Leave Description' },
    { field: 'acceptedBy', header: 'acceptedBy', label: 'Accepted By' }
  ];

   constructor(
    private globalFilterService: GlobalFilterService,
    private employeeService: EmployeeService,
    private dialogService: DialogService,
    public ref: DynamicDialogRef,
    private formbuilder: FormBuilder,) {

  }

  ngOnInit(): void {
    this.getLeaves();
  }
  
  onGlobalFilter(table: Table, event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.globalFilterService.filterTableByDate(table, searchTerm);
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  getLeaves() {
    this.employeeService.getEmployeeLeaveDetails().subscribe((resp) => {
      this.leaves = resp as unknown as EmployeeLeaveDto[];
      
    })
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
