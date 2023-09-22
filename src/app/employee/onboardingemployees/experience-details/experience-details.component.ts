import { HttpEvent } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { LookupViewDto } from 'src/app/_models/admin';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { ExperienceDetailsDto} from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MAX_LENGTH_20, MAX_LENGTH_50, MIN_LENGTH_2 } from 'src/app/_shared/regex';


@Component({
  selector: 'app-experience-details',
  templateUrl: './experience-details.component.html'
  // styleUrls: ['./experience-details.component.scss']
})

export class ExperienceDetailsComponent {
  mediumDate: string = MEDIUM_DATE;
  countries: LookupViewDto[]=[];
  states: LookupViewDto[] = [];
  designation: LookupViewDto[] = []
  skills: LookupViewDto[] = []
  selectedOption: string;
  maxLength: MaxLength = new MaxLength();
  viewSelectedSkills=[];  
  addFlag:boolean=true;
  fbexperience!: FormGroup;
  fbfresher!: FormGroup
  faexperienceDetails!: FormArray;
  dialog: boolean = false;
  permissions: any;
  employeeId: any;
  skillAreaNames: string ;
  @ViewChild('multiSelect') multiSelect: any;
  empExperienceDetails:any=[];

  constructor(private router: Router, private formbuilder: FormBuilder, private route: ActivatedRoute,private jwtService: JwtService,
    private alertMessage: AlertmessageService, private employeeService: EmployeeService,private lookupService:LookupService) { }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    this.initDesignations();
    this.initCountries();
    this.initSkills();
    this.fresherForm();
    this.experienceForm();
   
    this.selectedOption = 'Fresher';
    if(this.employeeId)
    this.getEmpExperienceDetails();
  }
  fresherForm(){
    this.fbfresher = this.formbuilder.group({
      employeeId: this.employeeId,
      workExperienceId: [],
      isAfresher: new FormControl(true, [Validators.required]),
      companyName: new FormControl(''),
      companyLocation: new FormControl(''),
      companyEmployeeId: new FormControl(null),
      stateId: new FormControl(null),
      designationId: new FormControl(null),
      dateOfJoining: new FormControl(null),
      dateOfReliving: new FormControl(null),
      workExperienceXrefs: new FormControl()
    });
  }
  removeItem(index: number): void {
    this.empExperienceDetails.splice(index, 1);
  }
  experienceForm() {
    this.fbexperience = this.formbuilder.group({
      employeeId: this.employeeId,
      workExperienceId: [],
      isAfresher: new FormControl(false, [Validators.required]),
      companyName: new FormControl('', [Validators.required,Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      companyLocation: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      companyEmployeeId: new FormControl(null, [ Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      countryId:new FormControl(null,[Validators.required]),
      stateId: new FormControl(null, [Validators.required]),
      designationId: new FormControl(null, [Validators.required]),
      dateOfJoining: new FormControl(null, [Validators.required]),
      dateOfReliving: new FormControl(null, [Validators.required]),
      skills:new FormControl(null, [Validators.required]),
      workExperienceXrefs: new FormControl([{ workExperienceXrefId:null, workExperienceId:null , skillAreaId:null }]),
      experienceDetails: this.formbuilder.array([])
    });
  }
  initCountries() {
    this.lookupService.Country().subscribe((resp) => {
      this.countries = resp as unknown as LookupViewDto[];
    })
  }
  getStatesByCountryId(id: number) {
    this.lookupService.getStates(id).subscribe((resp) => {
      if (resp) {
        this.states = resp as unknown as LookupViewDto[];
      }
    })
  }
  initSkills() {
    this.lookupService.GetSkillArea().subscribe((resp) => {
      this.skills = resp as unknown as LookupViewDto[];
    })
  }
  initDesignations() {
    this.lookupService.GetDesignation().subscribe((resp) => {
      this.designation = resp as unknown as LookupViewDto[];
      console.log(this.designation)
    })
  }
  generaterow(experienceDetails: ExperienceDetailsDto = new ExperienceDetailsDto()): FormGroup {
    const formGroup = this.formbuilder.group({
      employeeId: new FormControl({ value: experienceDetails.employeeId, disabled: true }),
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
  headers: ITableHeader[] = [
    { field: 'companyName', header: 'companyName', label: 'CompanyName' },
    { field: 'companyLocation', header: 'companyLocation', label: 'Location' },
    { field: 'companyEmployeeId', header: 'companyEmployeeId', label: 'EmpId' },
    { field: 'stateId', header: 'stateId', label: 'State' },
    { field: 'designationId', header: 'designationId', label: 'Designation' },
    { field: 'dateOfJoining', header: 'dateOfJoining', label: 'DateOfJoining' },
    { field: 'dateOfReliving', header: 'dateOfReliving', label: 'DateOfReliving' },
    { field: 'workExperienceXrefs', header: 'workExperienceXrefs', label: 'SkillArea' }
  ];
  addexperienceDetails() {
    if (this.fbexperience.invalid) {
      return;
    }
    else {
      this.fbexperience.value
      // Push current values into the FormArray
      this.faExperienceDetail().push(this.generaterow(this.fbexperience.getRawValue()));
     
      for (let item of this.fbexperience.get('experienceDetails').value) 
        this.empExperienceDetails.push(item)
      // Reset form controls for the next entry
      this.fbexperience.patchValue({
        employeeId: this.employeeId,
        workExperienceId: null,
        companyName: '',
        companyLocation: '',
        companyEmployeeId: null,
        stateId: '',
        countryId:'',
        skills:'',
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
    let CurrentArray=e.value; 
    let  updatedArray=[];
    for (let i = 0; i < CurrentArray.length; i++) {
       updatedArray.push({ workExperienceXrefId: 0, workExperienceId: 0, skillAreaId:CurrentArray[i]  })
       this.viewSelectedSkills.push(e.value.skillAreaNames)
    }
    this.fbexperience.get('workExperienceXrefs')?.setValue(updatedArray);
  }
  editForm(experienceDetail){
    this.addFlag=false;
    this.getStatesByCountryId(experienceDetail.countryId)
    this.fbexperience.patchValue({
      employeeId: experienceDetail.employeeId,
      workExperienceId: experienceDetail.workExperienceId,
      companyName: experienceDetail.companyName,
      companyLocation: experienceDetail.companyLocation,
      companyEmployeeId:experienceDetail.companyEmployeeId,
      stateId:experienceDetail.stateId,
      designationId:experienceDetail.designationId,
      dateOfJoining:FORMAT_DATE(new Date(experienceDetail.dateOfJoining)) ,
      dateOfReliving:FORMAT_DATE(new Date(experienceDetail.dateOfReliving))
    });
    this.getSkillAreas(experienceDetail.skillAreaIds)
  }
  getSkillAreas(skill){
    const selectedOptions = this.skills.filter(option => skill.includes(option.lookupDetails));
    this.fbexperience.get('skills').patchValue(selectedOptions);
    console.log(this.fbexperience.get('skills').value)
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

  getEmpExperienceDetails(){
    this.employeeService.GetWorkExperience(this.employeeId).subscribe((data) => {
      this.empExperienceDetails = data ;
      if(this.empExperienceDetails.length>0)
       this.selectedOption = 'Experience';
    })
  }
  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/educationdetails',this.employeeId])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/addressdetails',this.employeeId])
  }
}
