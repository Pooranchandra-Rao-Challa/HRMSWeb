import { Component } from '@angular/core';
import {
  Form, FormArray, FormBuilder, FormControl, FormGroup, Validators,
} from '@angular/forms'; import { ActivatedRoute } from '@angular/router';
import { Address, Employee, familyDetailViewDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { LookupViewDto } from 'src/app/_models/admin';
// import { EmployeAdressViewDto, EmployeeBasicDetailDto, EmployeeBasicDetailViewDto, EmployeeOfficedetailsviewDto,  } from 'src/app/_models/employes';
import { BankDetailViewDto, Countries, EmployeAdressViewDto, EmployeeBasicDetailDto, EmployeeBasicDetailViewDto, EmployeeOfficedetailsDto, EmployeeOfficedetailsviewDto, EmployeesViewDto, FamilyDetailsViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { AssetAllotmentViewDto } from 'src/app/_models/admin/assetsallotment';
import { AdminService } from 'src/app/_services/admin.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { MAX_LENGTH_256, MIN_LENGTH_2, MIN_LENGTH_8, RG_ALPHA_ONLY, RG_IFSC, RG_NUMERIC_ONLY } from 'src/app/_shared/regex';
import { Actions, DialogRequest, MaxLength } from 'src/app/_models/common';
import { AddassetallotmentDialogComponent } from 'src/app/_dialogs/addassetallotment.dialog/addassetallotment.dialog.component';
import { UnassignassetDialogComponent } from 'src/app/_dialogs/unassignasset.dialog/unassignasset.dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
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
export class Status {
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
  // employee basic details
  fbEmpBasDtls!: FormGroup;
  employeePrsDtls = new EmployeeBasicDetailViewDto();
  employeePrsDtl = new EmployeeBasicDetailDto()
  imageSize: any;
  selectedFileBase64: string | null = null; // To store the selected file as base64
  status: Status[];
  // employee office details
  fbOfficDtls!: FormGroup;
  employeeofficeDtls = new EmployeeOfficedetailsviewDto();
  employeeofficDtl = new EmployeeOfficedetailsDto()
  // adredss: any[];
  fbEmpPerDtls!: FormGroup;
  familyDetails: FamilyDetailsViewDto[];
  fafamilyDetails!: FormArray;
  fbfamilyDetails: FormGroup;
  address: EmployeAdressViewDto[];
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
  bankDetails1: BankDetailViewDto[];
  officeDtls: any[];
  assetAllotments: AssetAllotmentViewDto[] = [];
  size: string = 'M';
  liked: boolean = false;
  dialog: boolean = false;
  officedialog: boolean = false;
  Experience: boolean = false;
  Family: boolean = false;
  bankDetailsshow: boolean = false;
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
  mediumDate: string = MEDIUM_DATE;
  countries: any
    ActionTypes = Actions;
    addassetallotmentDialogComponent = AddassetallotmentDialogComponent;
    unassignassetDialogComponent = UnassignassetDialogComponent;
    dialogRequest: DialogRequest = new DialogRequest();

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
    this.submitLabel = "Add Adress";
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
    this.status =[
      { name: 'Married', code: 'DS' },
        { name: 'Un Married', code: 'NS' },
        { name: 'Single', code: 'SN' },
    ]
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
    private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private alertMessage: AlertmessageService,
    public ref: DynamicDialogRef,
    private dialogService: DialogService
  ) { }




  ngOnInit(): void {
    this.getemployeeview();
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
    this.initStates();
    this.initGetAddress()
    this.initCountries()
    this.initBloodGroups()

  }

  getemployeeview() {
    this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
    this.initViewEmpDtls();
    this.initofficeEmpDtls();
    this.initGetEducationDetails();
    this.initGetWorkExperience();
    this.initGetFamilyDetails();
    this.initGetAddress
   this.initUploadedDocuments();
    this.initBankDetails();
    this.initviewAssets()
  }

// EMPLOYEE Basic details

  EmpBasicDtlsForm() {
    this.fbEmpBasDtls = this.formbuilder.group({
      employeeId: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl('',),
      lastName: new FormControl('', [Validators.required]),
      code: new FormControl(null),
      gender: new FormControl('', [Validators.required]),
      bloodGroupId: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required]),
      alternateMobileNumber: new FormControl('', [Validators.required]),
      originalDob: new FormControl('', [Validators.required]),
      certificateDob: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]),
      emailId: new FormControl('', [Validators.required]),
      isActive: (''),
      signDate: (''),
      photo: []
    });
  }

  initBloodGroups() {
    this.lookupService.BloodGroups().subscribe((resp) => {
      this.bloodgroups = resp as unknown as LookupViewDto[];
    });
  }

  initViewEmpDtls() {
    this.employeeService.GetViewEmpPersDtls(this.employeeId).subscribe((resp) => {
      this.employeePrsDtls = resp as unknown as EmployeeBasicDetailViewDto;
    });
  }

  showEmpPersDtlsDialog(employeePrsDtls: EmployeeBasicDetailViewDto) {
    this.employeePrsDtl = employeePrsDtls;
    this.employeePrsDtl.originalDob = new Date(employeePrsDtls.originalDOB);
    this.employeePrsDtl.certificateDob = new Date(employeePrsDtls.certificateDOB);
    this.employeePrsDtl.isActive = true;
    this.fbEmpBasDtls.patchValue(this.employeePrsDtl);
    this.dialog = true;
  }

  saveEmpBscDtls() {
    this.employeeService.updateViewEmpPersDtls(this.fbEmpBasDtls.value).subscribe((resp) => {
      if (resp) {
        this.initViewEmpDtls();
        this.dialog = false;
        this.fbEmpBasDtls.reset();
        this.alertMessage.displayAlertMessage(ALERT_CODES["EVEBD001"]);
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["EVEBD002"])
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
      strTimeIn: new FormControl('', [Validators.required]),
      strTimeOut: new FormControl('', [Validators.required]),
      officeEmailId: new FormControl('', [Validators.required]),
      dateofJoin: new FormControl('', [Validators.required]),
      reportingToId: new FormControl('', [Validators.required]),
      isPfeligible: new FormControl(''),
      isEsieligible: new FormControl(''),
      isActive: (''),
    });
  }

  initofficeEmpDtls() {
    this.employeeService.EmployeeOfficedetailsviewDto(this.employeeId).subscribe((resp) => {
      this.employeeofficeDtls = resp as unknown as EmployeeOfficedetailsviewDto;
      console.log('this.employeeofficeDtls', this.employeeofficeDtls);
    });
  }

  showEmpOfficDtlsDialog(employeeOfficeDtls: EmployeeOfficedetailsviewDto) {
    this.employeeofficDtl = employeeOfficeDtls;
    this.employeeofficDtl.strTimeIn = employeeOfficeDtls.timeIn?.substring(0, 5);
    this.employeeofficDtl.strTimeOut = employeeOfficeDtls.timeOut?.substring(0, 5);
    this.employeeofficDtl.dateofJoin = new Date(employeeOfficeDtls.dateofJoin);
    this.employeeofficDtl.isPfeligible = employeeOfficeDtls.isPFEligible;
    this.employeeofficDtl.isEsieligible = employeeOfficeDtls.isESIEligible;
    this.employeeofficDtl.isActive = true;
    this.fbOfficDtls.patchValue(this.employeeofficDtl);
    this.officedialog = true;
  }

  saveEmpOfficDtls() {
    this.employeeService.updateViewEmpOfficDtls(this.fbOfficDtls.value).subscribe((resp) => {
      if (resp) {
        this.initofficeEmpDtls();
        this.officedialog = false;
        this.fbOfficDtls.reset();
        this.alertMessage.displayAlertMessage(ALERT_CODES["EVEOFF001"]);
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["EVEOFF002"])
      }
    })
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
    console.log(bank)
      ;
    this.bankDetails = true;
  }

  saveBankDetails() {
    const formValue = { ...this.fbBankDetails.value, employeeId: this.employeeId };
    const isUpdate = this.fbBankDetails.value.bankId !== null;
    this.employeeService.CreateBankDetails(formValue).subscribe((resp) => {
      if (resp) {
        const alertCode = isUpdate ? "SMBD002" : "SMBD001";
        this.alertMessage.displayAlertMessage(ALERT_CODES[alertCode]);
        this.initBankDetails();

        this.bankDetails = false;
      }
    });
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
      employeeId: [22],
      addressId: [''],
      addressLine1: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      addressLine2: new FormControl(''),
      landmark: new FormControl(''),
      zipcode: new FormControl(''),
      city: new FormControl(''),
      stateId: new FormControl(''),
      countryId: new FormControl(''),
      addressType: new FormControl(''),
      isActive: [true]
    })
  }
  initGetAddress() {
    this.employeeService.GetAddress(this.employeeId).subscribe((resp) => {
      this.address = resp as unknown as EmployeAdressViewDto[];
      console.log('this.address', this.address);
    });
  }
  initStates() {
    this.employeeService.Getstates().subscribe((resp) => {
      this.states = resp as unknown as States[];
      console.log(this.states)
    })
  }
  initCountries() {
    this.employeeService.GetCountries().subscribe((resp) => {
      this.countries = resp as unknown as Countries[];
    })
  }

  onSelectState(e) {
    this.fbAddressDetails.get('State')?.setValue(e.value.lookupDetailId);
  }
  onSelectCountry(e) {
    this.fbAddressDetails.get('Country')?.setValue(e.value.lookupDetailId);
  }

  editAddress(index: number) {
    const address = this.address[index];
    this.fbAddressDetails.patchValue({
      addressId: address.addressId,
      employeeId: address.employeeId,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      landmark: address.landmark,
      zipcode: address.zipCode,
      city: address.city,
      stateId: address.stateId, // Assuming stateId is correct
      countryId: address.countryId, // Assuming countryId is correct
      addressType: address.addressType,
      isActive: address.isActive
    });
    this.submitLabel = "Update Adress";
    console.log(address);
    this.Address = true;

  }
  saveAddress() {
    const formValue = { ...this.fbAddressDetails.value, employeeId: this.employeeId };
    const isUpdate = this.fbAddressDetails.value.addressId !== null;
    // Set isActive to true if addressId is not provided (new address creation)
    if (!isUpdate) {
      formValue.isActive = true;
    }
    this.employeeService.CreateAddress(formValue).subscribe((resp) => {
      if (resp) {
        const alertCode = isUpdate ? "SMBD002" : "SMBD001";
        this.alertMessage.displayAlertMessage(ALERT_CODES[alertCode]);
        this.initAddress();
        this.Address = false;
      }
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

  addFamilyMembers() {
    this.fafamilyDetails = this.fbfamilyDetails.get('familyDetails') as FormArray;
    this.fafamilyDetails.push(this.generateFamilyDetailsRow());
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

    openComponentDialog(content: any,
        dialogData, action: Actions = this.ActionTypes.add) {
            debugger
        if (action == Actions.unassign && content === this.unassignassetDialogComponent) {
            this.dialogRequest.dialogData = dialogData;
            this.dialogRequest.header = "Unassign Asset";
            this.dialogRequest.width = "40%";
        }
        else if (action == Actions.add && content === this.addassetallotmentDialogComponent) {
            this.dialogRequest.dialogData = {
                employeeId: this.employeeId
            }
            this.dialogRequest.header = "Asset Allotment";
            this.dialogRequest.width = "70%";
        }
        this.ref = this.dialogService.open(content, {
            data: this.dialogRequest.dialogData,
            header: this.dialogRequest.header,
            width: this.dialogRequest.width
        });
        this.ref.onClose.subscribe((res: any) => {
            if (res) this.initviewAssets();
            event.preventDefault(); // Prevent the default form submission
        });
    }
}
