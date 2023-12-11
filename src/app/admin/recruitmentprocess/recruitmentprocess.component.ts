import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_alerts/confirmationdialog.service';
import { JobOpeningsDetailsViewDto, LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { ConfirmationRequestForRecruitmentProcess } from 'src/app/_models/common';
import { ApplicantViewDto, JobOpeningsListDto, RASBasedOnProcessId } from 'src/app/_models/recruitment';
import { AdminService } from 'src/app/_services/admin.service';
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
  jobOpening: JobOpeningsDetailsViewDto[] = [];
  jobDetails:JobOpeningsDetailsViewDto;
  RASBasedOnProcessId:RASBasedOnProcessId[]=[]
  fbRecruitment!: FormGroup;
  jobOpeninginprocessId:number;
  attributeStages: LookupDetailsDto[];
  HRdialog: boolean = false;
  confirmationRequest: ConfirmationRequestForRecruitmentProcess = new ConfirmationRequestForRecruitmentProcess();

  constructor(private RecruitmentService: RecruitmentService, private confirmationDialogService: ConfirmationDialogService,
    private formbuilder: FormBuilder, private lookupService: LookupService, private route: ActivatedRoute,
    private router: Router,private adminService: AdminService,) {
    this.route.params.subscribe(params => {
      this.jobOpeninginprocessId = params['jobProcessingId'];
    });
  }

  ngOnInit() {
    this.initProcessedJobOpening();
    this.initForm();
    this.getAttributeStages();
    this.getJobDetails();
    if (this.jobOpeninginprocessId)
      this.initApplicants(this.jobOpeninginprocessId);
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

  showDialogToMoveHR(applicant) {
    this.getAttributeTypes();
    this.HRdialog = true;
    const matchingJob = this.JobOpeningsList.find(job => job.jobOpeninginprocessId === this.jobOpeninginprocessId);
    this.jobDetails = this.jobOpening.find(job => job.id === matchingJob?.jobId);
    this.RecruitmentService.getRAsBasedOnProcessId(this.jobOpeninginprocessId).subscribe(
      resp => this.RASBasedOnProcessId = resp as unknown as RASBasedOnProcessId[]
    );
  }
  
  showConfirmationDialog(applicant: ApplicantViewDto) {
    this.confirmationDialogService.comfirmationDialog(this.confirmationRequest).subscribe(userChoice => {
      if (userChoice) {
        const obj={
        filteredApplicantId: applicant.filteredApplicantId,
        applicantId: applicant.applicantId,
        jobOpeningInProcessId:this.jobOpeninginprocessId
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
      console.log(resp);
      
      this.attributeTypes = resp as unknown as LookupViewDto[];
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
