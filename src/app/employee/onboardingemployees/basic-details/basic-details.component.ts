import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { LookupViewDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { EmployeeBasicDetailDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MAX_LENGTH_20, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_EMAIL, RG_PHONE_NO } from 'src/app/_shared/regex';


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
  basicDetails: EmployeeBasicDetailDto[];
  bloodgroups: LookupViewDto[] = [];
  employeeId:any;
  constructor(private router: Router,private route: ActivatedRoute, private employeeService: EmployeeService, private formbuilder: FormBuilder, private lookupService: LookupService, private alertMessage: AlertmessageService) { }

  ngOnInit() {
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
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });

  }
  basicDetailsForm() {
    this.fbbasicDetails = this.formbuilder.group({
      employeeId: [0],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2)]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      middleName: new FormControl('', [Validators.minLength(MIN_LENGTH_2)]),
      lastName: new FormControl('', [Validators.required,Validators.minLength(MIN_LENGTH_2)]),
      userId: [null],
      gender: new FormControl('', [Validators.required]),
      bloodGroupId: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required,Validators.pattern(RG_PHONE_NO)]),
      alternateMobileNumber: new FormControl('', [ Validators.pattern(RG_PHONE_NO)]),
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
  savebasicDetails(): Observable<HttpEvent<EmployeeBasicDetailDto>> {
    return this.employeeService.CreateBasicDetails(this.fbbasicDetails.value)
  }
  onSubmit() {
    if (this.fbbasicDetails.valid) {
      if (this.addFlag) {
        this.save();
      }
    } else {
      this.fbbasicDetails.markAllAsTouched();
    }
  }
  save() {
    if (this.fbbasicDetails.valid) {
      this.savebasicDetails().subscribe(resp => {
        console.log(resp);
        this.employeeId=resp;
        this.fbbasicDetails.disable();
        this.navigateToNext()
      })
    }
    else {
      this.fbbasicDetails.markAllAsTouched();
    }
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
