import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LookupViewDto, ProjectViewDto } from 'src/app/_models/admin';
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
  technicalskills: LookupViewDto[] = [];
  softskills: LookupViewDto[] =[];
  natureOfJobs: LookupViewDto[] =[];
  projects:ProjectViewDto[]=[];
  maxLength: MaxLength = new MaxLength();

  constructor(private formbuilder: FormBuilder, private lookupService: LookupService,private adminService:AdminService) { }

  ngOnInit() {
    this.jobDesignForm();
    this.getTechnicalSkills();
    this.getProjectNames();
    this.getSoftSkills();
    this.getNatureOfJObs();
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

  jobDesignForm() {
    this.fbJobDesign = this.formbuilder.group({
      jobDesignId:  new FormControl(''),
      projectId:  new FormControl('', [Validators.required]),
      designationId:  new FormControl('', [Validators.required]),
      description:  new FormControl('', [Validators.required]),
      natureOfJobId:  new FormControl('', [Validators.required]),
      compensationPackage:  new FormControl('', [Validators.required]),
      toBeFilled:  new FormControl('', [Validators.required]),
      isActive:  new FormControl(true),
      technicalSkills:new FormControl('',[Validators.required]),
      softSkills:new FormControl('',[Validators.required]),
      JobDesignSoftSkillsXrefs:new FormControl([{JobDesignSoftSkillsXrefId:null,JobDesignId:null,SoftSkillId:null}]),
      JobDesignTechnicalSkillsXrefs:new FormControl([{JobDesignTechnicalSkillsXrefId:null,JobDesignId:null,TechnicalSkillId:null}])
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

  
}
