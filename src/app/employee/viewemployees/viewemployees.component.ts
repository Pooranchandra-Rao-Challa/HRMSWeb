import { Component } from '@angular/core';
import {
  Form, FormArray, FormBuilder, FormControl, FormGroup, Validators,
} from '@angular/forms';import { ActivatedRoute } from '@angular/router';
 import { Address, Employee, familyDetailViewDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { LookupViewDto } from 'src/app/_models/admin';
import { EmployeAdressViewDto, EmployeeBasicDetailViewDto, EmployeeOfficedetailsviewDto, EmployeesViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';
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
  fbEmpPerDtls!: FormGroup;
 // employeePrsDtls: EmployeeBasicDetailViewDto[];
  employeePrsDtls: any[];
  adredss: any[];
  educationDetails: any[];
  workExperience: any[];
  familyDetails: any[];
  UploadedDocuments: any[];
  bankDetails: any[];
  officeDtls: any[];
  color: string = 'bluegray';
  size: string = 'M';
  liked: boolean = false;
  dialog: boolean = false;
  visible: boolean = false;
  Education: boolean = false;
  Experience: boolean = false;
  Family: boolean = false;
  bankDetailsshow: boolean = false;
  Address: boolean = false;
  Documents: boolean = false;
  ShoweducationDetails: boolean = false;
  ShowexperienceDetails: boolean = false;
  showAddressDetailss: boolean = false;
  images: string[] = [];
  selectedImageIndex: number = 0;
  quantity: number = 1;
  employees: Employee[] = [];
genders: Gender[];
shifts: Shift[] ;
status: Status[] ;
designation: Designation[] ;
valRadio:string; 
skillSets!: Skills[];
fbOfficDtls!: FormGroup; 
fbEducationDetails!: FormGroup; 
fbBankDetails!: FormGroup;  
fbexperience!: FormGroup;
fbAddressDetails: FormGroup;     
fbfamilyDetails: FormGroup;        
uploadedFiles: any[] = [];       
selectedOption: string;          
inputValue: string;              
faexperienceDetails!: FormArray; 
faeducationDetails!: FormArray;  
faAddressDetails!: FormArray;    
fafamilyDetails!: FormArray;     
addfields: any;                  
State: States[];                 
relationshipStatus: General[]  ;
  submitLabel: string;
  value:Date;
  states: LookupViewDto[] = [];
  employeeId: number;

  showDialog() {
    this.dialog = true;
    this.fbEmpPerDtls.reset();
  }
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
    this.bankDetailsshow =true;
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
    // private lookupService: LookupService,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute
  ) { }

  // initStates() {
  //   this.lookupService.getStates().subscribe((resp) => {
  //     this.states = resp as unknown as LookupViewDto[];
  //   });
  // }

  ngOnInit(): void {
    this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
     this.securityService.getEmployees().then((data) => (this.employees = data));
    this.Data();
    this.initGetEducationDetails();
    this.initGetWorkExperience();
    this.initGetAddress();
    this.initGetFamilyDetails();
    this.initUploadedDocuments();
    this.initBankDetails();
    this.initEducation();
    this.EmpPersDtlsForm();
    this.OfficDtlsForm();
    this.initEducation();
    this.addEducationDetails();
    this.initExperience();
    this.addexperienceDetails();
    this.initFamily();
    this.addFamilyMembers();
    this.initAddress();
    this.addNewAddress();
    this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
    this.initViewEmpDtls()
    // this.initStates();
  }

  getemployeeview(){
    this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
    this.initViewEmpDtls();
    this.initofficeEmpDtls();
  }

  EmpPersDtlsForm() {
    this.fbEmpPerDtls = this.formbuilder.group({
      employeeId: new FormControl('', [Validators.required]),
      employeeName: new FormControl('', [Validators.required]),
      code:new FormControl(''),
      gender: new FormControl('', [Validators.required]),
      bloodGroup: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required]),
      alternateMobileNumber: new FormControl('', [Validators.required]),
      originalDOB: new FormControl('', [Validators.required]),
      certificateDOB: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]),
      emailId: new FormControl('', [Validators.required]),
    });
  }

  initViewEmpDtls(){
    this.employeeService.GetViewEmpPersDtls(this.employeeId).subscribe((resp) => {
      this.employeePrsDtls = resp as unknown as any[];
      console.log('this.employeePrsDtls', this.employeePrsDtls);     
    });
  }
  initGetAddress(){
    this.employeeService.GetAddress(this.employeeId).subscribe((resp) => {
      this.adredss = resp as unknown as EmployeAdressViewDto[];
      console.log('this.address', this.adredss);     
    });
  }
  initGetEducationDetails() {
    this.employeeService.GetEducationDetails(this.employeeId).subscribe((resp) => {
      this.educationDetails = resp as unknown as any[];
      console.log('this.EducationDetails', this.educationDetails);
    });
  }
  
  initGetWorkExperience() {
    this.employeeService.GetWorkExperience(this.employeeId).subscribe((resp) => {
      this.workExperience = resp as unknown as any[];
      console.log('this.GetWorkExperience', this.workExperience);
    });
  }


  initGetFamilyDetails() {
    this.employeeService.getFamilyDetails(this.employeeId).subscribe((resp) => {
      this.familyDetails = resp as unknown as any[];
      console.log('this.familyDetails', this.familyDetails);
    });
  }

  initUploadedDocuments() {
    this.employeeService.GetUploadedDocuments(this.employeeId).subscribe((resp) => {
      this.UploadedDocuments = resp as unknown as any[];
      console.log('this.UploadedDocuments', this.UploadedDocuments);
    });
  }

  initBankDetails() {
    this.employeeService.GetBankDetails(this.employeeId).subscribe((resp) => {
      this.bankDetails = resp as unknown as any[];
      console.log('this.BankDetails', this.bankDetails);
    });
  }

  OfficDtlsForm() {
    this.fbOfficDtls = this.formbuilder.group({
      employeeId: new FormControl('', [Validators.required]),
      timeIn: new FormControl('', [Validators.required]),
      timeOut: new FormControl('', [Validators.required]),
      officeEmailId: new FormControl('', [Validators.required]),
      dateofJoin: new FormControl('', [Validators.required]),
      reportingTo: new FormControl('', [Validators.required]),
      // ProjectName: new FormControl('', [Validators.required]),
      isPFEligible: new FormControl('', [Validators.required]),
      isESIEligible: new FormControl('', [Validators.required]),
    });
  }

  initofficeEmpDtls(){
    this.employeeService.EmployeeOfficedetailsviewDto(this.employeeId).subscribe((resp) => {
      this.officeDtls = resp as unknown as EmployeeOfficedetailsviewDto[];
      console.log('this.employeeofficeDtls', this.officeDtls);     
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
  initBankdetailsF() {
    this.fbBankDetails = this.formbuilder.group({
      AccountNo: new FormControl('', [Validators.required]),
      IFSCCode: new FormControl('', [Validators.required]),
      BranchName: new FormControl('', [Validators.required]),
    });
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
      addressType:[],
      addressDetails: this.formbuilder.array([])
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
