import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_alerts/confirmationdialog.service';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { ConfirmationRequestForRecruitmentProcess } from 'src/app/_models/common';
import { ApplicantViewDto, JobOpeningsListDto } from 'src/app/_models/recruitment';
import { LookupService } from 'src/app/_services/lookup.service';
import { RecruitmentService } from 'src/app/_services/recruitment.service';

@Component({
  selector: 'app-recruitmentprocess',
  templateUrl: './recruitmentprocess.component.html',
  styles: [
  ]
})
export class RecruitmentProcessComponent {
  attributeTypes: LookupDetailsDto[] = [];
  JobOpeningsList: JobOpeningsListDto[] = [];
  applicantsList: ApplicantViewDto[] = [];
  fbRecruitment!: FormGroup;
  jobOpeningId: number;
  HRdialog: boolean = false;
  confirmationRequest: ConfirmationRequestForRecruitmentProcess = new ConfirmationRequestForRecruitmentProcess();

  constructor(private RecruitmentService: RecruitmentService, private confirmationDialogService: ConfirmationDialogService,
    private formbuilder: FormBuilder, private lookupService: LookupService, private route: ActivatedRoute,
    private router: Router,) {
    this.route.params.subscribe(params => {
      this.jobOpeningId = params['jobId'];
    });
  }

  ngOnInit() {
    this.initProcessedJobOpening();
    this.initForm();
    this.getAttributeTypes();
    if (this.jobOpeningId)
      this.initApplicants(this.jobOpeningId);
  }

  getNewApplicantsList() {
    this.initApplicants(this.jobOpeningId);
  }

  initForm() {
    this.fbRecruitment = this.formbuilder.group({
      jobOpeningId: new FormControl(),
      applicantId: new FormControl('',[Validators.required]),
      recruitmentStageId: new FormControl(),
      recruitmentAttributeID: new FormControl(),
      expertise: new FormControl(),
      userId: new FormControl()
    })
  }

  get FormControls() {
    return this.fbRecruitment.controls;
  }

  initProcessedJobOpening() {
    this.RecruitmentService.getJobOpeningDropdown().subscribe(resp => {
      this.JobOpeningsList = resp as unknown as JobOpeningsListDto[];
      if (this.jobOpeningId === undefined) 
        this.getLatestInitiatedAt();
    });
  }

  getLatestInitiatedAt() {
    const mostRecentObject = this.JobOpeningsList.reduce((maxDateObject, currentObject) => {
      const maxDate = new Date(maxDateObject.initiatedAt);
      const currentDate = new Date(currentObject.initiatedAt);
      return currentDate > maxDate ? currentObject : maxDateObject;
    }, this.JobOpeningsList[0]);
    this.jobOpeningId = mostRecentObject.jobId;
    this.initApplicants(this.jobOpeningId);
  }
  viewApplicantDtls(applicantId: number) {
    this.router.navigate(['admin/viewapplicant'], { queryParams: { applicantId: applicantId } });
  }

  initApplicants(jobOpeningId: number) {
    this.RecruitmentService.getApplicantsForInitialRound(jobOpeningId).subscribe(resp => {
      this.applicantsList = resp as unknown as ApplicantViewDto[];
    });


  }

  showConfirmationDialog(applicant: ApplicantViewDto) {
    this.confirmationDialogService.comfirmationDialog(this.confirmationRequest).subscribe(userChoice => {
      if (userChoice) {
        this.fbRecruitment.patchValue({
          jobOpeningId: this.jobOpeningId,
          applicantId: applicant.applicantId,
        });
        this.RecruitmentService.UpdateApplicantStatus(this.fbRecruitment.value).subscribe(resp => {
          this.initApplicants(this.jobOpeningId);
        });
      }
    });
  }

  showDialogToMoveHR() {
    this.HRdialog = true;

  }

  getAttributeTypes() {
    this.lookupService.AttributeTypes().subscribe((resp) => {
      this.attributeTypes = resp as unknown as LookupViewDto[];
    })
  }

}
