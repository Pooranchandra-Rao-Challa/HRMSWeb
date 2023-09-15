import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { Designation, ExperienceDetailsDto, SkillArea, States } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';


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

  states: States[] = [];
  designation: Designation[] = []
  skills: SkillArea[] = []
  selectedOption: string;
  inputValue: string;
  fbexperience!: FormGroup;
  fbfresher!: FormGroup
  faexperienceDetails!: FormArray;
  dialog: boolean = false;
  addfields: any;
  employeeId: any;
  ShowexperienceDetails: boolean = false;

  constructor(private router: Router, private formbuilder: FormBuilder, private route: ActivatedRoute,
    private alertMessage: AlertmessageService, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    this.initDesignations();
    this.initStates();
    this.initSkills();
    this.experienceForm();
    this.selectedOption = 'Fresher';
  }
  experienceForm() {
    this.addfields = []
    this.fbfresher = this.formbuilder.group({
      employeeId: 5,
      workExperienceId: [],
      isAfresher: new FormControl(true, [Validators.required]),
      companyName: new FormControl(''),
      companyLocation: new FormControl(''),
      companyEmployeeId: new FormControl(null),
      stateId: new FormControl(null),
      designationId: new FormControl(null),
      dateOfJoining: new FormControl(null),
      dateOfReliving: new FormControl(null),
      workExperienceXrefs: new FormControl([{ workExperienceXrefId:null, workExperienceId:null , skillAreaId:null }])
    })
    console.log(this.fbfresher.value)
    this.fbexperience = this.formbuilder.group({
      employeeId: 22,
      workExperienceId: [],
      isAfresher: new FormControl(false, [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      companyLocation: new FormControl('', [Validators.required]),
      companyEmployeeId: new FormControl(''),
      stateId: new FormControl('', [Validators.required]),
      designationId: new FormControl('', [Validators.required]),
      dateOfJoining: new FormControl('', [Validators.required]),
      dateOfReliving: new FormControl('', [Validators.required]),
      workExperienceXrefs:  new FormControl([], [Validators.required]),
      experienceDetails: this.formbuilder.array([])
    });
  }
  initStates() {
    this.employeeService.Getstates().subscribe((resp) => {
      this.states = resp as unknown as States[];
    })
  }
  initSkills() {
    this.employeeService.GetSkillArea().subscribe((resp) => {
      this.skills = resp as unknown as SkillArea[];
    })
  }
  initDesignations() {
    this.employeeService.GetDesignation().subscribe((resp) => {
      this.designation = resp as unknown as Designation[];
    })
  }
  generaterow(experienceDetails: ExperienceDetailsDto = new ExperienceDetailsDto()): FormGroup {
    const formGroup = this.formbuilder.group({
      employeeId: new FormControl({ value: 22, disabled: true }),
      workExperienceId: new FormControl({ value: experienceDetails.workExperienceId, disabled: true }),
      isAfresher: new FormControl({ value: false, disabled: true }),
      companyName: new FormControl({ value: experienceDetails.companyName, disabled: true }),
      companyLocation: new FormControl({ value: experienceDetails.companyLocation, disabled: true }),
      companyEmployeeId: new FormControl({ value: experienceDetails.companyEmployeeId, disabled: true }),
      stateId: new FormControl({ value: experienceDetails.stateId, disabled: true }),
      designationId: new FormControl({ value: experienceDetails.designationId, disabled: true }),
      dateOfJoining: new FormControl({ value: experienceDetails.dateOfJoining, disabled: true }),
      dateOfReliving: new FormControl({ value: experienceDetails.dateOfReliving, disabled: true }),
      workExperienceXrefs: new FormControl({ value: experienceDetails.workExperienceXrefs, disabled: true }),
    });
    return formGroup;
  }
  addexperienceDetails() {
    if (this.fbexperience.invalid) {
      return;
    }
  
    else {
      // Push current values into the FormArray
      this.faExperienceDetail().push(this.generaterow(this.fbexperience.getRawValue()));
      // Reset form controls for the next entry
      this.fbexperience.patchValue({
        employeeId: 22,
        workExperienceId: null,
        companyName: '',
        companyLocation: '',
        companyEmployeeId: null,
        stateId: '',
        designationId: '',
        dateOfJoining: '',
        dateOfReliving: '',
        workExperienceXrefs: ''
      });
      // Clear validation errors
      this.fbexperience.markAsPristine();
      this.fbexperience.markAsUntouched();

    }
  }
  faExperienceDetail(): FormArray {
    return this.fbexperience.get('experienceDetails') as FormArray
  }
  onSelectState(e) {
    this.fbexperience.get('stateId')?.setValue(e.value.lookupDetailId);
  }
  onSelectDesignation(e) {
    this.fbexperience.get('designationId')?.setValue(e.value.lookupDetailId);
  }
  onSelectSkill(e) {
    let CurrentArray=e.value; 
    let  updatedArray=[];
    for (let i = 0; i < CurrentArray.length; i++) {
       updatedArray.push({ workExperienceXrefId: 0, workExperienceId: 0, skillAreaId:CurrentArray[i].lookupDetailId  })
    }
    this.fbexperience.get('workExperienceXrefs')?.setValue(updatedArray);
  }
  saveExperience(): Observable<HttpEvent<any>> {
    if (this.selectedOption == 'Experience')    
      return this.employeeService.CreateExperience(this.fbexperience.get('experienceDetails').value);
    
    else{
      return this.employeeService.CreateExperience([this.fbfresher.value]);
    }

     
  }
  onSubmit() {
    this.saveExperience().subscribe(res => {
      this.experienceForm();
      if (res) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SED001"]);
        this.navigateToNext()
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["SED002"]);
      }
    });
  }


  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/educationdetails'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/addressdetails'])
  }
}
