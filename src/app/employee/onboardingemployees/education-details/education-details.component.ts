import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { LookupDetailsDto } from 'src/app/_models/admin';
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
  addeducationdetailsshowForm: boolean = false;
  fbEducationDetails!: FormGroup;
  selectedYear: Date;
  ShoweducationDetails: boolean = true;
  employeeId: any;
  maxLength: MaxLength = new MaxLength();
  country: LookupDetailsDto[] = [];
  states: LookupDetailsDto[] = [];
  circulum: LookupDetailsDto[] = [];
  stream: LookupDetailsDto[] = [];
  gradingMethod: LookupDetailsDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  addFlag: boolean = true;
  circulums: LookupDetailsDto = new LookupDetailsDto();
  STREAM?: String;
  empEduDetails: EducationDetailsDto[] = [];
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
    this.educationForm();
    this.initCirculum();
    this.initCountry();
    this.initGrading();
    this.getEmpEducaitonDetails();
  }
  headers: ITableHeader[] = [
    { field: 'authorityName', header: 'authorityName', label: 'Authority Name' },
    { field: 'stateId', header: 'stateId', label: 'State' },
    { field: 'institutionName', header: 'institutionName', label: 'Institution Name' },
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
      this.circulum = resp as unknown as LookupDetailsDto[];
    });
  }
  initGrading() {
    this.lookupService.GradingMethods().subscribe((resp) => {
      this.gradingMethod = resp as unknown as LookupDetailsDto[];
    });
  }
  initCountry() {
    this.lookupService.Country().subscribe((resp) => {
      this.country = resp as unknown as LookupDetailsDto[];
    })
  }
  getStatesByCountryId(id: number) {
    this.lookupService.getStates(id).subscribe((resp) => {
      if (resp) {
        this.states = resp as unknown as LookupDetailsDto[];
      }
    })
  }
  getStreamByCirculumId(Id: number) {
    this.lookupService.Stream(Id).subscribe((resp) => {
      if (resp) {
        this.stream = resp as unknown as LookupDetailsDto[];
      }
    });
  }
  addEducationDetails() {
    let eduDetailId = this.fbEducationDetails.get('educationDetailId').value
    if (eduDetailId == null) {
      this.faEducationDetail().push(this.generaterow(this.fbEducationDetails.getRawValue()));
      for (let item of this.fbEducationDetails.get('educationDetails').value) {
        let stateName =this.states.filter(x => x.lookupDetailId == item.stateId);
        item.state = stateName[0].name
       let streamName =this.stream.filter(x => x.lookupDetailId == item.streamId);
        item.stream = streamName[0].name
        let gradeName =this.gradingMethod.filter(x => x.lookupDetailId == item.gradingMethodId);
        item.gradingMethod = gradeName[0].name;
        this.empEduDetails.push(item)
      }
      this.clearForm();
      this.addFlag = true;
    }
    else {
      this.addFlag= false;
      this.onSubmit();
    }
    this.addeducationdetailsshowForm = !this.addeducationdetailsshowForm;
    this.ShoweducationDetails = !this.ShoweducationDetails;
  }
  getEmpEducaitonDetails() {
    return this.employeeService.GetEducationDetails(this.employeeId).subscribe((data) => {
      this.empEduDetails = data as unknown as EducationDetailsDto[];
          console.log(data)
    })
  }
  faEducationDetail(): FormArray {
    return this.fbEducationDetails.get('educationDetails') as FormArray
  }
  generaterow(educationDetails: EducationDetailsDto = new EducationDetailsDto()): FormGroup {
    const formGroup = this.formbuilder.group({
      educationDetailId: educationDetails.educationDetailId,
      employeeId: educationDetails.employeeId,
      streamId: educationDetails.streamId,
      stateId: educationDetails.stateId,
      institutionName: educationDetails.institutionName,
      authorityName: educationDetails.authorityName,
      passedOutyear: educationDetails.passedOutyear,
      gradingMethodId: educationDetails.gradingMethodId,
      gradingValue: educationDetails.gradingValue,
    });
    return formGroup;
  }
  editEducationDetails(educationDetails) {
    this.getStatesByCountryId(educationDetails.countryId);
    this.getStreamByCirculumId(educationDetails.curriculumId);
    this.fbEducationDetails.patchValue({
      educationDetailId: educationDetails.educationDetailId,
      employeeId: educationDetails.employeeId,
      circulumId: educationDetails.curriculumId,
      streamId: educationDetails.streamId,
      countryId: educationDetails.countryId,
      stateId: educationDetails.stateId,
      institutionName: educationDetails.institutionName,
      authorityName: educationDetails.authorityName,
      passedOutyear: FORMAT_DATE(new Date(educationDetails.passedOutyear)),
      gradingMethodId: educationDetails.gradingMethodId,
      gradingValue: educationDetails.gradingValue
    });
    this.addeducationdetailsshowForm = !this.addeducationdetailsshowForm;
    this.ShoweducationDetails = !this.ShoweducationDetails;
  }
  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }
  removeRow(index: number): void {
    if (index >= 0 && index < this.empEduDetails.length) {
      this.empEduDetails.splice(index, 1); // Remove 1 item at the specified index
    }
  }
  clearForm() {
    this.fbEducationDetails.reset();
  }
  saveeducationDetails(): Observable<HttpEvent<EducationDetailsDto[]>> {
    if (this.addFlag) {
      return this.employeeService.CreateEducationDetails(this.empEduDetails);
    } else
      return this.employeeService.CreateEducationDetails([this.fbEducationDetails.value]);
  }
  onSubmit() {
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
  toggleTab() {
    this.addeducationdetailsshowForm = !this.addeducationdetailsshowForm;
    this.ShoweducationDetails = !this.ShoweducationDetails;
  }

}