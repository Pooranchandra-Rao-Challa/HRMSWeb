import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { MaxLength, PhotoFileProperties } from 'src/app/_models/common';
import { ApplicantCertificationDto, ApplicantDto, ApplicantEducationDetailDto, ApplicantLanguageSkillDto, ApplicantSkillDto, ApplicantWorkExperienceDto } from 'src/app/_models/recruitment';
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
  yourRating: number = 0;
  maxLength: MaxLength = new MaxLength();
  countries: LookupViewDto[] = [];
  states: LookupDetailsDto[] = [];
  stream: LookupDetailsDto[] = [];
  nationality: LookupViewDto[] = [];
  curriculum: LookupViewDto[] = [];
  gradingMethod: LookupViewDto[] = [];
  certificates: LookupViewDto[] = [];
  designations: LookupViewDto[] = [];
  skills: LookupDetailsDto[] = [];
  languages: LookupViewDto[] = [];

  viewSelectedSkills = [];
  skillId: number;

  constructor(private formbuilder: FormBuilder,
    public ref: DynamicDialogRef,
    public recruitmentService: RecruitmentService,
    private lookupService: LookupService,
  ) { }

  ngOnInit() {
    this.applicantForm();
    this.getCountries();
    this.getNationality();
    this.getCurriculum();
    this.getGradingMethod();
    this.getCertificates();
    this.getDesignations();
    this.getSkills();
    this.getLanguages();
    this.genders = [
      { name: 'Male', code: 'male' },
      { name: 'Female', code: 'female' }
    ];
    this.defaultPhoto = /^female$/gi.test(this.fbApplicant.get('gender').value) ? './assets/layout/images/women-emp-2.jpg' : './assets/layout/images/men-emp.jpg'

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

  getStreamByCurriculumId(Id: number) {
    this.lookupService.Streams(Id).subscribe((resp) => {
      if (resp) {
        this.stream = resp as unknown as LookupDetailsDto[];
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
      applicantEducationDetails: this.formbuilder.group({
        applicantEducationId: [null],
        applicantId: [null],
        curriculumId: new FormControl('', [Validators.required]),
        streamId: new FormControl('', [Validators.required]),
        countryId: new FormControl('', [Validators.required]),
        stateId: new FormControl('', [Validators.required]),
        institutionName: new FormControl(''),
        authorityName: new FormControl('', [Validators.required]),
        yearOfCompletion: new FormControl('', [Validators.required]),
        gradingMethodId: new FormControl('', [Validators.required]),
        gradingValue: new FormControl('', [Validators.required]),
      }),
      applicantCertifications: this.formbuilder.group({
        applicantCertificateId: [null],
        applicantId: [null],
        certificateId: new FormControl('', [Validators.required]),
        franchiseName: new FormControl(''),
        yearOfCompletion: new FormControl('', [Validators.required]),
        results: new FormControl('', [Validators.required]),
      }),
      applicantWorkExperiences: this.formbuilder.group({
        applicantWorkExperienceId: [null],
        applicantId: [null],
        companyName: new FormControl('', [Validators.required]),
        companyLocation: new FormControl(''),
        stateId: [null],
        companyEmployeeId: new FormControl(''),
        designationId: new FormControl('', [Validators.required]),
        natureOfWork: new FormControl('', [Validators.required]),
        workedOnProjects: new FormControl(''),
        dateOfJoining: new FormControl('', [Validators.required]),
        dateOfReliving: new FormControl('', [Validators.required]),
      }),
      applicantSkills: this.formbuilder.group({
        applicantSkillId: [null],
        applicantId: new FormControl('', [Validators.required]),
        skillId: new FormControl('', [Validators.required]),
        ApplicantTechnicalSkill: new FormControl([{ ApplicantSkillId: null, ApplicantId: null, SkillId: null, SkillName: null }]),
        expertise: new FormControl('', [Validators.required])
      }),
      applicantLanguageSkills: this.formbuilder.group({
        applicantLanguageSkillId: [null],
        applicantId: new FormControl('', [Validators.required]),
        languageId: new FormControl('', [Validators.required]),
        canRead: [null],
        canWrite: [null],
        canSpeak: [null],
      }),
      applicantEducationdetails: this.formbuilder.array([]),
      applicantCertificationDetails: this.formbuilder.array([]),
      applicantExperienceDetails: this.formbuilder.array([]),
      applicantSkillsDetails: this.formbuilder.array([]),
      applicantLanguageSkillsDetails: this.formbuilder.array([])
    });
  }

  get FormControls() {
    return this.fbApplicant.controls;
  }

  getExpertiseControl(): FormControl {
    return this.fbApplicant.get('applicationSkills.expertise') as FormControl;
  }

  faApplicantEducationDetails(): FormArray {
    return this.fbApplicant.get("applicantEducationdetails") as FormArray
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

  generateRowForEducationDetails(educationDetails: ApplicantEducationDetailDto = new ApplicantEducationDetailDto()): FormGroup {
    return this.formbuilder.group({
      applicantEducationId: [educationDetails.applicantEducationId],
      applicantId: [educationDetails.applicantId],
      curriculumId: new FormControl(educationDetails.curriculumId, [Validators.required]),
      streamId: [educationDetails.streamId],
      countryId: [educationDetails.countryId],
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
      applicantCertificateId: [certificationDetails.applicantCertificateId],
      applicantId: new FormControl(certificationDetails.applicantId, [Validators.required]),
      certificateId: new FormControl(certificationDetails.certificateId, [Validators.required]),
      franchiseName: new FormControl(certificationDetails.franchiseName, [Validators.required]),
      yearOfCompletion: new FormControl(certificationDetails.yearOfCompletion),
      results: new FormControl(certificationDetails.results, [Validators.required]),
    })
  }

  generateRowForExperienceDetails(experienceDetails: ApplicantWorkExperienceDto = new ApplicantWorkExperienceDto()): FormGroup {
    return this.formbuilder.group({
      applicantWorkExperienceId: [experienceDetails.applicantWorkExperienceId],
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

  generateRowForApplicantSkillsDetails(applicantSkills: ApplicantSkillDto = new ApplicantSkillDto()): FormGroup {
    return this.formbuilder.group({
      applicantSkillId: [applicantSkills.applicantSkillId],
      applicantId: new FormControl(applicantSkills.applicantId, [Validators.required]),
      skillId: new FormControl(applicantSkills.skillId, [Validators.required]),
      expertise: new FormControl(applicantSkills.expertise)
    })
  }

  generateRowForApplicantLanguageSkillsDetails(applicationLanguageSkills: ApplicantLanguageSkillDto = new ApplicantLanguageSkillDto()): FormGroup {
    return this.formbuilder.group({
      applicantLanguageSkillId: [applicationLanguageSkills.applicantLanguageSkillId],
      applicantId: [applicationLanguageSkills.applicantId],
      languageId: [applicationLanguageSkills.languageId],
      canRead: [applicationLanguageSkills.canRead],
      canWrite: [applicationLanguageSkills.canWrite],
      canSpeak: [applicationLanguageSkills.canSpeak],
    })
  }

  addApplicantEducationDetails() {
    this.faapplicantEducationDetails = this.fbApplicant.get("applicantEducationdetails") as FormArray
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
    this.faapplicantSkillsDetails.push(this.generateRowForApplicantSkillsDetails())
  }

  addApplicantLanguageSkillsDetails() {
    this.faapplicantLanguageSkillsDetails = this.fbApplicant.get("applicantLanguageSkillsDetails") as FormArray
    this.faapplicantLanguageSkillsDetails.push(this.generateRowForApplicantLanguageSkillsDetails())
  }

  onGenderChange() {
    const selectedGender = this.fbApplicant.get('gender').value;
    if (selectedGender) {
      this.defaultPhoto = /^female$/gi.test(this.fbApplicant.get('gender').value) ? './assets/layout/images/women-emp-2.jpg' : './assets/layout/images/men-emp.jpg'
    }
  }

  onSelectSkill(e) {
    this.fbApplicant.get('workExperienceXrefs')?.setValue('');
    this.viewSelectedSkills = [];
    let CurrentArray = e.value;
    let updatedArray = [];
    if (this.skillId) {
      for (let i = 0; i < CurrentArray.length; i++) {
        updatedArray.push({ workExperienceXrefId: 0, workExperienceId: this.skillId, skillAreaId: CurrentArray[i] })
      }
    }
    else {
      for (let i = 0; i < CurrentArray.length; i++) {
        updatedArray.push({ workExperienceXrefId: 0, workExperienceId: 0, skillAreaId: CurrentArray[i] })
      }
    }

    for (let item of e.value)
      this.skills.forEach(each => {
        if (each.lookupDetailId == item) {
          this.viewSelectedSkills.push(each.name);
        }
      });
    this.fbApplicant.get('workExperienceXrefs')?.setValue(updatedArray);
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

  saveApplicant(): Observable<HttpEvent<ApplicantDto[]>> {
    return this.recruitmentService.CreateApplicant(this.fbApplicant.value);
  }

  onSubmit() {
    if (this.fbApplicant.valid) {
      this.saveApplicant().subscribe(resp => {
        if (resp) {
          this.ref.close(true);
        }
      })
    }
    else {
      this.fbApplicant.markAllAsTouched();
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
