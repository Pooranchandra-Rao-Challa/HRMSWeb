import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaxLength } from 'src/app/_models/common';
import { MAX_LENGTH_20, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_EMAIL } from 'src/app/_shared/regex';


interface General {
  name: string;
  code: string;
}

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  // styleUrls: ['./basic-details.component.scss']
})
export class BasicDetailsComponent implements OnInit {

  genders: General[] | undefined;
  MaritalStatus: General[] | undefined;
  fbbasicDetails: FormGroup;
  imageSize: any;
  selectedFileBase64: string | null = null; // To store the selected file as base64
  maxLength: MaxLength = new MaxLength();

  constructor(private router: Router, private route: ActivatedRoute, private formbuilder: FormBuilder) { }

  ngOnInit() {
    this.basicDetailsForm();
    this.genders = [
      { name: 'Male', code: 'M' },
      { name: 'Female', code: 'F' }
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
      employeeId:new FormControl(null,Validators.required),
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      middleName: new FormControl('',[Validators.minLength(MIN_LENGTH_2)]),
      lastName: new FormControl('', [Validators.required]),
      userId:new FormControl(null,Validators.required),
      gender: new FormControl('', [Validators.required]),
      bloodGroupId: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
      alternateMobileNumber: new FormControl('',[Validators.minLength(MIN_LENGTH_2)]),
      originalDob: new FormControl('',[Validators.required]),
      certificateDob: new FormControl('',[Validators.required]),
      emailId: new FormControl('', [Validators.required, Validators.pattern(RG_EMAIL)]),
      isActive: new FormControl('', [Validators.required]),
      photo: [],
      signDate:new FormControl(null,Validators.required)
    });
  }
  get FormControls() {
    return this.fbbasicDetails.controls;
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
    this.router.navigate(['employee/onboardingemployee/educationdetails']);
  }
}
