import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


export class Experience {
  id?: number;
  companyName?: string;
  fromDate?: Date;
  toDate?: Date;
  designation?: string;
  experienceDetails?: string;
}

@Component({
  selector: 'app-experience-details',
  templateUrl: './experience-details.component.html'
  // styleUrls: ['./experience-details.component.scss']
})

export class ExperienceDetailsComponent {
  formGroup: FormGroup<{ ExperienceDetails: FormControl<any>; }>;
  constructor(private router: Router, private formbuilder: FormBuilder, private route: ActivatedRoute) { }
  selectedOption: string;
  inputValue: string;
  fbexperience!: FormGroup;
  faexperienceDetails!: FormArray;
  dialog: boolean = false;
  addfields: any;
  employeeId: any;
  ShowexperienceDetails: boolean = false;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    console.log(this.employeeId)
    this.experienceForm();
    this.addexperienceDetails();
    this.selectedOption = 'Fresher';
  }
  toggleInputField(option: string) {
    this.selectedOption = option;
  }
  addexperienceDetails() {
    this.ShowexperienceDetails = true;
    this.faexperienceDetails = this.fbexperience.get("experienceDetails") as FormArray
    this.faexperienceDetails.push(this.generaterow())

  }
  experienceForm() {
    this.addfields = []
    this.fbexperience = this.formbuilder.group({
      employeeId: [],
      workExperienceId:[],
      companyName: new FormControl('', [Validators.required]),
      companyLocation: new FormControl('', [Validators.required]),
      companyEmployeeId: new FormControl('', [Validators.required]),
      designationId: new FormControl('', [Validators.required]),
      dateOfJoining: new FormControl('', [Validators.required]),
      dateOfReliving: new FormControl('', [Validators.required]),
      stateId: new FormControl('', [Validators.required]),
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
    this.router.navigate(['employee/onboardingemployee/addressdetails'])
  }
}
