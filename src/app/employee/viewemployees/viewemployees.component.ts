import { Component } from '@angular/core';
import {
  Form, FormArray, FormBuilder, FormControl, FormGroup, Validators,
} from '@angular/forms'; import { ActivatedRoute } from '@angular/router';
import { Address, Employee, familyDetailViewDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { LookupViewDto } from 'src/app/_models/admin';
// import { EmployeAdressViewDto, EmployeeBasicDetailDto, EmployeeBasicDetailViewDto, EmployeeOfficedetailsviewDto,  } from 'src/app/_models/employes';
import {  BankDetailViewDto, BankDetailsDto, EmployeAdressViewDto, EmployeeBasicDetailDto, EmployeeBasicDetailViewDto, EmployeeOfficedetailsviewDto, EmployeesViewDto, FamilyDetailsViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { AssetAllotmentViewDto } from 'src/app/_models/admin/assetsallotment';
import { AdminService } from 'src/app/_services/admin.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { MaxLength } from 'src/app/_models/common';
import { MIN_LENGTH_2, MIN_LENGTH_8, RG_ALPHA_ONLY, RG_IFSC, RG_NUMERIC_ONLY } from 'src/app/_shared/regex';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
export class Experience {
  id?: number;
  companyName?: string;
  fromDate?: Date;
  toDate?: Date;
  designation?: string;
  experienceDetails?: string;
}
interface States {
  statename: string;
  code: string;
}
interface General {
  name: string;
  code: string;
}
interface Gender {
  name: string;
  code: string;
}
interface Shift {
  type: string;
  code: string;
}
interface Status {
  name: string;
  code: string;
}
interface Designation {
  name: string;
  code: string;
}
interface Skills {
  name: string;
  code: string;
}
@Component({
  selector: 'app-viewemployees',
  templateUrl: './viewemployees.component.html',
  styles: [],
})
export class ViewemployeesComponent {
  fbEmpBasDtls!: FormGroup;
  employeePrsDtls: EmployeeBasicDetailViewDto[]=[];
  employeePrsDtl = new EmployeeBasicDetailDto()
  fbOfficDtls!: FormGroup; 
  employeeofficeDtls :EmployeeOfficedetailsviewDto[];
  // adredss: any[];
  fbEmpPerDtls!: FormGroup;
  familyDetails: FamilyDetailsViewDto[];
  fafamilyDetails!: FormArray;
  fbfamilyDetails: FormGroup;
  adredss: EmployeAdressViewDto[];
  showAddressDetailss: boolean = false;
  Address: boolean = false;
  educationDetails: any[];
  faAddressDetails!: FormArray;
  fbAddressDetails: FormGroup;
  fbEducationDetails!: FormGroup;
  fbBankDetails!: FormGroup;
  faeducationDetails!: FormArray;
  Education: boolean = false;
  workExperience: any[];
  faexperienceDetails!: FormArray;
  UploadedDocuments: any[];
  bankDetails: boolean = false;
  bankDetail: BankDetailsDto[];
  bankDetails1: BankDetailViewDto[];
  selectedBankId: number | null = null;
  officeDtls: any[];
  assetAllotments: AssetAllotmentViewDto[] = [];
  color: string = 'bluegray';
  size: string = 'M';
  liked: boolean = false;
  dialog: boolean = false;
  visible: boolean = false;
  Experience: boolean = false;
  Family: boolean = false;
  Documents: boolean = false;
  ShoweducationDetails: boolean = false;
  ShowexperienceDetails: boolean = false;
  fbexperience!: FormGroup;
  images: string[] = [];
  selectedImageIndex: number = 0;
  quantity: number = 1;
  employees: Employee[] = [];
  genders: Gender[];
  shifts: Shift[];
  status: Status[];
  designation: Designation[];
  valRadio: string;
  skillSets!: Skills[];
  uploadedFiles: any[] = [];
  selectedOption: string;
  inputValue: string;
  maxLength: MaxLength = new MaxLength();
  addFlag: boolean = true;

 
 
  addfields: any;
  State: States[];
  relationshipStatus: General[];
  submitLabel: string;
  value: Date;
  states: LookupViewDto[] = [];
  employeeId: number;
  bloodgroups: LookupViewDto[] = [];
  mediumDate: string = MEDIUM_DATE

  
  Dialog() {
    this.visible = true;
    this.fbOfficDtls.reset();
  }
  ShowEducationDetails() {
    this.Education = true;
    this.fbEducationDetails.reset();
  }
  showExperienceDetails() {
    this.Experience = true;
    this.fbexperience.reset();
  }
  showFamilyDetails() {
    this.Family = true;
    this.fbfamilyDetails.reset();
  }
  showBankDetails() {
    this.bankDetails = true;
    this.fbBankDetails.reset();
  }
  showAddressDetails() {
    this.Address = true;
    this.fbAddressDetails.reset();
  }
  showDocumentsDetails() {
    this.Documents = true;
  }

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
    // this.shifts = [
    //   { type: 'Day Shift', code: 'DS' },
    //   { type: 'Night Shift', code: 'NS' },
    // ];
    this.status = [
      { name: 'Married', code: 'DS' },
      { name: 'Un Married', code: 'NS' },
      { name: 'Single', code: 'SN' },
    ];
    // this.designation = [
    //   { name: 'UI Developer', code: 'UD' },
    //   { name: 'BackEnd Developer', code: 'BD' },
    //   { name: 'FrontEnd Developer', code: 'FD' },
    // ];
    this.skillSets = [
      { name: 'Angular', code: 'AG' },
      { name: 'C#', code: 'C' },
      { name: 'MS Sql', code: 'MS' },
      { name: 'React', code: 'RE' },
      { name: 'Python', code: 'PY' },
    ];
    this.relationshipStatus = [
      { name: 'Father', code: 'father' },
      { name: 'Mother', code: 'mother' },
      { name: 'Spouse', code: 'spouse' },
      { name: 'Daughter', code: 'daughter' },
      { name: 'Son', code: 'son' },
      { name: 'Sister', code: 'sister' },
    ];
  }
  constructor(
    private securityService: SecurityService,
    private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private alertMessage:AlertmessageService
  ) { }

  initStates() {
    this.lookupService.getStates().subscribe((resp) => {
      this.states = resp as unknown as LookupViewDto[];
    });
  }

  ngOnInit(): void {
    this.securityService.getEmployees().then((data) => (this.employees = data));
    this.Data();
    this.initEducation();
    this.EmpBasicDtlsForm();
    this.bankDetailsForm();
    this.OfficDtlsForm();
    this.initEducation();
    this.addEducationDetails();
    this.initExperience();
    this.addexperienceDetails();
    this.initFamily();
    this.addFamilyMembers();
    this.initAddress();
    this.addNewAddress();
    this.initStates();
    this.initBloodGroups()
    this.getemployeeview();
  }

  getemployeeview() {
    this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
    this.initViewEmpDtls();
    this.initofficeEmpDtls();

    this.initGetEducationDetails();
    this.initGetWorkExperience();
    this.initGetFamilyDetails();
    this.initGetAddress();
    this.initUploadedDocuments();
    this.initBankDetails();
    this.initviewAssets()
  }

  EmpBasicDtlsForm() {
    this.fbEmpBasDtls = this.formbuilder.group({
      employeeId: new FormControl('', [Validators.required]),
      // employeeName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl('',),
      lastName: new FormControl('', [Validators.required]),
      code:new FormControl(null),
      gender: new FormControl('', [Validators.required]),
      bloodGroupId: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required]),
      alternateMobileNumber: new FormControl('', [Validators.required]),
      originalDob: new FormControl('', [Validators.required]),
      certificateDob: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]),
      emailId: new FormControl('', [Validators.required]),
      isActive: (''),
      signDate:('')
    });
  }

  initViewEmpDtls() {
    this.employeeService.GetViewEmpPersDtls(this.employeeId).subscribe((resp) => {
      this.employeePrsDtls = resp as unknown as EmployeeBasicDetailViewDto[];
      console.log('this.employeePrsDtls', this.employeePrsDtls);
    });
  }

  initBloodGroups() {
    this.lookupService.BloodGroups().subscribe((resp) => {
      this.bloodgroups = resp as unknown as LookupViewDto[];
    });
  }

  showEmpPersDtlsDialog(employeePrsDtls : EmployeeBasicDetailViewDto) {
    this.employeePrsDtl.employeeId = employeePrsDtls.employeeId;
    this.employeePrsDtl.firstName = employeePrsDtls.firstName;
    this.employeePrsDtl.middleName = employeePrsDtls.middleName;
    this.employeePrsDtl.lastName = employeePrsDtls.lastName;
    this.employeePrsDtl.gender = employeePrsDtls.gender;
     this.employeePrsDtl.code = employeePrsDtls.code;
    this.employeePrsDtl.bloodGroupId = employeePrsDtls.bloodGroupId;
    this.employeePrsDtl.mobileNumber = employeePrsDtls.mobileNumber;
    this.employeePrsDtl.alternateMobileNumber = employeePrsDtls.alternateMobileNumber;
    this.employeePrsDtl.originalDob = new Date(employeePrsDtls.originalDOB);
    this.employeePrsDtl.certificateDob = new Date(employeePrsDtls.certificateDOB);
    this.employeePrsDtl.maritalStatus = employeePrsDtls.maritalStatus;
    this.employeePrsDtl.emailId = employeePrsDtls.emailId;
    this.employeePrsDtl.signDate = employeePrsDtls.signDate;
    this.employeePrsDtl.isActive=true;
    this.fbEmpBasDtls.patchValue( this.employeePrsDtl);
    console.log(this.employeePrsDtl); 
    this.dialog = true;
  }
 
  saveEmpBscDtls(){
    debugger;
    this.employeeService.updateViewEmpPersDtls(this.fbEmpBasDtls.value).subscribe((resp) =>{
      if (resp) {
        this.initViewEmpDtls();
        this.onClose();
        this.dialog = false;
        // if (this.addFlag) {
        //   this.alertMessage.displayAlertMessage(ALERT_CODES["AAS001"]);
        // } else {
        //   this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag1 ? "AAS003" : "AAS002"]);
        // }
      }
      else {
        // this.alertMessage.displayErrorMessage(ALERT_CODES["AAS004"])
      }
    })
  }

  onClose() {
    this.fbEmpBasDtls.reset();
    this.fbBankDetails.reset();
    this.dialog = false;
  }
  OfficDtlsForm() {
    this.fbOfficDtls = this.formbuilder.group({
      employeeId: new FormControl('', [Validators.required]),
      timeIn: new FormControl('', [Validators.required]),
      timeOut: new FormControl('', [Validators.required]),
      officeEmailId: new FormControl('', [Validators.required]),
      dateofJoin: new FormControl('', [Validators.required]),
      reportingTo: new FormControl('', [Validators.required]),
      // projectName: new FormControl('', [Validators.required]),
      isPFEligible: new FormControl('', [Validators.required]),
      isESIEligible: new FormControl('', [Validators.required]),
    });
  }

  initofficeEmpDtls() {
    this.employeeService.EmployeeOfficedetailsviewDto(this.employeeId).subscribe((resp) => {
      this.employeeofficeDtls = resp as unknown as EmployeeOfficedetailsviewDto[];
      console.log('this.employeeofficeDtls', this.employeeofficeDtls);
    });
  }
  
  initUploadedDocuments() {
    this.employeeService.GetUploadedDocuments(this.employeeId).subscribe((resp) => {
      this.UploadedDocuments = resp as unknown as any[];
      console.log('this.UploadedDocuments', this.UploadedDocuments);
    });
  }
  
  initviewAssets() {
    this.adminService.GetAssetAllotments(this.employeeId).subscribe((resp) => {
      if (resp) {
        this.assetAllotments = resp as unknown as AssetAllotmentViewDto[];
        if (this.assetAllotments) this.employeeId = this.assetAllotments[0]?.employeeId;
        console.log('assetAllotments', this.assetAllotments);

      }
    });
  }

  initEducation() {
    this.fbEducationDetails = this.formbuilder.group({
      course: new FormControl(''),
      state: new FormControl(''),
      school: new FormControl(''),
      board: new FormControl(''),
      stream: new FormControl(''),
      yearofpass: new FormControl(''),
      gradingsystem: new FormControl(''),
      cgpa: new FormControl(''),
      educationDetails: this.formbuilder.array([]),
    });
  }
  initGetEducationDetails() {
    this.employeeService.GetEducationDetails(this.employeeId).subscribe((resp) => {
      this.educationDetails = resp as unknown as any[];
      console.log('this.EducationDetails', this.educationDetails);
    });
  }

  initBankDetails() {
    this.employeeService.GetBankDetails(this.employeeId).subscribe((resp) => {
      this.bankDetails1 = resp as unknown as BankDetailViewDto[];
      console.log('this.BankDetails', this.bankDetails1);
    });
  }
  bankDetailsForm() {
    this.fbBankDetails = this.formbuilder.group({
      bankId: [0],
      employeeId: this.employeeId,
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      branchName: new FormControl('', [Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      ifsc: new FormControl('', [Validators.required, Validators.pattern(RG_IFSC)]),
      accountNumber: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY), Validators.minLength(MIN_LENGTH_8)]),
      isActive: new FormControl(true)
    });

  }
  get FormControls() {
    return this.fbBankDetails.controls;
  }

  editBankDetails(index: number) {
    const bank = this.bankDetails1[index];
    this.fbBankDetails.patchValue({
      bankId: bank.bankDetailId,
      employeeId: bank.employeeId,
      name: bank.bankName,
      branchName: bank.branchName,
      ifsc: bank.ifsc,
      accountNumber: bank.accountNumber,
      isActive: bank.isActive
    });
    console.log(bank);
    this.bankDetails = true;
  }
  
  saveBankDetails() {

    const formValue = { ...this.fbBankDetails.value, employeeId: this.employeeId }; 
    this.employeeService.CreateBankDetails(formValue).subscribe((resp) => {
      if (resp) {
        this.initBankDetails();
        this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMBD001" : "SMBD002"]);
        this.onClose();
        this.bankDetails = false;
        // if (this.addFlag) {
        //   this.alertMessage.displayAlertMessage(ALERT_CODES["AAS001"]);
        // } else {
        //   this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag1 ? "AAS003" : "AAS002"]);
        // }
      }
      else {
        // this.alertMessage.displayErrorMessage(ALERT_CODES["AAS004"])
      }
    })
  }

  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }

  saveEducationDetails() {
    if (this.fbEducationDetails.valid) {
      const educationData = this.fbEducationDetails.value;
      this.educationDetails.push(educationData);
      this.clearForm();
      this.ShoweducationDetails = true;
    }
  }
  initExperience() {
    this.addfields = [];
    this.fbexperience = this.formbuilder.group({
      id: [],
      companyName: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      experienceDetails: this.formbuilder.array([]),
    });
  }
  initGetWorkExperience() {
    this.employeeService.GetWorkExperience(this.employeeId).subscribe((resp) => {
      this.workExperience = resp as unknown as any[];
      console.log('this.GetWorkExperience', this.workExperience);
    });
  }

  initAddress() {
    this.fbAddressDetails = this.formbuilder.group({
      Id: [''],
      AddressLine1: new FormControl('', [Validators.required]),
      AddressLine2: new FormControl('', [Validators.required]),
      Landmark: new FormControl('', [Validators.required]),
      ZIPCode: new FormControl('', [Validators.required]),
      City: new FormControl('', [Validators.required]),
      State: new FormControl('', [Validators.required]),
      Country: new FormControl('', [Validators.required]),
      IsActive: new FormControl('', [Validators.required]),
      CreatedAt: new FormControl('', [Validators.required]),
      UpdatedAt: new FormControl('', [Validators.required]),
      CreatedBy: new FormControl('', [Validators.required]),
      UpdatedBy: new FormControl('', [Validators.required]),
      addressType: [],
      addressDetails: this.formbuilder.array([])
    });
  }
  initGetAddress() {
    this.employeeService.GetAddress(this.employeeId).subscribe((resp) => {
      this.adredss = resp as unknown as EmployeAdressViewDto[];
      console.log('this.address', this.adredss);
    });
  }
  initFamily() {
    this.fbfamilyDetails = this.formbuilder.group({
      name: new FormControl('', [Validators.required]),
      relationShip: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required]),
      Address: new FormControl('', [Validators.required]),
      Nominee: new FormControl(true, [Validators.required]),
      familyDetails: this.formbuilder.array([]),
    });
  }
  initGetFamilyDetails() {
    this.employeeService.getFamilyDetails(this.employeeId).subscribe((resp) => {
      this.familyDetails = resp as unknown as FamilyDetailsViewDto[];
      console.log('this.familyDetails', this.familyDetails);
    });
  }

  generateExperienceDetailsRow(
    experienceDetails: Experience = new Experience()
  ): FormGroup {
    return this.formbuilder.group({
      id: [experienceDetails.id],
      companyName: new FormControl(experienceDetails.companyName, [
        Validators.required,
      ]),
      fromDate: new FormControl(experienceDetails.fromDate, [
        Validators.required,
      ]),
      toDate: new FormControl(experienceDetails.toDate, [
        Validators.required,
      ]),
      designation: new FormControl(experienceDetails.designation, [
        Validators.required,
      ]),
    });
  }
  generateFamilyDetailsRow(
    familyDetails: familyDetailViewDto = new familyDetailViewDto()
  ): FormGroup {
    return this.formbuilder.group({
      id: new FormControl(familyDetails.id),
      name: new FormControl(familyDetails.name, [Validators.required]),
      relationShip: new FormControl(familyDetails.relationShip, [
        Validators.required,
      ]),
      mobileNo: new FormControl(familyDetails.mobileNo, [
        Validators.required,
      ]),
      Address: new FormControl(familyDetails.Address, [
        Validators.required,
      ]),
    });
  }
  generateAddressDetailsRow(addressDetails: Address = new Address()): FormGroup {
    return this.formbuilder.group({
      Id: new FormControl(addressDetails.Id),
      AddressLine1: new FormControl(addressDetails.AddressLine1, [Validators.required,]),
      AddressLine2: new FormControl(addressDetails.AddressLine2, [Validators.required,]),
      Landmark: new FormControl(addressDetails.Landmark, [Validators.required,]),
      ZIPCode: new FormControl(addressDetails.ZIPCode, [Validators.required,]),
      City: new FormControl(addressDetails.City, [Validators.required]),
      State: new FormControl(addressDetails.State, [Validators.required]),
      Country: new FormControl(addressDetails.Country, [Validators.required,]),
      IsActive: new FormControl(addressDetails.IsActive, [Validators.required,]),
      CreatedAt: new FormControl(addressDetails.CreatedAt, [Validators.required,]),
      UpdatedAt: new FormControl(addressDetails.UpdatedAt, [Validators.required,]),
      CreatedBy: new FormControl(addressDetails.CreatedBy, [Validators.required,]),
      UpdatedBy: new FormControl(addressDetails.UpdatedBy, [Validators.required,]),
    });
  }
  generateEducationRow(): FormGroup {
    return this.formbuilder.group({
      course: new FormControl(''),
      state: new FormControl(''),
      school: new FormControl(''),
      board: new FormControl(''),
      stream: new FormControl(''),
      yearofpass: new FormControl(''),
      gradingsystem: new FormControl(''),
      cgpa: new FormControl(''),
    });
  }
  faexperienceDetail(): FormArray {
    return this.fbexperience.get('experienceDetails') as FormArray;
  }
  faeducationDetail(): FormArray {
    return this.fbEducationDetails.get('educationDetails') as FormArray;
  }
  faFamilyDetail(): FormArray {
    return this.fbfamilyDetails.get('familyDetails') as FormArray;
  }
  faAddressDetail(): FormArray {
    return this.fbAddressDetails.get('addressDetails') as FormArray;
  }

  addFamilyMembers() {
    this.fafamilyDetails = this.fbfamilyDetails.get('familyDetails') as FormArray;
    this.fafamilyDetails.push(this.generateFamilyDetailsRow());
  }
  addNewAddress() {
    this.showAddressDetailss = true;
    this.faAddressDetails = this.fbAddressDetails.get('addressDetails') as FormArray;
    this.faAddressDetails.push(this.generateAddressDetailsRow());
  }
  addexperienceDetails() {
    this.ShowexperienceDetails = true;
    this.faexperienceDetails = this.fbexperience.get('experienceDetails') as FormArray;
    this.faexperienceDetails.push(this.generateExperienceDetailsRow());
  }
  addEducationDetails() {
    this.ShoweducationDetails = true;
    this.faeducationDetails = this.fbEducationDetails.get('educationDetails') as FormArray;
    this.faeducationDetails.push(this.generateEducationRow());
  }
  onSubmit() {

  }
  onUpload(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
    // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  }
  onBasicUpload() {
    // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }
  clearForm() {
    this.fbEducationDetails.reset();
  }

  toggleInputField(option: string) {
    this.selectedOption = option;
  }
}
