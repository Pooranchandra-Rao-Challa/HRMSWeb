import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ApplicantDialogComponent } from 'src/app/_dialogs/applicant.dialog/applicant.dialog.component';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { Applicant } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';

export interface Status {
  name: string;
  code: string;
}

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styles: [
  ]
})
export class ApplicantComponent {
  globalFilterFields: string[] = ['name', 'mobileNumber', 'email']
  @ViewChild('filter') filter!: ElementRef;
  applicant: Applicant[] = [];
  status: Status[] | undefined;
  addDialog: boolean = false;
  ActionTypes = Actions;
  dialogRequest: DialogRequest = new DialogRequest();
  applicantdialogComponent = ApplicantDialogComponent;

  constructor(private securityService: SecurityService,
    private globalFilterService: GlobalFilterService,
    public ref: DynamicDialogRef,
    private dialogService: DialogService,
  ) {

  }
  headers: ITableHeader[] = [
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'mobileNumber', header: 'mobileNumber', label: 'Mobile Number' },
    { field: 'email', header: 'email', label: 'Email' },
    { field: 'status', header: 'status', label: 'Status' },
    { field: 'resume', header: 'resume', label: 'Resume' }
  ];

  ngOnInit() {
    this.securityService.getApplicantData().then((resp) => {
      this.applicant = resp as unknown as Applicant[];
    })
    this.status = [
      { name: 'Open', code: 'OP' },
      { name: 'Close', code: 'CL' }
    ]
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
    if (action == Actions.add && content === this.applicantdialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Applicants";
      this.dialogRequest.width = "60%";
    }
    this.ref = this.dialogService.open(content, {
      data: this.dialogRequest.dialogData,
      header: this.dialogRequest.header,
      width: this.dialogRequest.width
    });
    this.ref.onClose.subscribe((res: any) => {
      event.preventDefault(); // Prevent the default form submission
    });
  }
}
