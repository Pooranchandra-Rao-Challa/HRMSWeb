import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  applicant: Applicant[] = [];
  ActionTypes = Actions;
  dialogRequest: DialogRequest = new DialogRequest();
  applicantdialogComponent = ApplicantDialogComponent;

  constructor(private securityService: SecurityService,
    public ref: DynamicDialogRef,
    private router: Router,
    private dialogService: DialogService) {}

  ngOnInit() {
    this.securityService.getApplicantData().then((resp) => {
      this.applicant = resp as unknown as Applicant[];
    })
  }

  viewApplicantDtls() {
    this.router.navigate(['admin/viewapplicant']);
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
