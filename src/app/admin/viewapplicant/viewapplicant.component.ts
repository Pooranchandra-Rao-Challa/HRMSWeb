import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApplicantDialogComponent } from 'src/app/_dialogs/applicant.dialog/applicant.dialog.component';
import { ViewapplicantDialogComponent } from 'src/app/_dialogs/viewapplicant.dialog/viewapplicant.dialog.component';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { Actions, DialogRequest, ViewApplicationScreen } from 'src/app/_models/common';
import { ViewApplicantDto } from 'src/app/_models/recruitment';
import { RecruitmentService } from 'src/app/_services/recruitment.service';

@Component({
  selector: 'app-viewapplicant',
  templateUrl: './viewapplicant.component.html',
  styles: [
  ]
})
export class ViewapplicantComponent {
  applicantId: number;
  mediumDate: string = MEDIUM_DATE;
  viewApplicantDetails: ViewApplicantDto;
  ActionTypes = Actions;
  isCursorPointer: boolean = false;
  dialogRequest: DialogRequest = new DialogRequest();

  viewApplicantDialogDetails = ViewapplicantDialogComponent
  constructor(private RecruitmentService: RecruitmentService,
    private activatedRoute: ActivatedRoute,
    public ref: DynamicDialogRef,
    private dialogService: DialogService,) {
    this.applicantId = this.activatedRoute.snapshot.queryParams['applicantId'];
  }

  ngOnInit() {
    this.initViewApplicantDetails();
  }

  initViewApplicantDetails() {
    this.RecruitmentService.GetviewapplicantDtls(this.applicantId).subscribe((resp) => {
      this.viewApplicantDetails = resp[0] as unknown as ViewApplicantDto;
      this.viewApplicantDetails.expandedWorkExperience = JSON.parse(this.viewApplicantDetails.applicantWorkExperience);
      this.viewApplicantDetails.expandedCertifications = JSON.parse(this.viewApplicantDetails.applicantCertifications);
      this.viewApplicantDetails.expandedEducationDetails = JSON.parse(this.viewApplicantDetails.applicantEducationDetails);
      this.viewApplicantDetails.expandedLanguageSkills = JSON.parse(this.viewApplicantDetails.applicantLanguageSkills);
      this.viewApplicantDetails.expandedSkills = JSON.parse(this.viewApplicantDetails.applicantSkills);
    })
  }


  openRowEditDialog(content: any,
    dialogData, action: Actions = this.ActionTypes.edit, formtype: any) {
    if (action == Actions.edit && content === this.viewApplicantDialogDetails && formtype === "education") {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Education Details";
      this.dialogRequest.width = "40%";
    } else if (action == Actions.add && content === this.viewApplicantDialogDetails && formtype === "education") {
      this.dialogRequest.dialogData = null;
      this.dialogRequest.header = "Education Details";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.edit && content === this.viewApplicantDialogDetails && formtype === "certificates") {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Certificate Details";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.add && content === this.viewApplicantDialogDetails && formtype === "certificates") {
      this.dialogRequest.dialogData = null;
      this.dialogRequest.header = "Certificate Details";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.edit && content === this.viewApplicantDialogDetails && formtype === "experience") {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Experience Details";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.add && content === this.viewApplicantDialogDetails && formtype === "experience") {
      this.dialogRequest.dialogData = null;
      this.dialogRequest.header = "Experience Details";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.edit && content === this.viewApplicantDialogDetails && formtype === "technicalSkills") {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Technical Skills";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.add && content === this.viewApplicantDialogDetails && formtype === "technicalSkills") {
      this.dialogRequest.dialogData = null;
      this.dialogRequest.header = "Technical Skills";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.edit && content === this.viewApplicantDialogDetails && formtype === "languageSkills") {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Language Skills";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.add && content === this.viewApplicantDialogDetails && formtype === "languageSkills") {
      this.dialogRequest.dialogData = null;
      this.dialogRequest.header = "Language Skills";
      this.dialogRequest.width = "40%";
    }
    this.ref = this.dialogService.open(content, {
      data: this.dialogRequest.dialogData,
      header: this.dialogRequest.header,
      width: this.dialogRequest.width
    });
    this.ref.onClose.subscribe((res: any) => {
      if (res) {
        if (res.UpdatedModal == ViewApplicationScreen.educationdetails) {
          this.initViewApplicantDetails();
        }
      }
    });
  };
}
