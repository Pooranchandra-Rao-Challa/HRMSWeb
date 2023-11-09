import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import {  JobOpeningsDetailsViewDto, LookupDetailsDto, LookupViewDto, ProjectViewDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-jobopenings.dialog',
  templateUrl: './jobopenings.dialog.component.html',
  styles: [
  ]
})
export class JobOpeningsDialogComponent {
  fbJobOpening!: FormGroup;
  technicalskills: LookupDetailsDto[] = [];
  softskills: LookupDetailsDto[] =[];
  natureOfJobs: LookupViewDto[] =[];
  projects:ProjectViewDto[]=[];
  maxLength: MaxLength = new MaxLength();
  JobOpeningId: number;
  viewSelectedSkills = [];
  designation:LookupViewDto[]=[];
  minDate: Date = new Date(new Date());

  constructor(private formbuilder: FormBuilder, 
              private lookupService: LookupService,
              private adminService:AdminService,
              public ref: DynamicDialogRef,
              private alertMessage:AlertmessageService) { }

  ngOnInit() {
    this.jobOpeningForm();
    this.getTechnicalSkills();
    this.getProjectNames();
    this.getSoftSkills();
    this.getNatureOfJObs();
    this.getDesignation();
  }

  getProjectNames() {
    this.adminService.GetProjects().subscribe(resp => {
      this.projects = resp as unknown as ProjectViewDto[];     
    });
  }

  getTechnicalSkills() {
    this.lookupService.SkillAreas().subscribe((resp) => {
      this.technicalskills = resp as unknown as LookupViewDto[];
    })
  }

  getSoftSkills(){
    this.lookupService.SoftSkills().subscribe((resp)=>{
      this.softskills =resp as unknown as LookupViewDto[];
    })
  }

  getNatureOfJObs(){
    this.lookupService.NatureOfJobs().subscribe((resp)=>{
      this.natureOfJobs = resp as unknown as LookupViewDto[];
    })
  }

  getDesignation() {
    this.lookupService.Designations().subscribe(resp => {
      this.designation = resp as unknown as LookupViewDto[];     
    });
  }


  jobOpeningForm() {
    this.fbJobOpening = this.formbuilder.group({
      JobOpeningId: [null],
      projectId:  new FormControl('', [Validators.required]),
      designationId:  new FormControl('',[Validators.required]),
      description:  new FormControl('', [Validators.required]),
      natureOfJobId:  new FormControl('', [Validators.required]),
      compensationPackage:  new FormControl('', [Validators.required]),
      toBeFilled:  new FormControl('', [Validators.required]),
      isActive:  new FormControl(true),
      technicalSkills:new FormControl('',[Validators.required]),
      softSkills:new FormControl('',[Validators.required]),
      JobOpeningTechnicalSkillsXrefs:new FormControl([{JobOpeningsTechnicalSkillsXrefId:null,JobOpeningId:null,TechnicalSkillId:null}]),
      JobOpeningSoftSkillsXrefs:new FormControl([{JobOpeningsSoftSkillsXrefId:null,JobOpeningId:null,SoftSkillId:null}]),
    });
  }

  get FormControls() {
    return this.fbJobOpening.controls;
  }


  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }

  onSelectSoftSkill(e){
    this.fbJobOpening.get('JobOpeningSoftSkillsXrefs')?.setValue('');
    this.viewSelectedSkills = [];
    let CurrentArray = e.value;
    let updatedArray = [];
    if (this.JobOpeningId) {
      for (let i = 0; i < CurrentArray.length; i++) {
        updatedArray.push({ JobOpeningsSoftSkillsXrefId: 0, JobOpeningId: this.JobOpeningId, SoftSkillId: CurrentArray[i] })
      }
    }
    else {
      for (let i = 0; i < CurrentArray.length; i++) {
        updatedArray.push({ JobOpeningsSoftSkillsXrefId: 0, JobOpeningId: 0, SoftSkillId: CurrentArray[i] })
      }
    }

    for (let item of e.value)
      this.softskills.forEach(each => {
        if (each.lookupDetailId == item) {
          this.viewSelectedSkills.push(each.name);
        }
      });
    this.fbJobOpening.get('JobOpeningSoftSkillsXrefs')?.setValue(updatedArray);
  }

  onSelectTechnicalSkill(e) {
    this.fbJobOpening.get('JobOpeningTechnicalSkillsXrefs')?.setValue('');
    this.viewSelectedSkills = [];
    let CurrentArray = e.value;
    let updatedArray = [];
    if (this.JobOpeningId) {
      for (let i = 0; i < CurrentArray.length; i++) {
        updatedArray.push({ JobOpeningsTechnicalSkillsXrefId: 0, JobOpeningId: this.JobOpeningId, TechnicalSkillId: CurrentArray[i] })
      }
    }
    else {
      for (let i = 0; i < CurrentArray.length; i++) {
        updatedArray.push({ JobOpeningsTechnicalSkillsXrefId: 0, JobOpeningId: 0, TechnicalSkillId: CurrentArray[i] })
      }
    }

    for (let item of e.value)
      this.technicalskills.forEach(each => {
        if (each.lookupDetailId == item) {
          this.viewSelectedSkills.push(each.name);
        }
      });
    this.fbJobOpening.get('JobOpeningTechnicalSkillsXrefs')?.setValue(updatedArray);
  }


  save(): Observable<HttpEvent<JobOpeningsDetailsViewDto[]>> {
    return this.adminService.CreateJobOpeningDetails([this.fbJobOpening.value])
  }
  
  onSubmit() {
    if (this.fbJobOpening.valid) {
      this.save().subscribe(resp => {        
        if (resp) {
          this.ref.close(true);
          this.alertMessage.displayAlertMessage(ALERT_CODES["JDD001"]);
        }
      });
    }
    else {
      this.fbJobOpening.markAllAsTouched();
    }
  }
}
