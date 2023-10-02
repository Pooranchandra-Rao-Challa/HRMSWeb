import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { LookupViewDto } from 'src/app/_models/admin';
import { MaxLength, ViewEmployeeScreen } from 'src/app/_models/common';
import { EmployeeBasicDetailDto, EmployeeBasicDetailViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MIN_LENGTH_2, RG_ALPHA_ONLY, RG_EMAIL, RG_PHONE_NO } from 'src/app/_shared/regex';

interface Gender {
  name: string;
  code: string;
}

export class Status {
  name: string;
  code: string;
}

@Component({
  selector: 'app-basicdetails.dialog',
  templateUrl: './basicdetails.dialog.component.html',
  styles: [
  ]
})
export class BasicdetailsDialogComponent {
  fbEmpBasDtls!: FormGroup;
  imageSize: string;
  selectedFileBase64: string | null = null; // To store the selected file as base64
  genders: Gender[];
  status: Status[];
  maxLength: MaxLength = new MaxLength();
  bloodgroups: LookupViewDto[] = [];
  employeeId: string;

  constructor(
    private formbuilder: FormBuilder,
    private employeeService: EmployeeService,
    private alertMessage: AlertmessageService,
    private lookupService: LookupService,
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private activatedRoute: ActivatedRoute,) {
    this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
  }

  ngOnInit(): void {
    this.empBasicDtlsForm();
    this.staticData();
    this.initBloodGroups();
    if(this.config.data) this.showEmpPersDtlsDialog(this.config.data);
  }

  staticData() {
    this.genders = [
      { name: 'Female', code: 'FM' },
      { name: 'Male', code: 'M' },
    ];
    this.status = [
      { name: 'Married', code: 'DS' },
      { name: 'Un Married', code: 'NS' },
      { name: 'Single', code: 'SN' },
    ];
  }

  initBloodGroups() {
    this.lookupService.BloodGroups().subscribe((resp) => {
      this.bloodgroups = resp as unknown as LookupViewDto[];
    });
  }

  empBasicDtlsForm() {
    this.fbEmpBasDtls = this.formbuilder.group({
      employeeId: (this.employeeId),
      firstName: new FormControl(null, [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      middleName: new FormControl(null, [Validators.minLength(MIN_LENGTH_2)]),
      lastName: new FormControl(null, [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
      code: [null],
      gender: new FormControl(null, [Validators.required]),
      bloodGroupId: new FormControl(null, [Validators.required]),
      maritalStatus: new FormControl(null, [Validators.required]),
      mobileNumber: new FormControl(null, [Validators.required, Validators.pattern(RG_PHONE_NO)]),
      alternateMobileNumber: new FormControl(null, [Validators.pattern(RG_PHONE_NO)]),
      originalDob: new FormControl(null, [Validators.required]),
      certificateDob: new FormControl(null, [Validators.required]),
      emailId: new FormControl(null, [Validators.required, Validators.pattern(RG_EMAIL)]),
      isActive: (''),
      signDate: (''),
      photo: []
    });
  }

  get empBasDtlsFormControls() {
    return this.fbEmpBasDtls.controls;
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
        this.fbEmpBasDtls.get('photo').setValue(this.selectedFileBase64);
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

  showEmpPersDtlsDialog(employeePrsDtls: EmployeeBasicDetailViewDto) {
    var employeePrsDtl = employeePrsDtls as unknown as EmployeeBasicDetailDto;
    employeePrsDtl.originalDob = new Date(employeePrsDtls.originalDOB);
    employeePrsDtl.certificateDob = new Date(employeePrsDtls.certificateDOB);
    employeePrsDtl.isActive = true;
    this.fbEmpBasDtls.patchValue(employeePrsDtl);
  }

  saveEmpBscDtls() {
    this.employeeService.updateViewEmpPersDtls(this.fbEmpBasDtls.value).subscribe((resp) => {
      if (resp) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["EVEBD001"]);
        this.ref.close({
          "UpdatedModal": ViewEmployeeScreen.BasicDetails
      });
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["EVEBD002"]);
      }
    })
  }

}
