import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { EmployeeLeaveDialogComponent } from 'src/app/_dialogs/employeeleave.dialog/employeeleave.dialog.component';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { EmployeeLeaveDto, LeaveStatistics } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { ReportService } from 'src/app/_services/report.service';
import * as FileSaver from "file-saver";
import { JwtService } from 'src/app/_services/jwt.service';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';

enum LeavesReportType {
  CompleteLeavesReport = 'Complete Leaves Report',
  AsOnDateLeavesReport = 'As On Date Leaves Report'
}


@Component({
  selector: 'app-leave-statistics',
  templateUrl: './leave-statistics.component.html',
  styles: [
  ]
})
export class LeaveStatisticsComponent {
  globalFilterFields: string[] = ['name', 'experienceInCompany', 'dateofJoin', 'reportingTo', 'allottedCasualLeaves', 'allottedPrivilegeLeaves',
    'usedCasualLeavesInYear', 'usedCasualLeavesInMonth', 'usedPrivilegeLeavesInYear', 'usedPrivilegeLeavesInMonth', 'usedLWPInYear',
    'usedLWPInMonth', 'previousYearPrivilegeLeaves', 'absentsInYear', 'absentsInMonth'];
  @ViewChild('filter') filter!: ElementRef;
  leavesStatistics: LeaveStatistics[] = [];
  ActionTypes = Actions;
  employeeleaveDialogComponent = EmployeeLeaveDialogComponent;
  dialogRequest: DialogRequest = new DialogRequest();
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  days: number[] = [];
  mediumDate: string = MEDIUM_DATE;
  selectedMonth: Date;
  permissions: any;
  value: number;
  computedCLs: number[];
  computedPLs: number[];
  leaveReportTypes:any[];

  headers: ITableHeader[] = [
    { field: 'name', header: 'name', label: 'Employee Name' },
    { field: 'experienceInCompany', header: 'experienceInCompany', label: 'Exp In Company' },
    { field: 'dateofJoin', header: 'dateofJoin', label: 'DOJ' },
    { field: 'reportingTo', header: 'reportingTo', label: 'Reporting To' },
    { field: 'allottedCasualLeaves', header: 'allottedCasualLeaves', label: 'Allotted CL' },
    { field: 'allottedPrivilegeLeaves', header: 'allottedPrivilegeLeaves', label: 'Allotted PL' },
    { field: 'usedCasualLeavesInYear', header: 'usedCasualLeavesInYear', label: 'Used CL(Year)' },
    { field: 'usedCasualLeavesInMonth', header: 'usedCasualLeavesInMonth', label: 'Used CL(Month)' },
    { field: 'usedPrivilegeLeavesInYear', header: 'usedPrivilegeLeavesInYear', label: 'Used PL(Year)' },
    { field: 'usedPrivilegeLeavesInMonth', header: 'usedPrivilegeLeavesInMonth', label: 'Used PL(Month)' },
    { field: 'usedLWPInYear', header: 'usedLWPInYear', label: 'Used LWP(Year)' },
    { field: 'usedLWPInMonth', header: 'usedLWPInMonth', label: 'Used LWP(Month)' },
    { field: 'previousYearPrivilegeLeaves', header: 'previousYearPrivilegeLeaves', label: 'Previous PL(Year)' },
    { field: 'absentsInYear', header: 'absentsInYear', label: 'Absent(Year)' },
    { field: 'absentsInMonth', header: 'absentsInMonth', label: 'Absent(Month)' },
    { field: 'workingFromHome', header: 'workingFromHome', label: 'WFH(Month)' },
    { field: 'availableCLs', header: 'availableCLs', label: 'Available CLs' },
    { field: 'availablePLs', header: 'availablePLs', label: 'Available PLs' },
  ];
  constructor(
    private globalFilterService: GlobalFilterService,
    private employeeService: EmployeeService,
    private dialogService: DialogService,
    public ref: DynamicDialogRef,
    private reportService: ReportService,
    private jwtService: JwtService
  ) {

  }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.getLeaves();
    this.getLeavesReportTypeOptions();
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
    this.employeeService.getLeaveStatistics(this.year).subscribe((resp) => {
      this.leavesStatistics = resp as unknown as LeaveStatistics[];
      this.availableLeaves();
    })
  }

  availableLeaves() {
    this.computedCLs = this.leavesStatistics.map(leave => leave.allottedCasualLeaves - leave.usedCasualLeavesInYear);
    this.computedPLs = this.leavesStatistics.map(leave =>
      leave.allottedPrivilegeLeaves + leave.previousYearPrivilegeLeaves - leave.usedPrivilegeLeavesInYear
    );
    this.leavesStatistics.forEach((item, index) => {
      item.availableCLs = this.computedCLs[index];
      item.availablePLs = this.computedPLs[index];
    });
  }

  onYearSelect(event) {
    this.year = this.selectedMonth.getFullYear();
    this.getLeaves();
  }

  gotoPreviousYear() {
    this.year--;
    this.getLeaves();
  }

  gotoNextYear() {
    this.year++;
    this.getLeaves();
  }

  downloadLeavesReport() {
    this.reportService.DownloadLeaves(this.year)
      .subscribe((resp) => {
        if (resp.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * resp.loaded / resp.total);
          this.value = percentDone;
        }
        if (resp.type === HttpEventType.Response) {
          const file = new Blob([resp.body], { type: 'text/csv' });
          const document = window.URL.createObjectURL(file);
          FileSaver.saveAs(document, "Leaves Statistics Report.csv");
        }
      })
  }

  downloadLeavesAsOnDate(){
    this.reportService.DownloadLeavesAsOnDate()
    .subscribe((resp) => {
      if (resp.type === HttpEventType.DownloadProgress) {
        const percentDone = Math.round(100 * resp.loaded / resp.total);
        this.value = percentDone;
      }
      if (resp.type === HttpEventType.Response) {
        const file = new Blob([resp.body], { type: 'text/csv' });
        const document = window.URL.createObjectURL(file);
        FileSaver.saveAs(document, "Leaves Statistics Report As On Date.csv");
      }
    })
  }

  DownloadLeavesReports(name: string) {
    if (name == LeavesReportType.CompleteLeavesReport)
      this.downloadLeavesReport();
    else if (name == LeavesReportType.AsOnDateLeavesReport)
      this.downloadLeavesAsOnDate();
  }

  getLeavesReportTypeOptions() {
    this.leaveReportTypes = [];
    for (const key in LeavesReportType) {
      if (LeavesReportType.hasOwnProperty(key)) {
        this.leaveReportTypes.push({ label: LeavesReportType[key], value: key });
      }
    }
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
