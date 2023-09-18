import { HttpEvent } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { MaxLength } from 'src/app/_models/common';
import { Designation, ExperienceDetailsDto, SkillArea, States, skillArea } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { MAX_LENGTH_20, MAX_LENGTH_50, MIN_LENGTH_2 } from 'src/app/_shared/regex';


@Component({
  selector: 'app-experience-details',
  templateUrl: './experience-details.component.html'
  // styleUrls: ['./experience-details.component.scss']
})

export class ExperienceDetailsComponent {
  mediumDate: string = MEDIUM_DATE;
  states: States[] = [];
  designation: Designation[] = []
  skills: SkillArea[] = []
  selectedOption: string;
  maxLength: MaxLength = new MaxLength();
  viewSelectedSkills:skillArea[]=[];
  fbexperience!: FormGroup;
  fbfresher!: FormGroup
  faexperienceDetails!: FormArray;
  dialog: boolean = false;
  addfields: any;
  employeeId: any;
  @ViewChild('multiSelect') multiSelect: any;

  constructor(private router: Router, private formbuilder: FormBuilder, private route: ActivatedRoute,
    private alertMessage: AlertmessageService, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    this.initDesignations();
    this.initStates();
    this.initSkills();
    this.fresherForm();
    this.experienceForm();
    this.selectedOption = 'Fresher';
  }
  fresherForm(){
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
    });
  }
  experienceForm() {
    this.fbexperience = this.formbuilder.group({
      employeeId: 22,
      workExperienceId: [],
      isAfresher: new FormControl(false, [Validators.required]),
      companyName: new FormControl('', [Validators.required,Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      companyLocation: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      companyEmployeeId: new FormControl(null, [ Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      stateId: new FormControl(null, [Validators.required]),
      designationId: new FormControl(null, [Validators.required]),
      dateOfJoining: new FormControl(null, [Validators.required]),
      dateOfReliving: new FormControl(null, [Validators.required]),
      skills:new FormControl(null, [Validators.required]),
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
      console.log(this.designation)
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
  get FormControls() {
    return this.fbexperience.controls;
  }
  onSelectSkill(e) {
    this.viewSelectedSkills=e.value
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
  isMultiSelectValid(): boolean {
    return this.multiSelect && this.multiSelect.invalid && this.multiSelect.touched;
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
