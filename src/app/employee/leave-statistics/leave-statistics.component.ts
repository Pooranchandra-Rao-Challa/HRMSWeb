import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
import { DATE_OF_JOINING, FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { LeavestatisticsDialogComponent } from 'src/app/_dialogs/leavestatistics.dialog/leavestatistics.dialog.component';
import { Router } from '@angular/router';
import { PrimeNGConfig, MenuItem } from 'primeng/api';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatePipe } from '@angular/common';

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
  items: MenuItem[] | undefined;
  globalFilterFields: string[] = ['name', 'experienceInCompany', 'dateofJoin', 'reportingTo', 'allottedCasualLeaves', 'allottedPrivilegeLeaves',
    'usedCasualLeavesInYear', 'usedCasualLeavesInMonth', 'usedPrivilegeLeavesInYear', 'usedPrivilegeLeavesInMonth', 'usedLWPInYear',
    'usedLWPInMonth', 'previousYearPrivilegeLeaves', 'absentsInYear', 'absentsInMonth'];
  @ViewChild('filter') filter!: ElementRef;
  leavesStatistics: LeaveStatistics[] = [];
  ActionTypes = Actions;
  leavestatisticsDialogComponent = LeavestatisticsDialogComponent;
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
  addDialog: boolean = false;
  leaveReportTypes: any[];
  selectedColumnHeader!: ITableHeader[];
  _selectedColumns!: ITableHeader[];
  // items: any[];

  headers: ITableHeader[] = [
    { field: 'name', header: 'name', label: 'Employee Name' },
    { field: 'experienceInCompany', header: 'experienceInCompany', label: 'Exp In Company' },
    { field: 'dateofJoin', header: 'dateofJoin', label: 'DOJ' },
    { field: 'reportingTo', header: 'reportingTo', label: 'Reporting To' },
    { field: 'previousYearPrivilegeLeaves', header: 'previousYearPrivilegeLeaves', label: 'Carry Forward PLs' },
    { field: 'allottedCasualLeaves', header: 'allottedCasualLeaves', label: 'Allocated CL' },
    { field: 'allottedPrivilegeLeaves', header: 'allottedPrivilegeLeaves', label: 'Allocated PL' },
    { field: 'availableCLs', header: 'availableCLs', label: 'Available CLs' },
    { field: 'availablePLs', header: 'availablePLs', label: 'Available PLs' },
    { field: 'usedCasualLeavesInYear', header: 'usedCasualLeavesInYear', label: 'Used CL(Year)' },
    { field: 'usedPrivilegeLeavesInYear', header: 'usedPrivilegeLeavesInYear', label: 'Used PL(Year)' },
    { field: 'usedLWPInYear', header: 'usedLWPInYear', label: 'Used LWP(Year)' },
    { field: 'workingFromHomeInYear', header: 'workingFromHomeInYear', label: ' Used WFH(Year)' }
  ];

  constructor(
    private globalFilterService: GlobalFilterService,
    private employeeService: EmployeeService,
    private dialogService: DialogService,
    public ref: DynamicDialogRef,
    private reportService: ReportService,
    private jwtService: JwtService,
    private router: Router,
    private datePipe: DatePipe,
    private primengConfig: PrimeNGConfig
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.items = [
      {
        label: 'Complete Leaves Report',
        command: () => {
          this.generatePdf();
        }
      },
      {
        label: 'As On Date Leaves Report',
        command: () => {
          this.generatePdf();
        }
      },
    ];
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.selectedColumnHeader.filter((col) => val.includes(col));
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.permissions = this.jwtService.Permissions;
    this.getLeaves();
    this.getLeavesReportTypeOptions();
    this._selectedColumns = this.selectedColumnHeader;
    this.selectedColumnHeader = [
      { field: 'usedCasualLeavesInMonth', header: 'usedCasualLeavesInMonth', label: 'Used CL(Month)' },
      { field: 'usedPrivilegeLeavesInMonth', header: 'usedPrivilegeLeavesInMonth', label: 'Used PL(Month)' },
      { field: 'usedLWPInMonth', header: 'usedLWPInMonth', label: 'Used LWP(Month)' },
      { field: 'workingFromHomeInMonth', header: 'workingFromHomeInMonth', label: 'Used WFH(Month)' },
      { field: 'absentsInYear', header: 'absentsInYear', label: 'Absent(Year)' },
      { field: 'absentsInMonth', header: 'absentsInMonth', label: 'Absent(Month)' },
    ];
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



  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/jpg");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  async formatKeyAndValues() {
    try {
      const headerImage1 = await this.getBase64ImageFromURL('../../assets/layout/images/Calibrage_logo1.png');
      const headerImage2 = await this.getBase64ImageFromURL('../../assets/layout/images/head_right.PNG');
      const pageWidth = 841.89;
      const imageWidth = (pageWidth / 4) - 10;
      const createLine = () => [{ type: 'line', x1: 0, y1: 0, x2: 689.85, y2: 0, lineWidth: 0.5, lineColor: '#f3743f' }];

      let row = {
        columns: [
          {
            image: headerImage1,
            width: imageWidth,
            alignment: 'left',
            margin: [0, 0, 0, 0] // Remove any margins
          },
          {
            width: '*',
            text: '', // Empty spacer column
            alignment: 'center' // Remove any margins
          },
          {
            image: headerImage2,
            width: imageWidth,
            alignment: 'right',
            margin: [0, 0, 0, 0] // Remove any margins
          },
        ],
        alignment: 'justify',
        margin: [0, 0, 0, 0] // Remove any margins
      };

      // Add canvas element
      const line = { canvas: createLine(), margin: [0, -10, 0, 10], color: '#f3743f' };
      const content = [row]; // Array containing both row and line objects

      return content;
    } catch (error) {
      console.error("Error occurred while formatting key and values:", error);
      throw error; // Propagate the error
    }
  }


  async generatePdf() {
    const pageSize = { width: 841.89, height: 600 };
    const waterMark = await this.getBase64ImageFromURL('../../assets/layout/images/transparent_logo.png');

    const currentDate = new Date().toLocaleString().replace(/[/\\?%*:|"<>.]/g, '.');
    const check = await this.getBase64ImageFromURL('assets/layout/images/check.jpg');
    const cancle = await this.getBase64ImageFromURL('assets/layout/images/cancle.jpg');
    const header = await this.formatKeyAndValues();
    console.log(this.leavesStatistics);

    const createFooter = (currentPage: number) => ({
      margin: [0, 0, 0, 0],
      height: 20,
      background: '#fff',
      color: '#fff',
      width: 841.89,
      columns: [
        { canvas: [{ type: 'rect', x: 0, y: 0, w: 841.89, h: 20, color: '#ff810e' }] },
        {
          text: [
            { text: `${currentPage}` }],
          absolutePosition: { x: 5, y: 5 }, // Adjust the position as needed
          alignment: 'center',
          color: '#000000',
        }
      ],
    });
    const docDefinition = {
      pageOrientation: 'landscape',
      pageMargins: [30, 90, 40, 20],
      header: () => (header),
      footer: createFooter,
      background: [{
        image: waterMark,
        absolutePosition: { x: (pageSize.width - 200) / 2, y: (pageSize.height - 200) / 2 },
      }],
      content: [
        {
          text: 'Leave Statistics',
          bold: true,
          alignment: 'center',
          color: '#ff810e',
          style: 'header',
        },
        {
          table: {
            // widths: [54, 100, 47, 47, 47, 56, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47],
            headerRows: 2,
            body: [
              [
                { text: 'Employee ID', style: 'tableHeader', rowSpan: 2 },
                { text: 'Employee Name', style: 'tableHeader', rowSpan: 2 },
                { text: 'Date OfJoining', style: 'tableHeader', rowSpan: 2 },
                { text: 'Designation', style: 'tableHeader', rowSpan: 2 },
                { text: 'Office EmailId', style: 'tableHeader', rowSpan: 2 },
                { text: 'Reporting To', style: 'tableHeader', rowSpan: 2 },
                { text: 'Experience In Company', style: 'tableHeader', rowSpan: 2 },
                { text: 'Allocated CLs', style: 'tableHeader', rowSpan: 2 },
                { text: 'Used CLs', colSpan: 2, style: 'tableHeader' },
                {},
                { text: 'Allocated PLs', style: 'tableHeader', rowSpan: 2 },
                { text: 'Carry Forwarded Pls', style: 'tableHeader', rowSpan: 2 },
                { text: 'Used PLs', colSpan: 2, style: 'tableHeader' },
                {},
                { text: 'Absent', colSpan: 2, style: 'tableHeader' },
                {},
                { text: 'Used lwp', colSpan: 2, style: 'tableHeader' },
                {}
              ],
              [
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                { text: 'Year', style: 'tableHeader' },
                { text: 'Month', style: 'tableHeader' },
                {},
                {},
                { text: 'Year', style: 'tableHeader' },
                { text: 'Month', style: 'tableHeader' },
                { text: 'Year', style: 'tableHeader' },
                { text: 'Year', style: 'tableHeader' },
                { text: 'Year', style: 'tableHeader' },
                { text: 'Month', style: 'tableHeader' }
              ],
              ...this.leavesStatistics.map(leave => [
                leave.code,
                leave.name,
                this.datePipe.transform(leave.dateofJoin, DATE_OF_JOINING),
                leave.designation,
                leave.officeEmailId,
                leave.reportingTo,
                leave.experienceInCompany,
                leave.allottedCasualLeaves,
                leave.usedCasualLeavesInYear,
                leave.usedCasualLeavesInMonth,
                leave.allottedPrivilegeLeaves,
                leave.previousYearPrivilegeLeaves,
                leave.usedPrivilegeLeavesInYear,
                leave.usedPrivilegeLeavesInMonth,
                leave.absentsInYear,
                leave.absentsInMonth,
                leave.usedLWPInYear,
                leave.usedLWPInMonth
              ])
            ]
          },
        },
      ],
      styles: {
        header: { fontSize: 24 },
        // color: '#ff810e',
        defaultStyle: { font: 'Typography', fontSize: 12 },
        tableHeader: { bold: true, fillColor: '#dbd7d7', alignment: 'center' },
      },
    };
    const pdfName = `Leave Statistics Report${currentDate}.pdf`;
    pdfMake.createPdf(docDefinition).download(pdfName);
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
          const currentDate = new Date().toLocaleString().replace(/[/\\?%*:|"<>.]/g, '-');
          const csvName = `Leaves Statistics Report${currentDate}.csv`;
          FileSaver.saveAs(document, csvName);
        }
      })
  }

  downloadLeavesAsOnDate() {
    this.reportService.DownloadLeavesAsOnDate()
      .subscribe((resp) => {
        if (resp.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * resp.loaded / resp.total);
          this.value = percentDone;
        }
        if (resp.type === HttpEventType.Response) {
          const file = new Blob([resp.body], { type: 'text/csv' });
          const document = window.URL.createObjectURL(file);
          const currentDate = new Date().toLocaleString().replace(/[/\\?%*:|"<>.]/g, '-');
          const csvName = `Leaves Statistics Report As On Date${currentDate}.csv`;
          FileSaver.saveAs(document, csvName);
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

  DownloadLeavesPdf(name: string) {
    if (name == LeavesReportType.CompleteLeavesReport)
      this.downloadLeavesReport();
    else if (name == LeavesReportType.AsOnDateLeavesReport)
      this.downloadLeavesAsOnDate();
  }

  openComponentDialog(content: any,
    dialogData, action: Actions = this.ActionTypes.save) {
    if (this.year != (new Date().getFullYear())) {
      this.addDialog = true;
    } else {
      if (action == Actions.save && content === this.leavestatisticsDialogComponent) {
        this.dialogRequest.dialogData = dialogData;
        this.dialogRequest.header = "Leave Statistics";
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
}
