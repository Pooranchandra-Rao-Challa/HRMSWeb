import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EditableColumn } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { LookupViewDto } from 'src/app/_models/admin';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { EducationDetailsDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-education-details',
  templateUrl: './education-details.component.html',
  // styleUrls: ['./education-details.component.scss']
})
export class EducationDetailsComponent implements OnInit {
  showDialog: boolean = false;
  fbEducationDetails!: FormGroup;
  selectedYear: Date;
  ShoweducationDetails: boolean = true;
  educationDetails: EducationDetailsDto[] = [];
  employeeId: any;
  maxLength: MaxLength = new MaxLength();
  states: LookupViewDto[] = [];
  circulum: LookupViewDto[] = [];
  stream: LookupViewDto[] = [];
  gradingMethods: LookupViewDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  addFlag: boolean = true;
  circulums: LookupViewDto = new LookupViewDto();
  STREAM?: String;
  faeducationDetails !:FormArray;
  empEduDetails = new EducationDetailsDto();
  constructor(private formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    private alertMessage: AlertmessageService) { }
  ngOnInit() {
    debugger
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    console.log(this.employeeId);
    this.educationForm();
    this.initStates();
    this.initCirculum();
    this.initGrading();
    this.addEducationDetails();
    this.getEmpEducaitonDetails();

  }
  headers: ITableHeader[] = [
    { field: 'institutionName', header: 'institutionName', label: 'Institution Name' },
    { field: 'authorityName', header: 'authorityName', label: 'Authority Name' },
    { field: 'circulumId', header: 'circulumId', label: 'Circulum' },
    { field: 'streamId', header: 'streamId', label: 'Stream' },
    { field: 'stateId', header: 'stateId', label: 'State' },
    { field: 'passedOutyear', header: 'passedOutyear', label: 'Passed Out Year' },
    { field: 'gradingMethodId', header: 'gradingMethodId', label: 'Grading System' },
    { field: 'gradingValue', header: 'gradingValue', label: 'CGPA/Percentage System' }
  ];
  educationForm() {
    this.fbEducationDetails = this.formbuilder.group({
      educationDetailId: [null],
      employeeId: this.employeeId,
      circulumId: new FormControl(null, [Validators.required]),
      streamId: new FormControl(null, [Validators.required]),
      stateId: new FormControl(null, [Validators.required]),
      institutionName: new FormControl(''),
      authorityName: new FormControl('', [Validators.required]),
      passedOutyear: new FormControl('', [Validators.required]),
      gradingMethodId: new FormControl('', [Validators.required]),
      gradingValue: new FormControl('', [Validators.required]),
      educationDetails: this.formbuilder.array([])
    });
  }
  get FormControls() {
    return this.fbEducationDetails.controls;
  }
  initCirculum() {
    this.lookupService.Circulum().subscribe((resp) => {
      this.circulum = resp as unknown as LookupViewDto[];
    });
  }
  initGrading() {
    this.lookupService.GradingMethods().subscribe((resp) => {
      this.gradingMethods = resp as unknown as LookupViewDto[];
    });
  }
  initStates() {
    this.lookupService.getStates().subscribe((resp) => {
      this.states = resp as unknown as LookupViewDto[];
    });
  }
  getStreamByCirculumId(Id: number) {
    this.lookupService.Stream(Id).subscribe((resp) => {
      if (resp) {
        this.stream = resp as unknown as LookupViewDto[];
      }
    });
  }
  formArrayControls(i: number, formControlName: string) {
    return this.faEducationDetail().controls[i].get(formControlName);
  }
  faEducationDetail(): FormArray {
    return this.fbEducationDetails.get('educationDetails') as FormArray
  }
  getEmpEducaitonDetails() {
    debugger
    return this.employeeService.GetEducationDetails(this.employeeId).subscribe((data) => {
      this.empEduDetails = data as EducationDetailsDto;
      console.log(data);
      this.editEducationDetails(this.empEduDetails);
    })
  }
  editEducationDetails(empEduDetails) {
    this.addFlag = false;
    this.educationDetails = empEduDetails;
  }
  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }
  generaterow(educationDetails: EducationDetailsDto = new EducationDetailsDto()): FormGroup {
    return this.formbuilder.group({
      educationDetailId: new FormControl(educationDetails.educationDetailId),
      employeeId: new FormControl(educationDetails.employeeId),
      circulumId: new FormControl(educationDetails.streamId),
      streamId: new FormControl(educationDetails.streamId),
      stateId: new FormControl(educationDetails.stateId),
      institutionName: new FormControl(educationDetails.institutionName),
      authorityName: new FormControl(educationDetails.authorityName),
      passedOutyear: new FormControl(educationDetails.passedOutyear),
      gradingMethodId: new FormControl(educationDetails.gradingMethodId),
      gradingValue: new FormControl(educationDetails.gradingValue)
    });
  }
  addEducationDetails() {
    if (this.fbEducationDetails.valid) {
      const educationData = this.fbEducationDetails.value;
      this.educationDetails.push(educationData);

      this.faeducationDetails = this.fbEducationDetails.get("educationDetails") as FormArray
      this.faeducationDetails.push(this.generaterow())      
      // console.log(educationData);
      this.clearForm();
      this.ShoweducationDetails = true;
    }
  }
  clearForm() {
    this.fbEducationDetails.reset();
  }
  saveeducationDetails(): Observable<HttpEvent<EducationDetailsDto[]>> {
    if (this.employeeId == null) {
      return this.employeeService.CreateEducationDetails(this.educationDetails);
    }
    else return this.employeeService.updateViewEmpEduDtls(this.educationDetails);
  }
  onSubmit() {
    if (this.addFlag) {
      this.save();
    }
    else {
      this.fbEducationDetails.markAllAsTouched();
    }
  }
  save() {
    this.saveeducationDetails().subscribe(resp => {
      if (resp) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SFD001"]);
      }
      else {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SFD002"]);
      }
      // this.navigateToNext();
    })

  }
  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/basicdetailsbyId', this.employeeId])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/experiencedetails'])
  }

}