import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicantCertificationDto, ApplicantExperienceDto, ApplicantLanguageSkills, ApplicantSkillsDto } from 'src/app/_models/admin';
import { PhotoFileProperties } from 'src/app/_models/common';
import { EducationDetailsDto } from 'src/app/_models/employes';
import { ValidateFileThenUpload } from 'src/app/_validators/upload.validators';


interface General {
  name: string;
  code: string;
}

@Component({
  selector: 'app-applicant.dialog',
  templateUrl: './applicant.dialog.component.html',
  styles: [
  ]
})
export class ApplicantDialogComponent {
  fbApplicant!: FormGroup;
  faapplicantEducationDetails!: FormArray;
  faapplicantCertificationDetails!: FormArray;
  faapplicantExperienceDetails!: FormArray;
  faapplicantSkillsDetails!: FormArray;
  faapplicantLanguageSkillsDetails!: FormArray;

  genders: General[] | undefined;
  @ViewChild("fileUpload", { static: true }) fileUpload: ElementRef;
  messageDisplayed: boolean = false;
  empUploadDetails: { fileBlob: Blob, title: string, fileName: string }[] = [];
  @Output() ImageValidator = new EventEmitter<PhotoFileProperties>();
  fileTypes: string = ".pdf, .jpg, .jpeg, .png, .gif"
  selectedFileName: string;
  defaultPhoto: string;
  yourRating: number = 0;

  constructor(private formbuilder: FormBuilder,) { }

  ngOnInit() {
    this.applicantForm();
    this.genders = [
      { name: 'Male', code: 'male' },
      { name: 'Female', code: 'female' }
    ];
    this.defaultPhoto = /^female$/gi.test(this.fbApplicant.get('gender').value) ? './assets/layout/images/women-emp-2.jpg' : './assets/layout/images/men-emp.jpg'

  }

  applicantForm() {
    this.fbApplicant = this.formbuilder.group({
      applicantId: [null],
      name: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
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
      photo: [],
      education: this.formbuilder.group({
        educaitonId: [null],
        streamId: [null],
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
        franchiseName: new FormControl('', [Validators.required]),
        certificationName: new FormControl('', [Validators.required]),
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
        canRead: new FormControl('', [Validators.required]),
        canWrite: new FormControl('', [Validators.required]),
        canSpeak: new FormControl('', [Validators.required]),
      }),
      applicantEducationDetails: this.formbuilder.array([]),
      applicantCertificationDetails: this.formbuilder.array([]),
      applicantExperienceDetails: this.formbuilder.array([]),
      applicantSkillsDetails: this.formbuilder.array([]),
      applicantLanguageSkillsDetails: this.formbuilder.array([])
    });
  }

  
getExpertiseControl(): FormControl {
  return this.fbApplicant.get('applicationSkills.expertise') as FormControl;
}

  faApplicantEducationDetails(): FormArray {
    return this.fbApplicant.get("applicantEducationDetails") as FormArray
  }

  faApplicantCertificationDetails(): FormArray {
    return this.fbApplicant.get("applicantCertificationDetails") as FormArray
  }

  faApplicantExperienceDetails(): FormArray {
    return this.fbApplicant.get("applicantExperienceDetails") as FormArray
  }

  faApplicantSkillsDetails(): FormArray {
    return this.fbApplicant.get("applicantSkillsDetails") as FormArray
  }

  faApplicantLanguageSkillsDetails(): FormArray {
    return this.fbApplicant.get("applicantLanguageSkillsDetails") as FormArray
  }

  generateRowForEducationDetails(educationDetails: EducationDetailsDto = new EducationDetailsDto()): FormGroup {
    return this.formbuilder.group({
      educaitonId: [educationDetails.educaitonId],
      streamId: [educationDetails.streamId],
      stateId: [educationDetails.stateId],
      institutionName: new FormControl(educationDetails.institutionName),
      authorityName: new FormControl(educationDetails.authorityName, [Validators.required]),
      yearOfCompletion: new FormControl(educationDetails.yearOfCompletion, [Validators.required]),
      gradingMethodId: new FormControl(educationDetails.gradingMethodId, [Validators.required]),
      gradingValue: new FormControl(educationDetails.gradingValue, [Validators.required]),
    })
  }

  generateRowForCertificationDetails(certificationDetails: ApplicantCertificationDto = new ApplicantCertificationDto()): FormGroup {
    return this.formbuilder.group({
      certificationId: [certificationDetails.certificateId],
      applicantId: new FormControl(certificationDetails.applicantId, [Validators.required]),
      certificateId: new FormControl(certificationDetails.certificateId, [Validators.required]),
      institutionName: new FormControl(certificationDetails.institutionName, [Validators.required]),
      yearOfCompletion: new FormControl(certificationDetails.yearOfCompletion),
      results: new FormControl(certificationDetails.results, [Validators.required]),
    })
  }

