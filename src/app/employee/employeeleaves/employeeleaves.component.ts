import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Actions, ConfirmationRequest, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { EmployeeLeaveDto } from 'src/app/_models/employes';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtService } from 'src/app/_services/jwt.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { Observable } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { DATE_OF_JOINING, FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { DatePipe, NgPluralCase } from '@angular/common';
import { LeaveConfirmationService } from 'src/app/_services/leaveconfirmation.service';
import { EmployeeLeaveDialogComponent } from 'src/app/_dialogs/employeeleave.dialog/employeeleave.dialog.component';
import { ReportService } from 'src/app/_services/report.service';
import * as FileSaver from "file-saver";
import { ConfirmationDialogService } from 'src/app/_alerts/confirmationdialog.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Router } from '@angular/router';
@Component({
  selector: 'app-employeeleaves',
  templateUrl: './employeeleaves.component.html',
  styles: [
  ]
})
export class EmployeeLeavesComponent {
  globalFilterFields: string[] = ['employeeName', 'leaveType', 'fromDate', 'toDate', 'note', 'acceptedBy', 'acceptedAt', 'approvedBy']
  @ViewChild('filter') filter!: ElementRef;
  ActionTypes = Actions;
  employeeleaveDialogComponent = EmployeeLeaveDialogComponent;
  dialogRequest: DialogRequest = new DialogRequest();
  fbLeave: FormGroup;
  leaves: EmployeeLeaveDto[] = [];
  leaveTypes: LookupDetailsDto[] = [];
  filteredLeaveTypes: LookupViewDto[] = [];
  leaveTypeMap: { [key: number]: string } = {};
  mediumDate: string = MEDIUM_DATE
  dialog: boolean = false;
  selectedAction: string | null = null;
  leaveData: EmployeeLeaveDto;
  permissions: any;
  buttonLabel: string;
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  selectedColumnHeader!: ITableHeader[];
  _selectedColumns!: ITableHeader[];
  days: number[] = [];
  selectedMonth: Date;
  confirmationRequest: ConfirmationRequest = new ConfirmationRequest();
  selectedStatus: any;
  value: number;
  employeeRole: any;
  currentRoute: any;

  statuses: any[] = [
    { name: 'Pending', key: 'P' },
    { name: 'Accepted', key: 'A' },
    { name: 'Approved', key: 'Ap' },
    { name: 'Rejected', key: 'R' }
  ];

  headers: ITableHeader[] = [
    { field: 'employeeName', header: 'employeeName', label: 'Employee Name' },
    { field: 'leaveType', header: 'leaveType', label: 'Leave Type' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'note', header: 'note', label: 'Leave Description' },
    { field: 'isHalfDayLeave', header: 'isHalfDayLeave', label: 'Half Day Leave' },
    { field: 'acceptedAt', header: 'acceptedAt', label: 'Accepted At' },
    { field: 'approvedAt', header: 'approvedAt', label: 'Approved At' },
  ];

