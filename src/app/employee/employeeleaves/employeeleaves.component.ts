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
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { NgPluralCase } from '@angular/common';
import { LeaveConfirmationService } from 'src/app/_services/leaveconfirmation.service';
import { EmployeeLeaveDialogComponent } from 'src/app/_dialogs/employeeleave.dialog/employeeleave.dialog.component';
import { ReportService } from 'src/app/_services/report.service';
import * as FileSaver from "file-saver";
import { ConfirmationDialogService } from 'src/app/_alerts/confirmationdialog.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
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


  statuses: any[] = [
    { name: 'Pending', key: 'P' },
    { name: 'Accepted', key: 'A' },
    { name: 'Approved', key: 'Ap' },
    { name: 'Rejected', key: 'R' }
  ];

  headers: ITableHeader[] = [
    // { field: 'status', header: 'status', label: 'Status' },
    { field: 'employeeName', header: 'employeeName', label: 'Employee Name' },
    { field: 'leaveType', header: 'leaveType', label: 'Leave Type' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'note', header: 'note', label: 'Leave Description' },
    { field: 'isHalfDayLeave', header: 'isHalfDayLeave', label: 'Half Day Leave' },
    { field: 'isDeleted', header: 'isDeleted', label: 'Deleted' },
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

  openSweetAlert(title: string, leaves: EmployeeLeaveDto) {
    const buttonLabel = title === 'Reason For Approve' ? 'Approve' : (title === 'Reason For Accept' ? 'Accept' : 'Reject')
    this.leaveConfirmationService.openDialogWithInput(title, buttonLabel).subscribe((result) => {
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

  async generatePdf(data: any) {
    const pageSize = { width: 841.89, height: 595.28 };
    const headerImage = await this.getBase64ImageFromURL('assets/layout/images/head.JPG');
    const footerSize = { width: 841.90, height: 40.99 };
    const footerImage = await this.getBase64ImageFromURL('assets/layout/images/footer.JPG')
    const createLine = () => [{ type: 'line', x1: 0, y1: 0, x2: 495.28, y2: 0, lineWidth: 2 }];

    // const createFooter = () => ({
    //   margin: [0, 0, 0, 0],
    //   height: 40,
    //   background: '#41b6a6',
    //   color: '#fff',
    //   width: 595.28,
    //   columns: [
    //     { canvas: [{ type: 'rect', x: 0, y: 0, w: 595.28, h: 40, color: '#41b6a6' }] },
    //     { text: '@ 2022 EHR One, LLC', fontSize: 14, color: '#fff', absolutePosition: { x: 20, y: 10 }},
    //     { image: 'assets/layout/images/footer.JPG', width: 40, height: 40, absolutePosition: { x: 550, y: 0 }},
    //   ],
    // });

    const docDefinition = {
      pageOrientation: 'landscape', // Set page orientation to landscape
      // pageSize: { width: 841.89, height: 595.28 },
      // pageMargins: [120, 0, 0, 0], // [left, top, right, bottom]
      header: () => ({
        stack: [
          { image: headerImage, width: pageSize.width, height: pageSize.height * 0.15, margin: [0, 0, 0, 0] },
          { canvas: [{ type: 'line', x1: 0, y1: 5, x2: pageSize.width, y2: 5, lineWidth: 2, color: 'gray' }], absolutePosition: { x: 0, y: 83 } }
        ]
      }),
      footer: () => ({ image: footerImage, width: footerSize.width, height: footerSize.height }),
      content: [
        {
          text: 'Employee Leaves',
          bold: true,
          alignment: 'center',
          color: '#ff810e',
          margin: 120,
          style: 'header',
        },
        {
          style: 'tableExample',
          table: {
            widths: [29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29],
            body: [
              ['Employee ID', 'Employee Name', 'Code', 'From Date', 'To Date', 'Leave Reason', 'Half Day Leave', 'Rejected', 'AcceptedAt', 'AcceptedBy', 'ApprovedAt', 'ApprovedBy', 'RejectedAt', 'RejectedBy', 'Deleted', 'Leave Used', 'Note', 'Status', 'Created At', 'Created By'
              ],
              ...this.leaves.map(leave => [
                leave.code,
                leave.employeeName,
                leave.leaveType,
                leave.fromDate,
                leave.toDate,
                leave.leaveReason,
                leave.isHalfDayLeave,
                leave.rejected,
                leave.acceptedAt,
                leave.acceptedBy,
                leave.approvedAt,
                leave.approvedBy,
                leave.rejectedAt,
                leave.rejectedBy,
                leave.isDeleted,
                leave.isLeaveUsed,
                leave.note,
                leave.status,
                leave.createdAt,
                leave.createdBy
              ])
            ]
          }
          // layout: 'noBorders' // Remove borders around the table
        },
      ],
      styles: {
        header: { fontSize: 24 },
        subheader: { fontSize: 20, alignment: 'center' },
        borderedText: { border: [1, 1, 1, 1], borderColor: 'rgb(0, 0, 255)', fillColor: '#eeeeee', width: 100, height: 150, margin: [12, 20, 0, 0] },
        defaultStyle: { font: 'Typography', fontSize: 12 },
        tableExample: { margin: [0, -120, 0, 0] },
        tableHeader: { bold: true, fontSize: 13, color: 'black' }
      },
    };

    pdfMake.createPdf(docDefinition).download('SuperBill.pdf');
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
          FileSaver.saveAs(document, "LeavesReport.csv");
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
