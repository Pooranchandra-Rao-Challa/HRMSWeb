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
  country: LookupViewDto[] = [];
  states: LookupViewDto[] = [];
  circulum: LookupViewDto[] = [];
  stream: LookupViewDto[] = [];
  gradingMethods: LookupViewDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  addFlag: boolean = true;
  circulums: LookupViewDto = new LookupViewDto();
  STREAM?: String;
  faeducationDetails !: FormArray;
  empEduDetails = new EducationDetailsDto();
  constructor(private formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    private alertMessage: AlertmessageService) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    console.log(this.employeeId);
    this.educationForm();
    this.initCirculum();
    this.initCountry();
    this.initGrading();
    this.addEducationDetails();
    this.getEmpEducaitonDetails();

  }
  headers: ITableHeader[] = [
    { field: 'authorityName', header: 'authorityName', label: 'Authority Name' },
    { field: 'stateId', header: 'stateId', label: 'State' },
    { field: 'institutionName', header: 'institutionName', label: 'Institution Name' },
    { field: 'circulumId', header: 'circulumId', label: 'Circulum' },
    { field: 'streamId', header: 'streamId', label: 'Stream' },
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
      countryId: new FormControl(null, [Validators.required]),
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
  initCountry() {
    this.lookupService.Country().subscribe((resp) => {
      this.country = resp as unknown as LookupViewDto[];
    })
  }
  getStatesByCountryId(id: number) {
    this.lookupService.getStates(id).subscribe((resp) => {
      if (resp) {
        this.states = resp as unknown as LookupViewDto[];
      }
    })
  }
  getStreamByCirculumId(Id: number) {
    this.lookupService.Stream(Id).subscribe((resp) => {
      if (resp) {
        this.stream = resp as unknown as LookupViewDto[];
      }
    });
  }
  getEmpEducaitonDetails() {
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
  removeRow(index: number): void {
    if (index >= 0 && index < this.educationDetails.length) {
      this.educationDetails.splice(index, 1); // Remove 1 item at the specified index
    }
  }
  addEducationDetails() {
    if (this.fbEducationDetails.valid) {
      const educationData = this.fbEducationDetails.value;
      this.educationDetails.push(educationData);  
      console.log(educationData);
      this.clearForm();
      this.addFlag = false;

    }
  }
  clearForm() {
    this.fbEducationDetails.reset();
  }
  saveeducationDetails(): Observable<HttpEvent<EducationDetailsDto[]>> {
    return this.employeeService.CreateEducationDetails(this.educationDetails);
  }
  onSubmit() {
    debugger
    this.saveeducationDetails().subscribe(resp => {
      if (resp) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SFD001"]);
      }
      else {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SFD002"]);
      }
      this.navigateToNext();
    })

  }
  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/basicdetailsbyId', this.employeeId])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/experiencedetails', this.employeeId])
  }

}