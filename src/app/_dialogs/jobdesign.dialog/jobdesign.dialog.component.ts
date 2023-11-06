import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { JobDesignDto, LookupDetailsDto, LookupViewDto, ProjectViewDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-jobdesign.dialog',
  templateUrl: './jobdesign.dialog.component.html',
  styles: [
  ]
})
export class JobdesignDialogComponent {
  fbJobDesign!: FormGroup;
  technicalskills: LookupDetailsDto[] = [];
  softskills: LookupDetailsDto[] =[];
  natureOfJobs: LookupViewDto[] =[];
  projects:ProjectViewDto[]=[];
  maxLength: MaxLength = new MaxLength();
  jobDesignId: number;
  viewSelectedSkills = [];
  designation:LookupViewDto[]=[];
  minDate: Date = new Date(new Date());

  constructor(private formbuilder: FormBuilder, 
              private lookupService: LookupService,
              private adminService:AdminService,
              public ref: DynamicDialogRef,
              private alertMessage:AlertmessageService) { }

  ngOnInit() {
    this.jobDesignForm();
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


  jobDesignForm() {
    this.fbJobDesign = this.formbuilder.group({
      jobDesignId: [null],
      projectId:  new FormControl('', [Validators.required]),
      designationId:  new FormControl('',[Validators.required]),
      description:  new FormControl('', [Validators.required]),
      natureOfJobId:  new FormControl('', [Validators.required]),
      compensationPackage:  new FormControl('', [Validators.required]),
      toBeFilled:  new FormControl('', [Validators.required]),
      isActive:  new FormControl(true),
      technicalSkills:new FormControl('',[Validators.required]),
      softSkills:new FormControl('',[Validators.required]),
      JobDesignTechnicalSkillsXrefs:new FormControl([{JobDesignTechnicalSkillsXrefId:null,JobDesignId:null,TechnicalSkillId:null}]),
      JobDesignSoftSkillsXrefs:new FormControl([{JobDesignSoftSkillsXrefId:null,JobDesignId:null,SoftSkillId:null}]),
    });
  }

  get FormControls() {
    return this.fbJobDesign.controls;
  }


  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }

  onSelectSoftSkill(e){
    this.fbJobDesign.get('JobDesignSoftSkillsXrefs')?.setValue('');
    this.viewSelectedSkills = [];
    let CurrentArray = e.value;
    let updatedArray = [];
    if (this.jobDesignId) {
      for (let i = 0; i < CurrentArray.length; i++) {
        updatedArray.push({ JobDesignSoftSkillsXrefId: 0, JobDesignId: this.jobDesignId, SoftSkillId: CurrentArray[i] })
      }
    }
    else {
      for (let i = 0; i < CurrentArray.length; i++) {
        updatedArray.push({ JobDesignSoftSkillsXrefId: 0, JobDesignId: 0, SoftSkillId: CurrentArray[i] })
      }
    }

    for (let item of e.value)
      this.softskills.forEach(each => {
        if (each.lookupDetailId == item) {
          this.viewSelectedSkills.push(each.name);
        }
      });
    this.fbJobDesign.get('JobDesignSoftSkillsXrefs')?.setValue(updatedArray);
  }

  onSelectTechnicalSkill(e) {
    this.fbJobDesign.get('JobDesignTechnicalSkillsXrefs')?.setValue('');
    this.viewSelectedSkills = [];
    let CurrentArray = e.value;
    let updatedArray = [];
    if (this.jobDesignId) {
      for (let i = 0; i < CurrentArray.length; i++) {
        updatedArray.push({ JobDesignTechnicalSkillsXrefId: 0, JobDesignId: this.jobDesignId, TechnicalSkillId: CurrentArray[i] })
      }
    }
    else {
      for (let i = 0; i < CurrentArray.length; i++) {
        updatedArray.push({ JobDesignTechnicalSkillsXrefId: 0, JobDesignId: 0, TechnicalSkillId: CurrentArray[i] })
      }
    }

    for (let item of e.value)
      this.technicalskills.forEach(each => {
        if (each.lookupDetailId == item) {
          this.viewSelectedSkills.push(each.name);
        }
      });
    this.fbJobDesign.get('JobDesignTechnicalSkillsXrefs')?.setValue(updatedArray);
  }


  save(): Observable<HttpEvent<JobDesignDto[]>> {
    console.log(this.fbJobDesign.value);
    return this.adminService.CreateJobDesignDetails([this.fbJobDesign.value])
  }
  
  onSubmit() {
    if (this.fbJobDesign.valid) {
      console.log(this.fbJobDesign.value);

      this.save().subscribe(resp => {
        console.log(resp);
        
        if (resp) {
          console.log(this.fbJobDesign.value);
          this.ref.close(true);
          this.alertMessage.displayAlertMessage(ALERT_CODES["JDD001"]);
        }
      });
    }
    else {
      this.fbJobDesign.markAllAsTouched();
    }
  }
}