  generateRowForExperienceDetails(experienceDetails: ApplicantExperienceDto = new ApplicantExperienceDto()): FormGroup {
    return this.formbuilder.group({
      experienceId: [experienceDetails.experienceId],
      applicantId: [experienceDetails.applicantId],
      companyName: new FormControl(experienceDetails.companyName, [Validators.required]),
      companyLocation: new FormControl(experienceDetails.companyLocation),
      stateId: [experienceDetails.stateId],
      companyEmployeeId: new FormControl(experienceDetails.companyEmployeeId),
      designationId: new FormControl(experienceDetails.designationId, [Validators.required]),
      natureOfWork: new FormControl(experienceDetails.natureOfWork),
      workedOnProjects: new FormControl(experienceDetails.workedOnProjects),
      dateOfJoining: new FormControl(experienceDetails.dateOfJoining),
      dateOfReliving: new FormControl(experienceDetails.dateOfReliving),
    })
  }

  generateRowForApplicationSkillsDetails(applicationSkills: ApplicantSkillsDto = new ApplicantSkillsDto()): FormGroup {
    return this.formbuilder.group({
      applicationskillId: [applicationSkills.applicationskillId],
      applicantId: new FormControl(applicationSkills.applicantId, [Validators.required]),
      skillId: new FormControl(applicationSkills.skillId, [Validators.required]),
      expertise: new FormControl(applicationSkills.expertise)
    })
  }

  generateRowForApplicationLanguageSkillsDetails(applicationLanguageSkills: ApplicantLanguageSkills = new ApplicantLanguageSkills()): FormGroup {
    return this.formbuilder.group({
      applicaitonLanguageSkillId: [applicationLanguageSkills.applicaitonLanguageSkillId],
      applicantId: [applicationLanguageSkills.applicantId],
      languageId: [applicationLanguageSkills.languageId],
      canRead: [applicationLanguageSkills.canRead],
      canWrite: [applicationLanguageSkills.canWrite],
      canSpeak: [applicationLanguageSkills.canSpeak],
    })
  }

  addApplicantEducationDetails() {
    this.faapplicantEducationDetails = this.fbApplicant.get("applicantEducationDetails") as FormArray
    this.faapplicantEducationDetails.push(this.generateRowForEducationDetails())
  }

  addApplicantCertificationDetails() {
    this.faapplicantCertificationDetails = this.fbApplicant.get("applicantCertificationDetails") as FormArray
    this.faapplicantCertificationDetails.push(this.generateRowForCertificationDetails())
  }

  addApplicantExperienceDetails() {
    this.faapplicantExperienceDetails = this.fbApplicant.get("applicantExperienceDetails") as FormArray
    this.faapplicantExperienceDetails.push(this.generateRowForExperienceDetails())
  }

  addApplicantSkillsDetails() {
    this.faapplicantSkillsDetails = this.fbApplicant.get("applicantSkillsDetails") as FormArray
    this.faapplicantSkillsDetails.push(this.generateRowForApplicationSkillsDetails())
  }

  addApplicantLanguageSkillsDetails() {
    this.faapplicantLanguageSkillsDetails = this.fbApplicant.get("applicantLanguageSkillsDetails") as FormArray
    this.faapplicantLanguageSkillsDetails.push(this.generateRowForApplicationSkillsDetails())
  }

  onGenderChange() {
    const selectedGender = this.fbApplicant.get('gender').value;
    if (selectedGender) {
      this.defaultPhoto = /^female$/gi.test(this.fbApplicant.get('gender').value) ? './assets/layout/images/women-emp-2.jpg' : './assets/layout/images/men-emp.jpg'
    }
  }

  onFileChange(event: Event) {
    const fileUpload = event.target as HTMLInputElement;

    if (fileUpload.files && fileUpload.files.length > 0) {
      const file = fileUpload.files[0];
      this.selectedFileName = file.name;

      if (this.empUploadDetails.length <= 4 && this.fbApplicant.valid) {
        ValidateFileThenUpload(file, this.ImageValidator);
      } else {
        this.fbApplicant.markAllAsTouched();
      }
    }
  }

  // onClick() {
  //   this.messageDisplayed = false;
  //   const fileUpload = this.fileUpload.nativeElement;
  //   fileUpload.onchange = () => {
  //     if (this.empUploadDetails.length <= 4) {
  //       if (this.fbApplicant.valid) {
  //         for (let index = 0; index < fileUpload.files.length; index++) {
  //           const file = fileUpload.files[index];
  //           ValidateFileThenUpload(file, this.ImageValidator);
  //         }
  //       }
  //       else
  //         this.fbApplicant.markAllAsTouched();
  //     }
  //   }
  //   this.fileUpload.nativeElement.value = '';
  // }
}
