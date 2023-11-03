import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LookupViewDto, ProjectViewDto } from 'src/app/_models/admin';
import { AdminService } from 'src/app/_services/admin.service';
import { LookupService } from 'src/app/_services/lookup.service';

interface SoftSkills {
  name: string;
  code: string;
}

interface NatureOfJobs {
  name: string;
  code: string;
}

@Component({
  selector: 'app-jobdesign.dialog',
  templateUrl: './jobdesign.dialog.component.html',
  styles: [
  ]
})
export class JobdesignDialogComponent {
  fbJobDesign!: FormGroup;
  technicalskills: LookupViewDto[] = [];
  softskills: SoftSkills[] | undefined;
  natureOfJobs: NatureOfJobs[] | undefined;
  projects:ProjectViewDto[]=[];

  constructor(private formbuilder: FormBuilder, private lookupService: LookupService,private adminService:AdminService) { }

  ngOnInit() {
    this.jobDesignForm();
    this.getSkills();
    this.getProjectNames();
    this.softskills = [
      { name: 'Communicaiton Skills', code: 'CS' },
      { name: 'Leadership', code: 'LS' },
      { name: 'Problem solving', code: 'PS' },
      { name: 'Time management', code: 'TM' },
      { name: 'Teamwork', code: 'TW' },
      { name: 'Critical thinking', code: 'CT' }
    ];
    this.natureOfJobs = [
      { name: 'Full Time', code: 'FT' },
      { name: 'Part Time', code: 'PT' }
    ]
  }


  getSkills() {
    this.lookupService.SkillAreas().subscribe((resp) => {
      this.technicalskills = resp as unknown as LookupViewDto[];
    })
  }

  getProjectNames() {
    this.adminService.GetProjects().subscribe(resp => {
      this.projects = resp as unknown as ProjectViewDto[];
     console.log(this.projects);
     
    });
  }

  jobDesignForm() {
    this.fbJobDesign = this.formbuilder.group({
      id: [null],
      projectName: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      technicalSkills: new FormControl('', [Validators.required]),
      softSkills: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      natureOfJobs: new FormControl('', [Validators.required]),
      compensationPackage: new FormControl('', [Validators.required])
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
