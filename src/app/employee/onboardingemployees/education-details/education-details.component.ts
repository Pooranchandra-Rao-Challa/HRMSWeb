import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EditableColumn } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
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
  ShoweducationDetails: boolean = false;
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
  STREAM?:String;
  constructor(private formbuilder: FormBuilder,
     private router: Router, 
     private route: ActivatedRoute,
      private lookupService: LookupService, 
      private employeeService: EmployeeService,
      private alertMessage:AlertmessageService) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    console.log(this.employeeId)

    this.educationForm();
    this.initStates();
    this.initCirculum();
    this.initGrading();
    this.addEducationDetails();
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
      employeeId: [22],
      circulumId: new FormControl(null, [Validators.required]),
      streamId: new FormControl(null, [Validators.required]),
      stateId: new FormControl(null, [Validators.required]),
      institutionName: new FormControl(''),
      authorityName: new FormControl('', [Validators.required]),
      passedOutyear: new FormControl('', [Validators.required]),
      gradingMethodId: new FormControl('', [Validators.required]),
      gradingValue: new FormControl('', [Validators.required])
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
  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }
  generaterow(educationDetails: EducationDetailsDto = new EducationDetailsDto()): FormGroup {
    return this.formbuilder.group({
      educationDetailId: new FormControl({ value: educationDetails.educationDetailId, disabled: true }),
      employeeId: new FormControl({ value: educationDetails.employeeId, disabled: true }),
      circulumId: new FormControl({ value: educationDetails.streamId, disabled: true }),
      streamId: new FormControl({ value: educationDetails.streamId, disabled: true }),
      stateId: new FormControl({ value: educationDetails.stateId, disabled: true }),
      institutionName: new FormControl({ value: educationDetails.institutionName, disabled: true }),
      authorityName: new FormControl({ value: educationDetails.authorityName, disabled: true }),
      passedOutyear: new FormControl({ value: educationDetails.passedOutyear, disabled: true }),
      gradingMethodId: new FormControl({ value: educationDetails.gradingMethodId, disabled: true }),
      gradingValue: new FormControl({ value: educationDetails.gradingValue, disabled: true })
    });
  }
  addEducationDetails() {
    if (this.fbEducationDetails.valid) {
      const educationData = this.fbEducationDetails.value;
      this.educationDetails.push(educationData);
      this.clearForm();
      this.ShoweducationDetails = true;
    }
  }
  clearForm() {
    this.fbEducationDetails.reset();
  }
  saveeducationDetails(): Observable<HttpEvent<EducationDetailsDto[]>> {
    return this.employeeService.CreateEducationDetails(this.educationDetails);
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
    this.router.navigate(['employee/onboardingemployee/basicdetails'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/experiencedetails'])
  }

}