import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { ConfirmationDialogService } from 'src/app/_alerts/confirmationdialog.service';
import { JobOpeningsDetailsViewDto, LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { ConfirmationRequestForRecruitmentProcess, ConfirmationRequestForRecruitmentProcess1 } from 'src/app/_models/common';
import { ApplicantViewDto, attributeTypeDto, JobOpeningsListDto, RASBasedOnProcessId } from 'src/app/_models/recruitment';
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { RecruitmentService } from 'src/app/_services/recruitment.service';

@Component({
  selector: 'app-recruitmentprocess',
  templateUrl: './recruitmentprocess.component.html',
  styles: [
  ]
})
export class RecruitmentProcessComponent {
  attributeTypes: attributeTypeDto[] = [];
  JobOpeningsList: JobOpeningsListDto[] = [];
  applicantsList: ApplicantViewDto[] = [];
  jobOpening: JobOpeningsDetailsViewDto[] = [];
  jobDetails: JobOpeningsDetailsViewDto;
  RASBasedOnProcessId: RASBasedOnProcessId[] = []
  fbRecruitment!: FormGroup;
  jobOpeninginprocessId: number;
  attributeStages: LookupDetailsDto[];
  permissions: any;
  HRdialog: boolean = false;
  confirmationRequest: ConfirmationRequestForRecruitmentProcess = new ConfirmationRequestForRecruitmentProcess();
  confirmationRequest1: ConfirmationRequestForRecruitmentProcess1 = new ConfirmationRequestForRecruitmentProcess1();
  constructor(private RecruitmentService: RecruitmentService,
    private jwtService: JwtService, private confirmationDialogService: ConfirmationDialogService,
    private formbuilder: FormBuilder, private lookupService: LookupService, private route: ActivatedRoute,
    private router: Router, private adminService: AdminService,) {
    this.route.params.subscribe(params => {
      this.jobOpeninginprocessId = params['jobProcessingId'];
    });
  }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.initProcessedJobOpening();
    this.initForm();
    this.getAttributeStages();
    this.getJobDetails();
    if (this.jobOpeninginprocessId)
      this.initApplicants(this.jobOpeninginprocessId);
  }

  initForm() {
    this.fbRecruitment = this.formbuilder.group({
      applicantInterviewResultId: new FormControl(),
      attributeTypeId: new FormControl("", [Validators.required]),
      filteredApplicantId: new FormControl('', [Validators.required]),
      recruitmentStageId: new FormControl('', [Validators.required]),
      interviewedBy: new FormControl("", [Validators.required]),
      interviewResults: new FormControl("")
    })
  }

  get FormControls() {
    return this.fbRecruitment.controls;
  }

  showDialogToMoveHR(applicant) {
    this.getAttributeTypes();
    this.HRdialog = true;
    const matchingJob = this.JobOpeningsList.find(job => job.jobOpeninginprocessId === this.jobOpeninginprocessId);
    this.jobDetails = this.jobOpening.find(job => job.id === matchingJob?.jobId);
    this.initRAS();
    this.fbRecruitment.patchValue({
      filteredApplicantId: applicant.filteredApplicantId,
      interviewedBy: this.jwtService.UserId
    })
  }
  initRAS() {
    this.RecruitmentService.getRAsBasedOnProcessId(this.jobOpeninginprocessId).subscribe(
      resp => {
        const RASBasedOnProcessId = resp as unknown as RASBasedOnProcessId[];
        this.RASBasedOnProcessId = [];
        if (RASBasedOnProcessId)
          RASBasedOnProcessId.forEach(item => {
            this.RASBasedOnProcessId.push({
              assessmentTitle: item.assessmentTitle,
              recruitmentAttributeId: item.recruitmentAttributeId,
              expertise: 0
            });
          })
      });
  }
  onSubmit() {
    this.fbRecruitment.get('interviewResults').setValue(this.RASBasedOnProcessId);
    this.RecruitmentService.submitInterviewResult(this.fbRecruitment.value).subscribe(resp => {
      if(resp){
        this.HRdialog=false;
        this.fbRecruitment.reset();
        this.initApplicants(this.jobOpeninginprocessId);
      }
    });
  }
  showConfirmationDialog(applicant: ApplicantViewDto) {
    this.confirmationDialogService.comfirmationDialog(this.confirmationRequest1).subscribe(userChoice => {
      if (userChoice) {
        const obj = {
          filteredApplicantId: applicant.filteredApplicantId
        }; 
        this.RecruitmentService.UpdateInterviewResult(obj).subscribe(resp => {
          this.initApplicants(this.jobOpeninginprocessId);
        });
      }
    });
  }
  showConfirmationDialogToMoveTechnical(applicant: ApplicantViewDto) {
    this.confirmationDialogService.comfirmationDialog(this.confirmationRequest).subscribe(userChoice => {
      if (userChoice) {
        const obj = {
          filteredApplicantId: applicant.filteredApplicantId,
          applicantId: applicant.applicantId,
          jobOpeningInProcessId: this.jobOpeninginprocessId
        };
        this.RecruitmentService.UpdateApplicantStatus(obj).subscribe(resp => {
          this.initApplicants(this.jobOpeninginprocessId);
        });
      }
    });
  }
  getLatestInitiatedAt() {
    const mostRecentObject = this.JobOpeningsList.reduce((maxDateObject, currentObject) => {
      const maxDate = new Date(maxDateObject.initiatedAt);
      const currentDate = new Date(currentObject.initiatedAt);
      return currentDate > maxDate ? currentObject : maxDateObject;
    }, this.JobOpeningsList[0]);
    this.jobOpeninginprocessId = mostRecentObject.jobOpeninginprocessId;
    this.initApplicants(this.jobOpeninginprocessId);
  }
  initProcessedJobOpening() {
    this.RecruitmentService.getJobOpeningDropdown().subscribe(resp => {
      this.JobOpeningsList = resp as unknown as JobOpeningsListDto[];
      if (this.jobOpeninginprocessId === undefined)
        this.getLatestInitiatedAt();
    });
  }
  getAttributeTypes() {
    this.RecruitmentService.getRecruitmentAttribute(this.jobOpeninginprocessId).subscribe((resp) => {
      this.attributeTypes = resp as unknown as attributeTypeDto[];
    })
  }
  getJobDetails() {
    this.adminService.GetJobDetails().subscribe((resp) => {
      this.jobOpening = resp as unknown as JobOpeningsDetailsViewDto[];
    })
  }
  initApplicants(jobOpeninginprocessId: number) {
    this.RecruitmentService.getApplicantsForInitialRound(jobOpeninginprocessId).subscribe(resp => {
      this.applicantsList = resp as unknown as ApplicantViewDto[];
      console.log(resp);

    });
  }
  getAttributeStages() {
    this.lookupService.attributestages().subscribe((resp) => {
      this.attributeStages = resp as unknown as LookupDetailsDto[];
    })
  }
  viewApplicantDtls(applicantId: number) {
    this.router.navigate(['admin/viewapplicant'], { queryParams: { applicantId: applicantId } });
  }
}
