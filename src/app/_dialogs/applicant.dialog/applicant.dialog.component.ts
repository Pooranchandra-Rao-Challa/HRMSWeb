import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { MaxLength, PhotoFileProperties, ViewApplicationScreen } from 'src/app/_models/common';
import { ApplicantCertificationDto, ApplicantDto, ApplicantEducationDetailDto, ApplicantLanguageSkillDto, ApplicantSkillDto, ApplicantWorkExperienceDto, ViewApplicantDto } from 'src/app/_models/recruitment';
import { LookupService } from 'src/app/_services/lookup.service';
import { RecruitmentService } from 'src/app/_services/recruitment.service';
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
  maxLength: MaxLength = new MaxLength();
  countries: LookupViewDto[] = [];
  states: LookupDetailsDto[] = [];
  statesbasedOnCountryId: LookupViewDto[][] = [];
  stream: LookupDetailsDto[][] = [];
  nationality: LookupViewDto[] = [];
  curriculum: LookupViewDto[] = [];
  gradingMethod: LookupViewDto[] = [];
  certificates: LookupViewDto[] = [];
  designations: LookupViewDto[] = [];
  skills: LookupDetailsDto[] = [];
  languages: LookupViewDto[] = [];
  skillId: number;
  skillName: string;
  addFlag: boolean;
  applicantdata: any;
  currentDate = new Date();
  hoveredStarIndex: number | null = null;

  constructor(private formbuilder: FormBuilder,
    public ref: DynamicDialogRef,
    public recruitmentService: RecruitmentService,
    private lookupService: LookupService,
    public alertMessage: AlertmessageService,
    private config: DynamicDialogConfig,) {
    this.applicantdata = this.config.data;
  }

  ngOnInit() {
    this.getCountries();
    this.getNationality();
    this.getCurriculum();
    this.getGradingMethod();
    this.getCertificates();
    this.getDesignations();
    this.getSkills();
    this.getLanguages();
    this.applicantForm();

    this.genders = [
      { name: 'Male', code: 'male' },
      { name: 'Female', code: 'female' }
    ];
    this.defaultPhoto = /^female$/gi.test(this.fbApplicant.get('gender').value) ? './assets/layout/images/women-emp-2.jpg' : './assets/layout/images/men-emp.jpg'


    if (this.applicantdata) {
      this.editApplicantDetails(this.applicantdata)
    }
  }

  getCurriculum() {
    this.lookupService.Curriculums().subscribe((resp) => {
      this.curriculum = resp as unknown as LookupViewDto[];
    });
  }

  getCountries() {
    this.lookupService.Countries().subscribe((resp) => {
      this.countries = resp as unknown as LookupViewDto[];
    })
  }

  getStatesByCountryId(id: number) {
    this.lookupService.States(id).subscribe((resp) => {
      if (resp) {
        this.states = resp as unknown as LookupDetailsDto[];
      }
    })
  }

  onchangeStateBasedOnCountry(id: number, index: number) {
    this.lookupService.States(id).subscribe((resp) => {
      if (resp) {
        this.statesbasedOnCountryId[index] = resp as unknown as LookupDetailsDto[];
      }
    })
  }

  getStreamByCurriculumId(Id: number, index: number) {
    this.lookupService.Streams(Id).subscribe((resp) => {
      if (resp) {
        this.stream[index] = resp as unknown as LookupDetailsDto[];
      }
    });
  }


  getNationality() {
    this.lookupService.Nationality().subscribe((resp) => {
      this.nationality = resp as unknown as LookupViewDto[];
    })
  }

  getGradingMethod() {
    this.lookupService.GradingMethods().subscribe((resp) => {
      this.gradingMethod = resp as unknown as LookupViewDto[];
    })
  }

  getCertificates() {
    this.lookupService.Certificates().subscribe((resp) => {
      this.certificates = resp as unknown as LookupViewDto[];
    })
  }

  getDesignations() {
    this.lookupService.Designations().subscribe((resp) => {
      this.designations = resp as unknown as LookupViewDto[];
    })
  }

  getSkills() {
    this.lookupService.SkillAreas().subscribe((resp) => {
      this.skills = resp as unknown as LookupViewDto[];
    })
  }

  getLanguages() {
    this.lookupService.Languages().subscribe((resp) => {
      this.languages = resp as unknown as LookupViewDto[];
    })
  }

  applicantForm() {
    this.addFlag = true;
    this.fbApplicant = this.formbuilder.group({
      applicantId: [null],
      name: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      emailId: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required]),
      nationalityId: new FormControl('', [Validators.required]),
      photo: [],
      addressLine1: new FormControl('', [Validators.required]),
      addressLine2: new FormControl(''),
      landmark: new FormControl(''),
      zipCode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      countryId: new FormControl('', [Validators.required]),
      stateId: new FormControl('', [Validators.required]),
      resumeUrl: new FormControl(''),
      isFresher: [true],
      applicantEducationDetails: this.formbuilder.array([]),
      applicantCertifications: this.formbuilder.array([]),
      applicantWorkExperiences: this.formbuilder.array([]),
      applicantSkills: this.formbuilder.array([]),
      applicantLanguageSkills: this.formbuilder.array([])
    });
  }

  get FormControls() {
    return this.fbApplicant.controls;
  }

  formArrayControlEducation(i: number, formControlName: string) {
    return this.faApplicantEducationDetails().controls[i].get(formControlName);
  }

  formArrayControlCertificaiton(i: number, formControlName: string) {
    return this.faApplicantCertificationDetails().controls[i].get(formControlName);
  }

  formArrayControlWorkExperience(i: number, formControlName: string) {
    return this.faApplicantExperienceDetails().controls[i].get(formControlName);
  }

  formArrayControlSkills(i: number, formControlName: string) {
    return this.faApplicantSkillsDetails().controls[i].get(formControlName);
  }

  formArrayControlLanguage(i: number, formControlName: string) {
    return this.faApplicantLanguageSkillsDetails().controls[i].get(formControlName);
  }

  getExpertiseControl(index: number): FormControl {
    const formArray = this.fbApplicant.get('applicantSkills') as FormArray;
    return formArray.at(index).get('expertise') as FormControl;
  }

  onStarHover(index: number): void {
    console.log('Parent Hovered Index:', index);
    
    this.hoveredStarIndex = index;
  }

  faApplicantEducationDetails(): FormArray {
    return this.fbApplicant.get("applicantEducationDetails") as FormArray
  }

  faApplicantCertificationDetails(): FormArray {
    return this.fbApplicant.get("applicantCertifications") as FormArray
  }

  faApplicantExperienceDetails(): FormArray {
    return this.fbApplicant.get("applicantWorkExperiences") as FormArray
  }

  faApplicantSkillsDetails(): FormArray {
    return this.fbApplicant.get("applicantSkills") as FormArray
  }

  faApplicantLanguageSkillsDetails(): FormArray {
    return this.fbApplicant.get("applicantLanguageSkills") as FormArray
  }

  generateRowForEducationDetails(educationDetails: ApplicantEducationDetailDto = new ApplicantEducationDetailDto()): FormGroup {
    return this.formbuilder.group({
      applicantEducationDetailId: [educationDetails.applicantEducationDetailId],
      applicantId: [educationDetails.applicantId],
      curriculumId: new FormControl(educationDetails.curriculumId, [Validators.required]),
      streamId: [educationDetails.streamId, [Validators.required]],
      countryId: [educationDetails.countryId, [Validators.required]],
      stateId: [educationDetails.stateId, [Validators.required]],
      institutionName: new FormControl(educationDetails.institutionName),
      authorityName: new FormControl(educationDetails.authorityName, [Validators.required]),
      yearOfCompletion: new FormControl(educationDetails.yearOfCompletion, [Validators.required]),
      gradingMethodId: new FormControl(educationDetails.gradingMethodId, [Validators.required]),
      gradingValue: new FormControl(educationDetails.gradingValue, [Validators.required]),
    })
  }

  generateRowForCertificationDetails(certificationDetails: ApplicantCertificationDto = new ApplicantCertificationDto()): FormGroup {
    return this.formbuilder.group({
      applicantCertificateId: [certificationDetails.applicantCertificateId],
      applicantId: new FormControl(certificationDetails.applicantId),
      certificateId: new FormControl(certificationDetails.certificateId, [Validators.required]),
      franchiseName: new FormControl(certificationDetails.franchiseName),
      yearOfCompletion: new FormControl(certificationDetails.yearOfCompletion, [Validators.required]),
      results: new FormControl(certificationDetails.results, [Validators.required]),
    })
  }

  generateRowForExperienceDetails(experienceDetails: ApplicantWorkExperienceDto = new ApplicantWorkExperienceDto()): FormGroup {
    return this.formbuilder.group({
      applicantWorkExperienceId: [experienceDetails.applicantWorkExperienceId],
      applicantId: [experienceDetails.applicantId],
      companyName: new FormControl(experienceDetails.companyName, [Validators.required]),
      companyLocation: new FormControl(experienceDetails.companyLocation),
      countryId: new FormControl(experienceDetails.countryId, [Validators.required]),
      stateId: new FormControl(experienceDetails.stateId, [Validators.required]),
      companyEmployeeId: new FormControl(experienceDetails.companyEmployeeId),
      designationId: new FormControl(experienceDetails.designationId, [Validators.required]),
      natureOfWork: new FormControl(experienceDetails.natureOfWork, [Validators.required]),
      workedOnProjects: new FormControl(experienceDetails.workedOnProjects),
      dateOfJoining: new FormControl(experienceDetails.dateOfJoining, [Validators.required]),
      dateOfReliving: new FormControl(experienceDetails.dateOfReliving, [Validators.required]),
    })
  }

  generateRowForApplicantSkillsDetails(applicantskills: ApplicantSkillDto = new ApplicantSkillDto()): FormGroup {
    return this.formbuilder.group({
      applicantSkillId: [applicantskills.applicantSkillId],
      applicantId: new FormControl(applicantskills.applicantId),
      skillId: new FormControl(applicantskills.skillId, [Validators.required]),
      expertise: new FormControl(applicantskills.expertise, [Validators.required])
    })
  }

  generateRowForApplicantLanguageSkillsDetails(applicationLanguageSkills: ApplicantLanguageSkillDto = new ApplicantLanguageSkillDto()): FormGroup {
    return this.formbuilder.group({
      applicantLanguageSkillId: [applicationLanguageSkills.applicantLanguageSkillId],
      applicantId: new FormControl(applicationLanguageSkills.applicantId),
      languageId: new FormControl(applicationLanguageSkills.languageId, [Validators.required]),
      canRead: [applicationLanguageSkills.canRead],
      canWrite: [applicationLanguageSkills.canWrite],
      canSpeak: [applicationLanguageSkills.canSpeak],
    })
  }

  addApplicantEducationDetails() {
    this.faapplicantEducationDetails = this.faApplicantEducationDetails();
    this.faapplicantEducationDetails.push(this.generateRowForEducationDetails())
  }

  addApplicantCertificationDetails() {
    this.faapplicantCertificationDetails = this.faApplicantCertificationDetails();
    this.faapplicantCertificationDetails.push(this.generateRowForCertificationDetails())
  }

  addApplicantExperienceDetails() {
    this.faapplicantExperienceDetails = this.faApplicantExperienceDetails();
    this.faapplicantExperienceDetails.push(this.generateRowForExperienceDetails())
  }

  addApplicantSkillsDetails() {
    this.faapplicantSkillsDetails = this.faApplicantSkillsDetails();
    this.faapplicantSkillsDetails.push(this.generateRowForApplicantSkillsDetails())
  }

  addApplicantLanguageSkillsDetails() {
    this.faapplicantLanguageSkillsDetails = this.faApplicantLanguageSkillsDetails();
    this.faapplicantLanguageSkillsDetails.push(this.generateRowForApplicantLanguageSkillsDetails())
  }

  onGenderChange() {
    const selectedGender = this.fbApplicant.get('gender').value;
    if (selectedGender) {
      this.defaultPhoto = /^female$/gi.test(this.fbApplicant.get('gender').value) ? './assets/layout/images/women-emp-2.jpg' : './assets/layout/images/men-emp.jpg'
    }
  }

  restrictSpaces(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    // Prevent the first key from being a space
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0)
      event.preventDefault();

    // Restrict multiple spaces
    if (event.key === ' ' && target.selectionStart > 0 && target.value.charAt(target.selectionStart - 1) === ' ') {
      event.preventDefault();
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

  validateRowforEducationDetails(educaitonDetailsIndex: number) {
    const educationDetailsArray = this.faApplicantEducationDetails();
    const educationDetail = educationDetailsArray.controls[educaitonDetailsIndex] as FormGroup;

    // List of mandatory controls in your row
    const mandatoryControls = ['curriculumId', 'streamId', 'authorityName', 'yearOfCompletion', 'gradingMethodId', 'gradingValue', 'countryId', 'stateId'];

    // Mark controls as touched
    mandatoryControls.forEach((controlName: string) => {
      const control = educationDetail.get(controlName);
      control.markAsTouched(); // Mark the control as touched
    });

    // Iterate over mandatory controls and check their validity
    mandatoryControls.forEach((controlName: string) => {
      const control = educationDetail.get(controlName);
      if (control.invalid) {
        // Display validation messages for the entire row
        return;
      }
    });
  }

  validateRowforCertificationDetails(certificationDetailsIndex: number) {
    const certificationDetailsArray = this.faApplicantCertificationDetails();
    const certificationDetail = certificationDetailsArray.controls[certificationDetailsIndex] as FormGroup;

    // List of mandatory controls in your row
    const mandatoryControls = ['certificateId', 'yearOfCompletion', 'results'];

    // Mark controls as touched
    mandatoryControls.forEach((controlName: string) => {
      const control = certificationDetail.get(controlName);
      control.markAsTouched(); // Mark the control as touched
    });

    // Iterate over mandatory controls and check their validity
    mandatoryControls.forEach((controlName: string) => {
      const control = certificationDetail.get(controlName);
      if (control.invalid) {
        // Display validation messages for the entire row
        return;
      }
    });
  }

  validateRowforExperienceDetails(experienceDetailsIndex: number) {
    const experienceDetailsArray = this.faApplicantExperienceDetails();
    const experienceDetail = experienceDetailsArray.controls[experienceDetailsIndex] as FormGroup;

    // List of mandatory controls in your row
    const mandatoryControls = ['companyName', 'designationId', 'natureOfWork', 'dateOfJoining', 'dateOfReliving', 'countryId', 'stateId'];

    // Mark controls as touched
    mandatoryControls.forEach((controlName: string) => {
      const control = experienceDetail.get(controlName);
      control.markAsTouched(); // Mark the control as touched
    });

    // Iterate over mandatory controls and check their validity
    mandatoryControls.forEach((controlName: string) => {
      const control = experienceDetail.get(controlName);
      if (control.invalid) {
        // Display validation messages for the entire row
        return;
      }
    });
  }

  validateRowforApplicantSkillDetails(applicantSkillsDetailsIndex: number) {
    const skillDetailsArray = this.faApplicantSkillsDetails();
    const skillDetail = skillDetailsArray.controls[applicantSkillsDetailsIndex] as FormGroup;

    // List of mandatory controls in your row
    const mandatoryControls = ['skillId', 'expertise'];

    // Mark controls as touched
    mandatoryControls.forEach((controlName: string) => {
      const control = skillDetail.get(controlName);
      control.markAsTouched(); // Mark the control as touched
    });

    // Iterate over mandatory controls and check their validity
    mandatoryControls.forEach((controlName: string) => {
      const control = skillDetail.get(controlName);
      if (control.invalid) {
        // Display validation messages for the entire row
        return;
      }
    });
  }

  validateRowforApplicantLanguageSkillDetails(applicantLanguageSkillsDetailsIndex: number) {
    const languageSkillDetailsArray = this.faApplicantLanguageSkillsDetails()
    const languageSkillDetail = languageSkillDetailsArray.controls[applicantLanguageSkillsDetailsIndex] as FormGroup;

    // List of mandatory controls in your row
    const mandatoryControls = ['skillId', 'expertise'];

    // Mark controls as touched
    mandatoryControls.forEach((controlName: string) => {
      const control = languageSkillDetail.get(controlName);
      if (control) {
        control.markAsTouched(); // Mark the control as touched
      }
    });

    // Iterate over mandatory controls and check their validity
    mandatoryControls.forEach((controlName: string) => {
      const control = languageSkillDetail.get(controlName);
      if (control && control.invalid) {
        // Display validation messages for the entire row
        return;
      }
    });
  }
  editApplicantDetails(ApplicantDetails: ApplicantDto) {
    this.addFlag = false;
    this.applicantdata = ApplicantDetails;
    this.getStatesByCountryId(this.applicantdata.countryId);
    this.fbApplicant.patchValue({
      applicantId: this.applicantdata.applicantId,
      name: this.applicantdata.name,
      gender: this.applicantdata.gender,
      dob: new Date(this.applicantdata.dob),
      emailId: this.applicantdata.emailId,
      mobileNo: this.applicantdata.mobileNo,
      nationalityId: this.applicantdata.nationalityId,
      photo: this.applicantdata.photo,
      addressLine1: this.applicantdata.addressLine1,
      addressLine2: this.applicantdata.addressLine2,
      landmark: this.applicantdata.landmark,
      zipCode: this.applicantdata.zipCode,
      city: this.applicantdata.city,
      countryId: this.applicantdata.countryId,
      stateId: this.applicantdata.stateId,
      resumeUrl: this.applicantdata.resumeUrl,
      isFresher: this.applicantdata.isFresher,
    });
    if (Array.isArray(this.applicantdata.expandedEducationDetails)) {
      this.applicantdata.expandedEducationDetails.forEach((eduDetails, index) => {
        this.faApplicantEducationDetails().insert(index, this.generateRowForEducationDetails(eduDetails));
        this.getStreamByCurriculumId(eduDetails.curriculumId, index)
        this.onchangeStateBasedOnCountry(this.applicantdata.countryId, index)
        this.formArrayControlEducation(index, 'yearOfCompletion').patchValue(new Date(eduDetails.yearOfCompletion));
      });
    }
    if (Array.isArray(this.applicantdata.expandedWorkExperience)) {
      this.applicantdata.expandedWorkExperience.forEach((expDetails, index) => {
        this.faApplicantExperienceDetails().insert(index, this.generateRowForExperienceDetails(expDetails));
        this.formArrayControlWorkExperience(index, 'dateOfJoining').patchValue(new Date(expDetails.dateOfJoining));
        this.formArrayControlWorkExperience(index, 'dateOfReliving').patchValue(new Date(expDetails.dateOfReliving));
      });
    }
    if (Array.isArray(this.applicantdata.expandedCertifications)) {
      this.applicantdata.expandedCertifications.forEach((certDetails, index) => {
        this.faApplicantCertificationDetails().insert(index, this.generateRowForCertificationDetails(certDetails));
        this.formArrayControlCertificaiton(index, 'yearOfCompletion').patchValue(new Date(certDetails.yearOfCompletion));
      });
    }
    if (Array.isArray(this.applicantdata.expandedLanguageSkills)) {
      this.applicantdata.expandedLanguageSkills.forEach((langSkills, index) => {
        this.faApplicantLanguageSkillsDetails().insert(index, this.generateRowForApplicantLanguageSkillsDetails(langSkills));
      });
    }
    if (Array.isArray(this.applicantdata.expandedSkills)) {
      this.applicantdata.expandedSkills.forEach((techSkills, index) => {
        this.faApplicantSkillsDetails().insert(index, this.generateRowForApplicantSkillsDetails(techSkills));
      });
    }
  }


  saveApplicant(): Observable<HttpEvent<any[]>> {
   if (this.addFlag) {
      return this.recruitmentService.CreateApplicant(this.fbApplicant.value);
    } else {
      return this.recruitmentService.UpdateApplicant(this.fbApplicant.value);
    }

  }

  onSubmit() {
    if (this.fbApplicant.value) {
      this.saveApplicant().subscribe(resp => {
        if (resp) {
          if (this.addFlag) {
            this.ref.close(true);
            this.alertMessage.displayAlertMessage(ALERT_CODES["AP001"]);
          }
         else{
          this.alertMessage.displayAlertMessage(ALERT_CODES["AP002"]);
          this.ref.close({ "UpdatedModal": ViewApplicationScreen.viewApplicantDetails });
         } 
        }
      })
    }
    else {
      this.fbApplicant.markAllAsTouched();
    }
  }
}
