import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormArray, FormBuilder, FormControl, FormGroup, Validators,
} from '@angular/forms'; import { ActivatedRoute } from '@angular/router';
import { EmployeesList, LookupViewDto } from 'src/app/_models/admin';
import { BankDetailViewDto, EducationDetailsDto, EmployeAdressViewDto, EmployeeBasicDetailDto, EmployeeBasicDetailViewDto, employeeEducDtlsViewDto,
    employeeExperienceDtlsViewDto, EmployeeOfficedetailsDto, EmployeeOfficedetailsviewDto, ExperienceDetailsDto, FamilyDetailsViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { AssetAllotmentViewDto } from 'src/app/_models/admin/assetsallotment';
import { AdminService } from 'src/app/_services/admin.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { Actions, DialogRequest, ViewEmployeeScreen } from 'src/app/_models/common';
import { AddassetallotmentDialogComponent } from 'src/app/_dialogs/addassetallotment.dialog/addassetallotment.dialog.component';
import { UnassignassetDialogComponent } from 'src/app/_dialogs/unassignasset.dialog/unassignasset.dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MIN_LENGTH_2, RG_ALPHA_ONLY, RG_EMAIL, RG_PHONE_NO } from 'src/app/_shared/regex';
import { MaxLength } from 'src/app/_models/common';
import { BankdetailsDialogComponent } from 'src/app/_dialogs/bankDetails.Dialog/bankdetails.dialog.component';
import { AddressDialogComponent } from 'src/app/_dialogs/address.dialog/address.dialog.component';
import { uploadDocumentsDialogComponent } from 'src/app/_dialogs/uploadDocuments.dialog/uploadDocuments.dialog.component';
import { FamilydetailsDialogComponent } from 'src/app/_dialogs/familydetails.dailog/familydetails.dialog.component';

interface Gender {
  name: string;
  code: string;
}

export class Status {
  name: string;
  code: string;
}

@Component({
  selector: 'app-viewemployees',
  templateUrl: './viewemployees.component.html',
  styles: [],
})
export class ViewemployeesComponent {
  // employee basic details
  fbEmpBasDtls!: FormGroup;
  employeePrsDtls = new EmployeeBasicDetailViewDto();
  employeePrsDtl = new EmployeeBasicDetailDto();
  imageSize: any;
  selectedFileBase64: string | null = null; // To store the selected file as base64
  status: Status[];
  mediumDate: string = MEDIUM_DATE;
  basicdtlsSubmitLabel: String;
  // employee office details
  fbOfficDtls!: FormGroup;
  employeeofficeDtls = new EmployeeOfficedetailsviewDto();
  employeeofficDtl = new EmployeeOfficedetailsDto();
  employees: EmployeesList[] = [];
  officeSubmitLabel: String;
  // employee education details
  fbEducationDetails!: FormGroup;
  faeducationDetails!: FormArray;
  educationDetails: employeeEducDtlsViewDto[] = [];
  empEduDetails = new EducationDetailsDto();
  gradingMethods: LookupViewDto[] = [];
  countries: LookupViewDto[] = [];
  streamPerRow: LookupViewDto[][] = [];
  // employee experience details
  statesPerRow: LookupViewDto[][] = [];
  fbexperience!: FormGroup;
  faexperienceDetails!: FormArray;
  stream: LookupViewDto[] = [];
  circulum: LookupViewDto[] = [];
  skillarea: LookupViewDto[] = [];
  workExperience: employeeExperienceDtlsViewDto[];
  skillset: any;
  // FamilyDetails,AdressDetails,UploadedDocuments,BankDetails
  familyDetails: FamilyDetailsViewDto[];
  address: EmployeAdressViewDto[];
  UploadedDocuments: any[];
  bankDetails: BankDetailViewDto[];

  officeDtls: any[];
  assetAllotments: AssetAllotmentViewDto[] = [];
  size: string = 'M';
  Education: boolean = false;
  liked: boolean = false;
  dialog: boolean = false;
  officedialog: boolean = false;
  Experience: boolean = false;
  ShoweducationDetails: boolean = false;
  ShowexperienceDetails: boolean = false;
  images: string[] = [];
  genders: Gender[];
  selectedOption: string;
  maxLength: MaxLength = new MaxLength();
  submitLabel: string;
  value: Date;
  states: LookupViewDto[] = [];
  designation: LookupViewDto[] = [];
  employeeId: any;
  bloodgroups: LookupViewDto[] = [];
  ActionTypes = Actions;
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  files = [];
  fileSize = 20;
  title: string;
  addassetallotmentDialogComponent = AddassetallotmentDialogComponent;
  BankdetailsDialogComponent = BankdetailsDialogComponent;
  unassignassetDialogComponent = UnassignassetDialogComponent;
  AddressDialogComponent = AddressDialogComponent;
  uploadDocumentsDialogComponent = uploadDocumentsDialogComponent;
  FamilydetailsDialogComponent = FamilydetailsDialogComponent;
  dialogRequest: DialogRequest = new DialogRequest();
  selectedCountry: number[] = [];
  selectedCurriculumId: number[] = [];
  enRollEmployee: boolean = false;
  showOfcAndAssetDetails: boolean = false;

  Courses = [
    { name: 'SSC', code: 'SSC' },
    { name: 'Inter', code: 'Inter' },
    { name: 'Under Graduation', code: 'UG' },
    { name: 'Post Graduation', code: 'PG' },
  ];
  Data() {
    this.images = [
      'product-overview-3-1.png',
      'product-overview-3-2.png',
      'product-overview-3-3.png',
      'product-overview-3-4.png',
    ];
    this.genders = [
      { name: 'Female', code: 'FM' },
      { name: 'Male', code: 'M' },
    ];
    this.status = [
      { name: 'Married', code: 'DS' },
      { name: 'Un Married', code: 'NS' },
      { name: 'Single', code: 'SN' },
    ]

  }
  constructor(
    private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private alertMessage: AlertmessageService,
    public ref: DynamicDialogRef,
    private dialogService: DialogService,
  ) {
    this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
  }

  ngOnInit(): void {
    this.initdesignation();
    this.getemployeeview();
    this.Data();
    this.EmpBasicDtlsForm();
    this.initCurriculum();
    this.initEmployees();
    this.OfficDtlsForm();
    this.initEducation();
    this.initExperience();
    this.initBloodGroups();
    this.initskillArea();
    this.initGrading();
  }
  getemployeeview() {
    this.initViewEmpDtls();
    this.initofficeEmpDtls();
    this.initGetEducationDetails();
    this.initGetWorkExperience();
    this.initGetFamilyDetails();
    this.initGetAddress();
    this.initCountries()
    this.initUploadedDocuments();
    this.initBankDetails();
    this.initviewAssets();
  }

  // EMPLOYEE Basic details

  EmpBasicDtlsForm() {
    this.fbEmpBasDtls = this.formbuilder.group({
      employeeId: [null],
      firstName: new FormControl(null, [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      middleName: new FormControl(null, [Validators.minLength(MIN_LENGTH_2)]),
      lastName: new FormControl(null, [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
      code: [null],
      gender: new FormControl('', [Validators.required]),
      bloodGroupId: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required, Validators.pattern(RG_PHONE_NO)]),
      alternateMobileNumber: new FormControl('', [Validators.pattern(RG_PHONE_NO)]),
      originalDob: new FormControl('', [Validators.required]),
      certificateDob: new FormControl('', [Validators.required]),
      emailId: new FormControl('', [Validators.required, Validators.pattern(RG_EMAIL)]),
      isActive: (''),
      signDate: (''),
      photo: []
    });
  }

  get EmpBasDtlsFormControls() {
    return this.fbEmpBasDtls.controls;
  }

  initBloodGroups() {
    this.lookupService.BloodGroups().subscribe((resp) => {
      this.bloodgroups = resp as unknown as LookupViewDto[];
    });
  }

  initViewEmpDtls() {
    this.enRollEmployee = false;
    this.employeeService.GetViewEmpPersDtls(this.employeeId).subscribe((resp) => {
      this.employeePrsDtls = resp as unknown as EmployeeBasicDetailViewDto;
      if(!this.employeePrsDtls.signDate) this.enRollEmployee = true;
      else this.showOfcAndAssetDetails = true;
    });
  }

  showEmpPersDtlsDialog(employeePrsDtls: EmployeeBasicDetailViewDto) {
    this.employeePrsDtl = employeePrsDtls;
    this.employeePrsDtl.originalDob = new Date(employeePrsDtls.originalDOB);
    this.employeePrsDtl.certificateDob = new Date(employeePrsDtls.certificateDOB);
    this.employeePrsDtl.isActive = true;
    this.fbEmpBasDtls.patchValue(this.employeePrsDtl);
    this.basicdtlsSubmitLabel = "Update Personal Details"
    this.dialog = true;
  }

  saveEmpBscDtls() {
    this.employeeService.updateViewEmpPersDtls(this.fbEmpBasDtls.value).subscribe((resp) => {
      if (resp) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["EVEBD001"]);
        this.dialog = false;
        this.fbEmpBasDtls.reset();
        this.initViewEmpDtls();
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["EVEBD002"]);
      }
    })
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

  // Employee OFFICE DETAils

  OfficDtlsForm() {
    this.fbOfficDtls = this.formbuilder.group({
      employeeId: (null),
      strTimeIn: new FormControl(null, [Validators.required]),
      strTimeOut: new FormControl(null, [Validators.required]),
      officeEmailId: new FormControl(null, [Validators.required, Validators.pattern(RG_EMAIL)]),
      dateofJoin: new FormControl(null, [Validators.required]),
      designationId: new FormControl(null, [Validators.required]),
      reportingToId: new FormControl(null, [Validators.required]),
      isPfeligible: new FormControl(true, [Validators.required]),
      isEsieligible: new FormControl(false, [Validators.required]),
      isActive: (true),
    });
  }

  get EmpOfficeFormControls() {
    return this.fbOfficDtls.controls;
  }

  initofficeEmpDtls() {
    this.employeeService.EmployeeOfficedetailsviewDto(this.employeeId).subscribe((resp) => {
      this.employeeofficeDtls = resp as unknown as EmployeeOfficedetailsviewDto;
    });
  }

  initEmployees() {
    this.adminService.getEmployeesList().subscribe(resp => {
      this.employees = resp as unknown as EmployeesList[];
    });
  }

  showEmpOfficDtlsDialog(employeeOfficeDtls: EmployeeOfficedetailsviewDto) {
    if (employeeOfficeDtls) {
      this.employeeofficDtl = employeeOfficeDtls;
      this.employeeofficDtl.strTimeIn = employeeOfficeDtls.timeIn?.substring(0, 5);
      this.employeeofficDtl.strTimeOut = employeeOfficeDtls.timeOut?.substring(0, 5);
      this.employeeofficDtl.dateofJoin = new Date(employeeOfficeDtls.dateofJoin);
      this.employeeofficDtl.isPfeligible = employeeOfficeDtls.isPFEligible;
      this.employeeofficDtl.isEsieligible = employeeOfficeDtls.isESIEligible;
      this.employeeofficDtl.isActive = true;
      this.fbOfficDtls.patchValue(this.employeeofficDtl);
      this.officeSubmitLabel = "Update Official Details";
    } else {
      this.officeSubmitLabel = "Add Official Details";
    }
    this.fbOfficDtls.controls['employeeId'].setValue(parseInt(this.activatedRoute.snapshot.queryParams['employeeId']));
    this.officedialog = true;
  }

  get EmpofficDtlsFormControls() {
    return this.fbOfficDtls.controls;
  }

  saveEmpOfficDtls() {
    this.employeeService.updateViewEmpOfficDtls(this.fbOfficDtls.value).subscribe((resp) => {
      if (resp) {
        this.initofficeEmpDtls();
        this.officedialog = false;
        this.fbOfficDtls.reset();
        if (this.employeeofficeDtls) {
          this.alertMessage.displayAlertMessage(ALERT_CODES["EVEOFF001"]);
        } else {
          this.alertMessage.displayAlertMessage(ALERT_CODES["EVEOFF002"]);
        }
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["EVEOFF003"])
      }
    })
  }

  // Employee Education details
  initEducation() {
    this.fbEducationDetails = this.formbuilder.group({
      educationDetails: this.formbuilder.array([]),
    });
  }

  generateEducationRow(empEduDetails: EducationDetailsDto = new EducationDetailsDto()): FormGroup {
    const employeeId = parseInt(this.activatedRoute.snapshot.queryParams['employeeId']);
    empEduDetails.employeeId = employeeId;
    return this.formbuilder.group({
      educationDetailId: new FormControl(empEduDetails.educationDetailId),
      employeeId: new FormControl(employeeId),
      curriculumId: new FormControl(empEduDetails.curriculumId, [Validators.required,]),
      streamId: new FormControl(empEduDetails.streamId, [Validators.required,]),
      countryId: new FormControl(empEduDetails.countryId, [Validators.required,]),
      stateId: new FormControl(empEduDetails.stateId, [Validators.required,]),
      institutionName: new FormControl(empEduDetails.institutionName),
      authorityName: new FormControl(empEduDetails.authorityName, [Validators.required,]),
      passedOutyear: new FormControl(empEduDetails.passedOutyear ? new Date(empEduDetails.passedOutyear) : null, [Validators.required,]),
      gradingMethodId: new FormControl(empEduDetails.gradingMethodId, [Validators.required,]),
      gradingValue: new FormControl(empEduDetails.gradingValue, [Validators.required,]),
    });
  }

  onCurriculumChange(selectedCurriculumId: number, rowIndex: number) {
    this.selectedCurriculumId[rowIndex] = selectedCurriculumId;
    this.lookupService.Streams(selectedCurriculumId).subscribe((resp) => {
      if (resp) {
        this.streamPerRow[rowIndex] = resp as unknown as LookupViewDto[];
      }
    });
  }

  getStreamByCirculumId(Id: number) {
    this.lookupService.Streams(Id).subscribe((resp) => {
      if (resp) {
        this.stream = resp as unknown as LookupViewDto[];
      }
    });
  }

  initCurriculum() {
    this.lookupService.Curriculums().subscribe((resp) => {
      this.circulum = resp as unknown as LookupViewDto[];
    });
  }

  initGrading() {
    this.lookupService.GradingMethods().subscribe((resp) => {
      this.gradingMethods = resp as unknown as LookupViewDto[];
    });
  }


  initGetEducationDetails() {
    this.employeeService.GetEducationDetails(this.employeeId).subscribe((resp) => {
      this.educationDetails = resp as unknown as employeeEducDtlsViewDto[];
    });
  }

  ShowEducationDetails() {
    this.educationDetails.forEach((empEduDetails: EducationDetailsDto, rowIndex) => {
      this.onCountryChange(empEduDetails.countryId, rowIndex);
      this.onCurriculumChange(empEduDetails.curriculumId, rowIndex);
      this.faeducationDetail().push(this.generateEducationRow(empEduDetails));
    })
    if (this.educationDetails.length == 0) this.faeducationDetail().push(this.generateEducationRow());
    this.fbEducationDetails.patchValue(this.educationDetails)
    this.Education = true;
  }

  addEducationDetails() {
    this.faeducationDetails = this.fbEducationDetails.get('educationDetails') as FormArray;
    this.faeducationDetails.push(this.generateEducationRow());
    // const employeeId = parseInt(this.activatedRoute.snapshot.queryParams['employeeId']);
    // this.faeducationDetails.controls.forEach((control: FormGroup) => {
    //   control.get('employeeId').setValue(employeeId);
    // });
  }

  faeducationDetail(): FormArray {
    return this.fbEducationDetails.get('educationDetails') as FormArray;
  }
  removeEducationDetail(index: number) {
    this.faeducationDetail().removeAt(index);
  }

  formArrayControls(i: number, formControlName: string) {
    return this.faeducationDetail().controls[i].get(formControlName);
  }

  saveEducationDetails() {
    this.employeeService.updateViewEmpEduDtls(this.fbEducationDetails.value.educationDetails).subscribe((resp) => {
      if (resp) {
        this.initGetEducationDetails();
        this.onClose();
        this.alertMessage.displayAlertMessage(ALERT_CODES["EVEEDU001"]);
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["EVEEDU002"])
      }
    })
  }

  onClose() {
    this.Education = false;
    (this.fbEducationDetails.get('educationDetails') as FormArray).clear();
  }

  // Employee Work Experience
  initExperience() {
    this.fbexperience = this.formbuilder.group({
      experienceDetails: this.formbuilder.array([])
    });
  }

  generaterow(experienceDetails: ExperienceDetailsDto = new ExperienceDetailsDto()): FormGroup {
    const employeeId = parseInt(this.activatedRoute.snapshot.queryParams['employeeId']);
    experienceDetails.employeeId = employeeId;
    const skillAreaIdsArray = experienceDetails.skillAreaId ? experienceDetails.skillAreaId.split(',').map(Number) : [];
    return this.formbuilder.group({
      employeeId: new FormControl(employeeId),
      workExperienceId: new FormControl(experienceDetails.workExperienceId),
      isAfresher: new FormControl(false),
      companyName: new FormControl(experienceDetails.companyName, [Validators.minLength(2)]),
      companyLocation: new FormControl(experienceDetails.companyLocation, [Validators.minLength(2)]),
      companyEmployeeId: new FormControl(experienceDetails.companyEmployeeId, [Validators.minLength(2)]),
      countryId: new FormControl(experienceDetails.countryId),
      stateId: new FormControl(experienceDetails.stateId),
      designationId: new FormControl(experienceDetails.designationId, [Validators.required]),
      dateOfJoining: new FormControl(experienceDetails.dateOfJoining ? new Date(experienceDetails.dateOfJoining) : null),
      dateOfReliving: new FormControl(experienceDetails.dateOfReliving ? new Date(experienceDetails.dateOfReliving) : null),
      skillAreaIds: new FormControl(skillAreaIdsArray, [Validators.required]),
      workExperienceXrefs: new FormControl(experienceDetails.workExperienceXrefs),
    });

  }
  expDtlsformArrayControls(i: number, formControlName: string) {
    return this.faExperienceDetail().controls[i].get(formControlName);
  }


  initGetWorkExperience() {
    this.employeeService.GetWorkExperience(this.employeeId).subscribe((resp) => {
      this.workExperience = resp as unknown as employeeExperienceDtlsViewDto[];
      console.log('this.workExperience', this.workExperience);
    });
  }

  initdesignation() {
    this.lookupService.Designations().subscribe((resp) => {
      this.designation = resp as unknown as LookupViewDto[];
    })
  }

  initskillArea() {
    this.lookupService.SkillAreas().subscribe((resp) => {
      this.skillarea = resp as unknown as LookupViewDto[];
    })
  }

  onCountryChange(selectedCountryId: number, rowIndex: number) {
    // Update the selected country for the corresponding row
    this.selectedCountry[rowIndex] = selectedCountryId;
    // Update the states array for the specific row
    this.lookupService.States(selectedCountryId).subscribe((resp) => {
      if (resp) {
        this.statesPerRow[rowIndex] = resp as unknown as LookupViewDto[];
      }
    });
  }

  addexperienceDetails() {
    this.faexperienceDetails = this.fbexperience.get('experienceDetails') as FormArray;
    this.faexperienceDetails.push(this.generaterow());
    // const employeeId = parseInt(this.activatedRoute.snapshot.queryParams['employeeId']);
    // this.faexperienceDetails.controls.forEach((control: FormGroup) => {
    //   control.get('employeeId').setValue(employeeId);
    // });
  }

  faExperienceDetail(): FormArray {
    return this.fbexperience.get('experienceDetails') as FormArray
  }

  showExperienceDetails() {
    debugger
    this.workExperience.forEach((experienceDetails: any, rowIndex) => {
      // this.onSelectSkill(experienceDetails.skillAreaId,index)
      this.onCountryChange(experienceDetails.countryId, rowIndex);
      this.faexperienceDetail().push(this.generaterow(experienceDetails));
    })
    if (this.workExperience.length == 0) this.faexperienceDetail().push(this.generaterow());
    this.fbexperience.patchValue(this.workExperience)
    this.Experience = true;
  }
  faexperienceDetail(): FormArray {
    return this.fbexperience.get('experienceDetails') as FormArray;
  }

  onSelectSkill(e, index) {
    let CurrentArray = e.value;
    console.log(CurrentArray = e.value)
    let updatedArray = [];
    for (let i = 0; i < CurrentArray.length; i++) {
      updatedArray.push({
        workExperienceXrefId: 0,
        workExperienceId: 0,
        skillAreaId: CurrentArray[i]
      })
    }
    const experienceDetailControl = this.fbexperience.get('experienceDetails') as FormArray;
    const workExperienceXrefsControl = experienceDetailControl.at(index).get('workExperienceXrefs');
    if (workExperienceXrefsControl) {
      workExperienceXrefsControl.patchValue(updatedArray);
    }
  }

  onCloseExp() {
    this.Experience = false;
    (this.fbexperience.get('experienceDetails') as FormArray).clear();
  }

  saveEmpExperienceDetails() {
    this.employeeService.updateViewEmpExperienceDtls(this.fbexperience.get('experienceDetails').value).subscribe((resp) => {
      if (resp) {
        this.initGetWorkExperience();
        this.onCloseExp();
        this.alertMessage.displayAlertMessage(ALERT_CODES["EVEEXP001"]);
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["EVEEXP002"])
      }
    })
  }

  initviewAssets() {
    this.adminService.GetAssetAllotments(this.employeeId).subscribe((resp) => {
      if (resp) {
        this.assetAllotments = resp as unknown as AssetAllotmentViewDto[];
      }
    });
  }

  //Upload Documents
  initUploadedDocuments() {
    this.employeeService.GetUploadedDocuments(this.employeeId).subscribe((resp) => {
      this.UploadedDocuments = resp as unknown as any[];
    });
  }

  // Employee BankDetails
  initBankDetails() {
    this.employeeService.GetBankDetails(this.employeeId).subscribe((resp) => {
      this.bankDetails = resp as unknown as BankDetailViewDto[];
    });
  }

  //Employee Address
  initGetAddress() {
    this.employeeService.GetAddress(this.employeeId).subscribe((resp) => {
      this.address = resp as unknown as EmployeAdressViewDto[];
    });
  }

  initCountries() {
    this.lookupService.Countries().subscribe((resp) => {
      this.countries = resp as unknown as LookupViewDto[];
    })
  }
  getStatesByCountryId(id: number) {
    this.lookupService.States(id).subscribe((resp) => {
      if (resp) {
        this.states = resp as unknown as LookupViewDto[];
      }
    });
  }

  //Employee FamilyDetails
  initGetFamilyDetails() {
    this.employeeService.getFamilyDetails(this.employeeId).subscribe((resp) => {
      this.familyDetails = resp as unknown as FamilyDetailsViewDto[];
      console.log('this.familyDetails', this.familyDetails);
    });
  }

  toggleInputField(option: string) {
    this.selectedOption = option;
  }

  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }

  openComponentDialog(content: any,
    dialogData, action: Actions = this.ActionTypes.add) {
    if (action == Actions.unassign && content === this.unassignassetDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Unassign Asset";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.add && content === this.addassetallotmentDialogComponent) {
      this.dialogRequest.dialogData = {
        employeeId: parseInt(this.employeeId)
      }
      this.dialogRequest.header = "Add Asset";
      this.dialogRequest.width = "50%";
    }
    //Bank Details
    else if (action == Actions.edit && content === this.BankdetailsDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = " Bank Details";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.add && content === this.BankdetailsDialogComponent) {
      this.dialogRequest.dialogData = {
      }
      this.dialogRequest.header = "Add Bank Details";
      this.dialogRequest.width = "50%";
    }
    //Adress Details
    else if (action == Actions.edit && content === this.AddressDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Edit Address Details";
      this.dialogRequest.width = "70%";
    }
    else if (action == Actions.add && content === this.AddressDialogComponent) {
      this.dialogRequest.dialogData = {
      }
      this.dialogRequest.header = "Add Address Details";
      this.dialogRequest.width = "70%";
    }
    //uploadDocuments
    else if (action == Actions.add && content === this.uploadDocumentsDialogComponent) {
      this.dialogRequest.dialogData = {
      }
      this.dialogRequest.header = "Upload Documents";
      this.dialogRequest.width = "30%";
    }
    //Familydetails
    else if (action == Actions.edit && content === this.FamilydetailsDialogComponent) {

      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = " Update Family Details";
      this.dialogRequest.width = "70%";
    }
    else if (action == Actions.add && content === this.FamilydetailsDialogComponent) {
      this.dialogRequest.dialogData = {
      }
      this.dialogRequest.header = "Add Family Details";
      this.dialogRequest.width = "70%";
    }
    console.log("Before opening dialog");

    this.ref = this.dialogService.open(content, {
      data: this.dialogRequest.dialogData,
      header: this.dialogRequest.header,
      width: this.dialogRequest.width
    });


    this.ref.onClose.subscribe((res: any) => {
      debugger
      if (res.UpdatedModal == ViewEmployeeScreen.AssetAllotments) {
        this.initviewAssets();
      } else if (res.UpdatedModal == ViewEmployeeScreen.BankDetails) {
        this.initBankDetails();
      } else if (res.UpdatedModal == ViewEmployeeScreen.Address) {
        this.initGetAddress();
      } else if (res.UpdatedModal == ViewEmployeeScreen.FamilyDetails) {
        this.initGetFamilyDetails();
      } else if (res.UpdatedModal == ViewEmployeeScreen.UploadDocuments) {
        this.initUploadedDocuments();
      }
      event.preventDefault(); // Prevent the default form submission
    });
  }
}
