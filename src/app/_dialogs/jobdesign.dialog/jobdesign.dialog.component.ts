import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LookupViewDto } from 'src/app/_models/admin';
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

  constructor(private formbuilder: FormBuilder, private lookupService: LookupService) { }

  ngOnInit() {
    this.jobDesignForm();
    this.initSkills();
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


  initSkills() {
    this.lookupService.SkillAreas().subscribe((resp) => {
      this.technicalskills = resp as unknown as LookupViewDto[];
    })
  }

  jobDesignForm() {
    this.fbJobDesign = this.formbuilder.group({
      id: [null],
      jobDescription: new FormControl('', [Validators.required]),
      projectName: new FormControl('', [Validators.required]),
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
