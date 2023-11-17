import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PhotoFileProperties } from 'src/app/_models/common';
import { ValidateFileThenUpload } from 'src/app/_validators/upload.validators';

@Component({
  selector: 'app-applicant.dialog',
  templateUrl: './applicant.dialog.component.html',
  styles: [
  ]
})
export class ApplicantDialogComponent {
  fbApplicant!: FormGroup;
  @ViewChild("fileUpload", { static: true }) fileUpload: ElementRef;
  messageDisplayed: boolean = false;
  empUploadDetails: { fileBlob: Blob, title: string, fileName: string }[] = [];
  @Output() ImageValidator = new EventEmitter<PhotoFileProperties>();
  fileTypes: string = ".pdf, .jpg, .jpeg, .png, .gif"

  constructor(private formbuilder: FormBuilder,) { }

  ngOnInit() {
    this.applicantForm();
  }

  applicantForm() {
    this.fbApplicant = this.formbuilder.group({
      applicantId: [null],
      name: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required]),
      nationality: new FormControl('', [Validators.required]),
      addressLine1: new FormControl('', [Validators.required]),
      addressLine2: new FormControl(''),
      landmark: new FormControl(''),
      zipCode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      stateId: new FormControl('', [Validators.required]),
      addressType: new FormControl(''),
      resumeUrl: new FormControl(''),
      isFresher: [true],
      isActive: [true],
      education: this.formbuilder.group({
        educaitonId: [null],
        streamId:[null],
        stateId: [null],
        institutionName: new FormControl(''),
        authorityName: new FormControl('', [Validators.required]),
        yearOfCompletion: new FormControl('', [Validators.required]),
        gradingMethodId: new FormControl('', [Validators.required]),
        gradingValue: new FormControl('', [Validators.required]),
      }),
      certification: this.formbuilder.group({
        certificationId: [null],
        applicantId: new FormControl('', [Validators.required]),
        certificateId: new FormControl('', [Validators.required]),
        institutionName: new FormControl('', [Validators.required]),
        yearOfCompletion: new FormControl(''),
        results: new FormControl('', [Validators.required]),
      }),
      experience: this.formbuilder.group({
        experienceId: [null],
        applicantId: [null],
        companyName: new FormControl('', [Validators.required]),
        companyLocation: new FormControl(''),
        stateId: [null],
        companyEmployeeId: new FormControl(''),
        designationId: new FormControl('', [Validators.required]),
        natureOfWork: new FormControl(''),
        workedOnProjects: new FormControl(''),
        dateOfJoining: new FormControl(''),
        dateOfReliving: new FormControl(''),
      }),
      applicationSkills: this.formbuilder.group({
        applicationskillId: [null],
        applicantId: new FormControl('', [Validators.required]),
        skillId: new FormControl('', [Validators.required]),
        expertise: new FormControl('')
      }),
      applicantLanguageSkills: this.formbuilder.group({
        applicaitonLanguageSkillId: [null],
        applicantId: [null],
        languageId: [null],
        canRead: [true],
        canWrite: [true],
        canSpeak: [true],
      }),
    });
  }

  onClick() {
    this.messageDisplayed = false;
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      if (this.empUploadDetails.length <= 4) {
        if (this.fbApplicant.valid) {
          for (let index = 0; index < fileUpload.files.length; index++) {
            const file = fileUpload.files[index];
            ValidateFileThenUpload(file, this.ImageValidator);
          }
        }
        else
          this.fbApplicant.markAllAsTouched();
      }
    }
    this.fileUpload.nativeElement.value = '';
  }
}
