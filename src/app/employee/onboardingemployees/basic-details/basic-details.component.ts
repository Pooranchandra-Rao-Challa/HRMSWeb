import { HttpEvent } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, DebugElement, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { LookupViewDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { EmployeeBasicDetailDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MIN_LENGTH_2, RG_ALPHA_ONLY, RG_EMAIL, RG_PHONE_NO } from 'src/app/_shared/regex';
import { OnboardEmployeeService } from 'src/app/_helpers/view.notificaton.services'


interface General {
  name: string;
  code: string;
}

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
})
export class BasicDetailsComponent implements OnInit {

  genders: General[] | undefined;
  MaritalStatus: General[] | undefined;
  fbbasicDetails: FormGroup;
  imageSize: any;
  selectedFileBase64: string | null = null; // To store the selected file as base64
  maxLength: MaxLength = new MaxLength();
  addFlag: boolean = true;
  empbasicDetails = new EmployeeBasicDetailDto();
  bloodgroups: LookupViewDto[] = [];
  employeeId: any;
  isReadOnly: boolean = false
  constructor(private router: Router, private route: ActivatedRoute,
    private employeeService: EmployeeService, private formbuilder: FormBuilder,
    private lookupService: LookupService, private alertMessage: AlertmessageService,
    private onboardEmployeeService: OnboardEmployeeService) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.employeeId = params['employeeId']
      this.onboardEmployeeService.sendData(this.employeeId);
    });
    if (this.employeeId)
      this.getEmployeeBasedonId();
    this.basicDetailsForm();
    this.initBloodGroups();
    this.genders = [
      { name: 'Male', code: 'male' },
      { name: 'Female', code: 'female' }
    ];
    this.MaritalStatus = [
      { name: 'Single', code: 'single' },
      { name: 'Married', code: 'married' },
      { name: 'Widow', code: 'widow' },
      { name: 'Divorced', code: 'divorced' },
    ];
  }
  basicDetailsForm() {
    this.fbbasicDetails = this.formbuilder.group({
      employeeId: [0],
      code: [null],
      firstName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      middleName: new FormControl('', [Validators.minLength(MIN_LENGTH_2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
      userId: [null],
      gender: new FormControl('', [Validators.required]),
      bloodGroupId: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required, Validators.pattern(RG_PHONE_NO)]),
      alternateMobileNumber: new FormControl('', [Validators.pattern(RG_PHONE_NO)]),
      originalDob: new FormControl('', [Validators.required]),
      certificateDob: new FormControl('', [Validators.required]),
      emailId: new FormControl('', [Validators.required, Validators.pattern(RG_EMAIL)]),
      isActive: new FormControl(true, [Validators.required]),
      photo: [],
      signDate: [null]
    });

  }
  get FormControls() {
    return this.fbbasicDetails.controls;
  }

  initBloodGroups() {
    this.lookupService.BloodGroups().subscribe((resp) => {
      this.bloodgroups = resp as unknown as LookupViewDto[];
    });
  }
  getEmployeeBasedonId() {
    this.employeeService.GetViewEmpPersDtls(this.employeeId).subscribe((resp) => {
      this.empbasicDetails = resp as EmployeeBasicDetailDto;
      this.editBasicDetails(this.empbasicDetails);
    });
  }
  savebasicDetails(): Observable<HttpEvent<EmployeeBasicDetailDto>> {
    if (this.employeeId == null) {
      return this.employeeService.CreateBasicDetails(this.fbbasicDetails.value)
    }
    else return this.employeeService.updateViewEmpPersDtls(this.fbbasicDetails.value)
  }

  save() {
    this.savebasicDetails().subscribe(resp => {
      this.employeeId = resp;
      if (this.employeeId) {
        this.navigateToNext();
        this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SBD001" : "SBD002"]);
        this.onboardEmployeeService.sendData(this.employeeId);
      }

    })
  }
  editBasicDetails(empbasicDetails) {
    this.addFlag = false;
    this.fbbasicDetails.patchValue(
      {
        employeeId: empbasicDetails.employeeId,
        code: empbasicDetails.code,
        firstName: empbasicDetails.firstName,
        middleName: empbasicDetails.middleName,
        lastName: empbasicDetails.lastName,
        userId: empbasicDetails.userId,
        gender: empbasicDetails.gender,
        bloodGroupId: empbasicDetails.bloodGroupId,
        maritalStatus: empbasicDetails.maritalStatus,
        mobileNumber: empbasicDetails.mobileNumber,
        alternateMobileNumber: empbasicDetails.alternateMobileNumber,
        originalDob: FORMAT_DATE(new Date(empbasicDetails.originalDOB)),
        certificateDob: FORMAT_DATE(new Date(empbasicDetails.certificateDOB)),
        emailId: empbasicDetails.emailId,
        isActive: empbasicDetails.isActive,
        photo: empbasicDetails.photo,
        signDate: empbasicDetails.signDate
      }
    );
  }
  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }
  onFileSelect(event: any): void {
    const selectedFile = event.files[0];
    this.imageSize = selectedFile.size;
    if (selectedFile) {
      this.convertFileToBase64(selectedFile, (base64String) => {
        this.selectedFileBase64 = base64String;
        this.fbbasicDetails.get('photo').setValue(this.selectedFileBase64);
      });
    } else {
      this.selectedFileBase64 = null;
    }
  }
  private convertFileToBase64(file: File, callback: (base64String: string) => void): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      callback(base64String);
    };
  }
  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/educationdetails', this.employeeId]);

  }
}
