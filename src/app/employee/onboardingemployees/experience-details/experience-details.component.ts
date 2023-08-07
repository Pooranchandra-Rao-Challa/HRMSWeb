import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


export class Experience{
  id?:number;
 companyName?:string;
 fromDate?: Date;
 toDate?: Date;
 designation?:string;
 experienceDetails?: string;
}

@Component({
  selector: 'app-experience-details',
  templateUrl: './experience-details.component.html'
  // styleUrls: ['./experience-details.component.scss']
})

export class ExperienceDetailsComponent {
  formGroup: FormGroup<{ ExperienceDetails: FormControl<any>; }>;
  constructor(private router: Router, private formbuilder: FormBuilder) { }
  selectedOption: string;
  inputValue: string;
  fbexperience!: FormGroup;
  faexperienceDetails!: FormArray;
  dialog: boolean = false;
  addfields: any;

  ShowexperienceDetails: boolean = false;
  ngOnInit() {
    this.experienceForm();
    this.addexperienceDetails();
    this.selectedOption = 'Fresher';
  }
  toggleInputField(option: string) {
    this.selectedOption = option;
  }
  addexperienceDetails() {
    console.log(this.ShowexperienceDetails)
    this.ShowexperienceDetails = true;
    this.faexperienceDetails = this.fbexperience.get("experienceDetails") as FormArray
    this.faexperienceDetails.push(this.generaterow())

  }
  experienceForm() {
    this.addfields = []
    this.fbexperience = this.formbuilder.group({
      id: [],
      companyName: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      experienceDetails: this.formbuilder.array([])
    });
  }
  generaterow(experienceDetails: Experience = new Experience()): FormGroup {
    return this.formbuilder.group({
      id: [experienceDetails.id],
      companyName: new FormControl(experienceDetails.companyName, [Validators.required]),
      fromDate: new FormControl(experienceDetails.fromDate, [Validators.required]),
      toDate: new FormControl(experienceDetails.toDate, [Validators.required]),
      designation: new FormControl(experienceDetails.designation, [Validators.required]),
    })
  }
  faexperienceDetail(): FormArray {
    return this.fbexperience.get("experienceDetails") as FormArray
  }

  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/educationdetails'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/uploadfiles'])
  }
}
