import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_alerts/confirmationdialog.service';
import {  LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
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
  JobOpeningsList: JobOpeningsListDto[]=[];
  applicantsList: ApplicantViewDto[]=[];
  fbRecruitment!: FormGroup;
  jobOpeningId: number;
  HRdialog: boolean = false;
  confirmationRequest: ConfirmationRequestForRecruitmentProcess = new ConfirmationRequestForRecruitmentProcess();

  constructor(private RecruitmentService: RecruitmentService, private confirmationDialogService: ConfirmationDialogService,
    private formbuilder: FormBuilder, private lookupService: LookupService, private route: ActivatedRoute,) {
   
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobOpeningId = params['jobId'];
    });
    this.initProcessedJobOpening();
    this.initApplicants(this.jobOpeningId);
    this.initForm();
    this.getAttributeTypes();
  }

  getNewApplicantsList(){
    this.initApplicants(this.jobOpeningId);
  }

  initForm() {
    this.fbRecruitment = this.formbuilder.group({
      applicantId: new FormControl(),
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
    });
  }

  initApplicants(jobOpeningId:number) {
    this.RecruitmentService.getApplicantsForInitialRound(jobOpeningId).subscribe(resp => {
      this.applicantsList = resp as unknown as ApplicantViewDto[];
    })
  }

  showConfirmationDialog() {
    this.confirmationDialogService.comfirmationDialog(this.confirmationRequest).subscribe(userChoice => {
      if (userChoice) {
        console.log(userChoice);
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