  constructor(
    private globalFilterService: GlobalFilterService,
    private employeeService: EmployeeService,
    private dialogService: DialogService,
    private reportService: ReportService,
    public ref: DynamicDialogRef,
    private formbuilder: FormBuilder,
    private jwtService: JwtService,
    public alertMessage: AlertmessageService,
    private leaveConfirmationService: LeaveConfirmationService,
    private datePipe: DatePipe,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService) {
    this.selectedMonth = FORMAT_DATE(new Date(this.year, this.month - 1, 1));
    this.selectedMonth.setHours(0, 0, 0, 0);
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.selectedColumnHeader.filter((col) => val.includes(col));
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.employeeRole = this.jwtService.EmployeeRole;
    this.selectedStatus = this.statuses[0];
    this.getLeaves();
    this.getDaysInMonth(this.year, this.month);
    this.leaveForm();
    this._selectedColumns = this.selectedColumnHeader;
    this.selectedColumnHeader = [
      { field: 'acceptedBy', header: 'acceptedBy', label: 'Accepted By' },
      { field: 'approvedBy', header: 'approvedBy', label: 'Approved By' },
      { field: 'rejectedBy', header: 'rejectedBy', label: 'Rejected By' },
      { field: 'rejectedAt', header: 'rejectedAt', label: 'Rejected At' },
      { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    ];
  }

  getLeaves() {
    this.employeeService.getEmployeeLeaveDetails(this.month, this.year, this.jwtService.EmployeeId).subscribe((resp) => {
      this.leaves = resp as unknown as EmployeeLeaveDto[];
      this.leaves = this.leaves.filter(leave => leave.status === this.selectedStatus.name);

      
    });
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

  leaveForm() {
    this.fbLeave = this.formbuilder.group({
      employeeLeaveId: [null],
      employeeId: new FormControl('', [Validators.required]),
      employeeName: new FormControl(''),
      code: new FormControl(''),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl(),
      leaveTypeId: new FormControl('', [Validators.required]),
      isHalfDayLeave: new FormControl(''),
      note: new FormControl('', [Validators.required]),
      acceptedBy: new FormControl(''),
      acceptedAt: new FormControl(null),
      approvedBy: new FormControl(''),
      approvedAt: new FormControl(null),
      createdBy: new FormControl(''),
      rejected: new FormControl(''),
      comments: new FormControl(''),
      status: new FormControl(''),
      isapprovalEscalated: new FormControl(NgPluralCase)
    });
  }

  gotoPreviousMonth() {
    if (this.month > 1)
      this.month--;
    else {
      this.month = 12;        // Reset to December
      this.year--;            // Decrement the year
    }
    this.selectedMonth = FORMAT_DATE(new Date(this.year, this.month - 1, 1));
    this.selectedMonth.setHours(0, 0, 0, 0);
    this.getDaysInMonth(this.year, this.month);
    this.getLeaves();
  }
  gotoNextMonth() {
    if (this.month < 12)
      this.month++;
    else {
      this.month = 1; // Reset to January
      this.year++;    // Increment the year
    }
    this.selectedMonth = FORMAT_DATE(new Date(this.year, this.month - 1, 1));
    this.selectedMonth.setHours(0, 0, 0, 0);
    this.getDaysInMonth(this.year, this.month);
    this.getLeaves();
  }

  onMonthSelect(event) {
    this.month = this.selectedMonth.getMonth() + 1; // Month is zero-indexed
    this.year = this.selectedMonth.getFullYear();
    this.getDaysInMonth(this.year, this.month);
    this.getLeaves();
  }

  getDaysInMonth(year: number, month: number) {
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + 1);
    date.setDate(date.getDate() - 1);
    let day = date.getDate();
    this.days = [];
    for (let i = 1; i <= day; i++) {
      this.days.push(i);
    }
  }

  openSweetAlert(title: string, leaves: EmployeeLeaveDto, currentRoute) {
    const buttonLabel = title === 'Reason For Approve' ? 'Approve' : (title === 'Reason For Accept' ? 'Accept' : 'Reject')
    this.leaveConfirmationService.openDialogWithInput(title, buttonLabel, currentRoute).subscribe((result) => {
      if (result && result.description !== undefined) {
        this.leaveData = leaves;
        this.selectedAction = title;
        const currentDate = FORMAT_DATE(new Date());
        const acceptedBy = this.selectedAction === 'Reason For Approve' ? this.jwtService.EmployeeId : (this.selectedAction === 'Reason For Accept' ? this.jwtService.EmployeeId : this.jwtService.EmployeeId);
        const approvedAt = this.selectedAction === 'Reason For Approve' ? currentDate : (this.selectedAction === 'Reason For Accept' ? null : null);
        const approvedBy = this.selectedAction === 'Reason For Approve' ? this.jwtService.EmployeeId : null;
        this.fbLeave.patchValue({
          employeeLeaveId: this.leaveData.employeeLeaveId,
          employeeId: this.leaveData.employeeId,
          employeeName: this.leaveData.employeeName,
          code: this.leaveData.code,
          fromDate: this.leaveData.fromDate ? FORMAT_DATE(new Date(this.leaveData.fromDate)) : null,
          toDate: this.leaveData.toDate ? FORMAT_DATE(new Date(this.leaveData.toDate)) : null,
          leaveTypeId: this.leaveData.leaveTypeId,
          isHalfDayLeave: this.leaveData.isHalfDayLeave,
          note: this.leaveData.note,
          acceptedBy: acceptedBy,
          acceptedAt: this.selectedAction === 'Reason For Accept' ? currentDate : (this.leaveData.acceptedAt ? FORMAT_DATE(new Date(this.leaveData.acceptedAt)) : currentDate),
          approvedBy: this.selectedAction === 'Reason For Accept' ? null : approvedBy,
          approvedAt: approvedAt,
          rejected: this.selectedAction === 'Reason For Approve' ? false : (this.selectedAction === 'Reason For Accept' ? false : true),
          comments: result.description,
          status: this.leaveData.status,
          isapprovalEscalated: true,
        });
      }
      this.save().subscribe(resp => {
        if (resp) {
          this.dialog = false;
          this.getLeaves();
          if (this.selectedAction === 'Reason For Approve') {
            this.alertMessage.displayAlertMessage(ALERT_CODES["ELA001"]);
          } else if (this.selectedAction === 'Reason For Accept') {
            this.alertMessage.displayAlertMessage(ALERT_CODES["ELA005"]);
          } else {
            this.alertMessage.displayMessageforLeave(ALERT_CODES["ELR002"]);
          }
        }
      });
    });
  }

  onClose() {
    this.dialog = false;
  }

  save(): Observable<HttpEvent<EmployeeLeaveDto[]>> {
    return this.employeeService.UpdateEmployeeLeaveDetails(this.fbLeave.value);
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


  async generatePdf(data: any) {
    const pageSize = { width: 841.89, height: 600 };
    const waterMark = await this.getBase64ImageFromURL('../../assets/layout/images/transparent_logo.png');

    const currentDate = new Date().toLocaleString().replace(/[/\\?%*:|"<>.]/g, '.');
    const check = await this.getBase64ImageFromURL('assets/layout/images/check.jpg');
    const cancle = await this.getBase64ImageFromURL('assets/layout/images/cancle.jpg');
    const header = await this.formatKeyAndValues();
    const createFooter = (currentPage: number) => ({
      margin: [0, 0, 0, 0],
      height: 20,
      background: '#fff',
      color: '#fff',
      width:841.89,
      columns: [
        { canvas: [{ type: 'rect', x: 0, y: 0, w:841.89, h: 20, color: '#ff810e' }] },
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
          text: 'Employee Leaves',
          bold: true,
          alignment: 'center',
          style: 'header',
        },
        {
          table: {
            widths: [54, 100, 47, 47, 47, 56, 47, 47, 47, 47, 47, 47, 47],
            headerRows: 1,
            body: [
              [
                { text: 'Employee ID', style: 'tableHeader' },
                { text: 'Employee Name', style: 'tableHeader' },
                { text: 'Leave Type', style: 'tableHeader' },
                { text: 'From Date', style: 'tableHeader' },
                { text: 'To Date', style: 'tableHeader' },
                { text: 'Leave Reason', style: 'tableHeader' },
                { text: 'Half Day Leave', style: 'tableHeader' },
                { text: 'Deleted', style: 'tableHeader' },
                { text: 'Leave Used', style: 'tableHeader' },
                { text: 'Note', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' },
                { text: 'Created By', style: 'tableHeader' },
                { text: 'Created At', style: 'tableHeader' }
                // , 'Rejected', 'AcceptedAt', 'AcceptedBy', 'ApprovedAt','ApprovedBy', 'RejectedAt', 'RejectedBy', 
              ],
              ...data.map(leave => [
                leave.code,
                leave.employeeName,
                leave.leaveType,
                this.datePipe.transform(leave.fromDate, DATE_OF_JOINING),
                this.datePipe.transform(leave.toDate, DATE_OF_JOINING),
                leave.leaveReason,
                {
                  image: leave.isHalfDayLeave ? check : cancle,
                  width: leave.isHalfDayLeave ? 23 : 11,
                  height: leave.isHalfDayLeave ? 23 : 11,
                  alignment: 'center',
                },
                // leave.isHalfDayLeave ? 'Yes' : 'No',
                // leave.rejected,
                // leave.acceptedAt,
                // leave.acceptedBy,
                // leave.approvedAt,
                // leave.approvedBy,
                // leave.rejectedAt,
                // leave.rejectedBy,
                {
                  image: leave.isDeleted ? check : cancle,
                  width: leave.isDeleted ? 23 : 11,
                  height: leave.isDeleted ? 23 : 11,
                  alignment: 'center',
                },
                {
                  image: leave.isLeaveUsed ? check : cancle,
                  width: leave.isLeaveUsed ? 23 : 11,
                  height: leave.isLeaveUsed ? 23 : 11,
                  alignment: 'center',
                },
                leave.note,
                leave.status,
                leave.createdBy,
                this.datePipe.transform(leave.createdAt, DATE_OF_JOINING)
              ])
            ]
          },
        },
      ],
      styles: {
        header: { fontSize: 24 },
        // color: '#ff810e',
        defaultStyle: { font: 'Typography', fontSize: 12 },
        tableHeader: { bold: true, fillColor: '#dbdbdb', alignment: 'center' },
      },
    };
    const pdfName = `EmployeeLeavesReport${currentDate}.pdf`;
    pdfMake.createPdf(docDefinition).download(pdfName);
  }

  downloadEmployeeLeavesReport() {
    this.reportService.DownloadEmployeeLeaves(this.month, this.year, this.jwtService.EmployeeId)
      .subscribe((resp) => {
        if (resp.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * resp.loaded / resp.total);
          this.value = percentDone;
        }
        if (resp.type === HttpEventType.Response) {
          const file = new Blob([resp.body], { type: 'text/csv' });
          const document = window.URL.createObjectURL(file);
          const currentDate = new Date().toLocaleString().replace(/[/\\?%*:|"<>.]/g, '-');
          const csvName = `LeavesReport${currentDate}.csv`;
          FileSaver.saveAs(document, csvName);
        }
      })
  }

  // deleteleaveDetails(employeeLeaveId) {
  //   this.confirmationDialogService.comfirmationDialog(this.confirmationRequest).subscribe(userChoice => {
  //     if (userChoice) {
  //       this.employeeService.DeleteleaveDetails(employeeLeaveId).subscribe((resp) => {
  //         if (resp) {
  //           this.alertMessage.displayAlertMessage(ALERT_CODES["ELA003"]);
  //           this.getLeaves();
  //         }
  //         else {
  //           this.alertMessage.displayErrorMessage(ALERT_CODES["ELA004"]);
  //         }
  //       })
  //     }
  //   });
  // }

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
