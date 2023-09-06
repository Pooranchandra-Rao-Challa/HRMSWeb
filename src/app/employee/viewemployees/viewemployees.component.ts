import { Component } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Address, Employee, familyDetailViewDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';


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
  name: string,
  code: string
}
@Component({
  selector: 'app-viewemployees',
  templateUrl: './viewemployees.component.html',
  styles: [
  ]
})
export class ViewemployeesComponent {
  color: string = 'bluegray';

  size: string = 'M';

  liked: boolean = false;

  images: string[] = [];

  selectedImageIndex: number = 0;

  quantity: number = 1;

  employees: Employee[] = [];
  genders: Gender[] | undefined;
  shifts: Shift[] | undefined;
  status: Status[] | undefined;
  designation: Designation[] | undefined;
  dialog: boolean = false;
  visible: boolean = false;
  Education: boolean = false;
  Experience: boolean = false;
  Family: boolean = false;
  bankDetails:boolean=false;
  Address: boolean = false;
  Documents: boolean = false;
  skillSets!: Skills[];
  personalDetails !: FormGroup;
  OfficialDetails !: FormGroup;
  fbEducationDetails!: FormGroup;
  fbBankDetails!: FormGroup;
  educationDetails: any[] = [];
  ShoweducationDetails: boolean = false;
  uploadedFiles: any[] = [];
  showDialog() {
    this.dialog = true;
    this.personalDetails.reset();
  }
  Dialog() {
    this.visible = true;
    this.OfficialDetails.reset();
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
  showBankDetails(){
     this.bankDetails=true;
     this.fbBankDetails.reset();
  }
  showAddressDetails() {
    this.Address = true;
    this.fbAddressDetails.reset();
  }
  showDocumentsDetails() {
    this.Documents = true;
  }
  constructor(private securityService: SecurityService, private formbuilder: FormBuilder) { }

  States = [
    { name: 'Andhra Pradesh', code: 'AP' },
    { name: 'Telangana', code: 'TS' }
  ];
  Courses = [
    { name: 'SSC', code: 'SSC' },
    { name: 'Inter', code: 'Inter' },
    { name: 'Under Graduation', code: 'UG' },
    { name: 'Post Graduation', code: 'PG' },
  ]
  ngOnInit(): void {
    this.securityService.getEmployees().then((data) => (this.employees = data));

    this.images = ['product-overview-3-1.png', 'product-overview-3-2.png', 'product-overview-3-3.png', 'product-overview-3-4.png'];
    this.genders = [
      { name: 'Female', code: 'FM' },
      { name: 'Male', code: 'M' }
    ];
    this.shifts = [
      { type: 'Day Shift', code: 'DS' },
      { type: 'Night Shift', code: 'NS' }
    ];
    this.status = [
      { name: 'Married', code: 'DS' },
      { name: 'Un Married', code: 'NS' }
    ];
    this.designation = [
      { name: 'UI Developer', code: 'UD' },
      { name: 'BackEnd Developer', code: 'BD' },
      { name: 'FrontEnd Developer', code: 'FD' }
    ];
    this.skillSets = [
      { name: 'Angular', code: 'AG' },
      { name: 'C#', code: 'C' },
      { name: 'MS Sql', code: 'MS' },
      { name: 'React', code: 'RE' },
      { name: 'Python', code: 'PY' }
    ];
    this.personalDetails = this.formbuilder.group({
      Id: new FormControl('', [Validators.required]),
      Name: new FormControl('', [Validators.required]),
      Gender: new FormControl('', [Validators.required]),
      BloodGroup: new FormControl('', [Validators.required]),
      MobileNumber: new FormControl('', [Validators.required]),
      AltMobileNumber: new FormControl('', [Validators.required]),
      DOB: new FormControl('', [Validators.required]),
      CertificateDOB: new FormControl('', [Validators.required]),
      MaritalStatus: new FormControl('', [Validators.required]),
      EmailID: new FormControl('', [Validators.required]),
      CurrentAddress: new FormControl('', [Validators.required]),
      PermanentAddress: new FormControl('', [Validators.required]),
      SkillSet: new FormControl('', [Validators.required]),
    });
    this.fbBankDetails=this.formbuilder.group({
      AccountNo:new FormControl('', [Validators.required]),
      IFSCCode:new FormControl('', [Validators.required]),
      BranchName:new FormControl('', [Validators.required])
    });

    this.OfficialDetails = this.formbuilder.group({
      Id: new FormControl('', [Validators.required]),
      Shift: new FormControl('', [Validators.required]),
      OfficeEmailID: new FormControl('', [Validators.required]),
      JoiningDate: new FormControl('', [Validators.required]),
      Designation: new FormControl('', [Validators.required]),
      ReportedTo: new FormControl('', [Validators.required]),
      ProjectName: new FormControl('', [Validators.required]),
      PFEligible: new FormControl('', [Validators.required]),
      ESIEligible: new FormControl('', [Validators.required])
    });
    this.fbEducationDetails = this.formbuilder.group({
      course: new FormControl(''),
      state: new FormControl(''),
      school: new FormControl(''),
      board: new FormControl(''),
      stream: new FormControl(''),
      yearofpass: new FormControl(''),
      gradingsystem: new FormControl(''),
      cgpa: new FormControl(''),
    });

   this.educationForm();
   this.addEducationDetails();
    this.experienceForm();
    
    this.addexperienceDetails();
    this.relationshipStatus = [
      { name: 'Father', code: 'father' },
      { name: 'Mother', code: 'mother' },
      { name: 'Spouse', code: 'spouse' },
      { name: 'Daughter', code: 'daughter' },
      { name: 'Son', code: 'son' },
      { name: 'Sister', code: 'sister' }];
    this.initFamily();
    this.addFamilyMembers();
    this.State = [
      { statename: 'Andhra Pradesh', code: 'ap' },
      { statename: 'Telangana', code: 'ts' }
    ];
    this.initAddress();

    this.addNewAddress();
    
  }

  saveEducationDetails() {
    if (this.fbEducationDetails.valid) {
      const educationData = this.fbEducationDetails.value;
      this.educationDetails.push(educationData);
      this.clearForm();
      this.ShoweducationDetails = true;
    }
  }
  clearForm() {
    this.fbEducationDetails.reset();
  }
  selectedOption: string;
  inputValue: string;
  fbexperience!: FormGroup;

  faexperienceDetails!: FormArray;
  faeducationDetails!:FormArray;
  addfields: any;

  ShowexperienceDetails: boolean = false;
  toggleInputField(option: string) {
    this.selectedOption = option;
  }
  addexperienceDetails() {
    this.ShowexperienceDetails = true;
    this.faexperienceDetails = this.fbexperience.get("experienceDetails") as FormArray
    this.faexperienceDetails.push(this.generaterow())

  }
  addEducationDetails(){
    this.ShoweducationDetails=true;
    this.faeducationDetails=this.fbEducationDetails.get('educationDetails') as FormArray;
    this.faeducationDetails.push(this.generateEducationRow());
  }
  generateEducationRow():FormGroup{
    return this.formbuilder.group({
      course: new FormControl(''),
      state: new FormControl(''),
      school: new FormControl(''),
      board: new FormControl(''),
      stream: new FormControl(''),
      yearofpass: new FormControl(''),
      gradingsystem: new FormControl(''),
      cgpa: new FormControl(''),
     }) ; 
  }
  experienceForm() {
    this.addfields = []
    this.fbexperience = this.formbuilder.group({
      id: [],
      companyName: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      experienceDetails: this.formbuilder.array([])
    });
  }
  educationForm(){
    this.fbEducationDetails = this.formbuilder.group({
      course: new FormControl(''),
      state: new FormControl(''),
      school: new FormControl(''),
      board: new FormControl(''),
      stream: new FormControl(''),
      yearofpass: new FormControl(''),
      gradingsystem: new FormControl(''),
      cgpa: new FormControl(''),
      educationDetails:this.formbuilder.array([])
    });
  }
  generaterow(experienceDetails: Experience = new Experience()): FormGroup {
    return this.formbuilder.group({
      id: [experienceDetails.id],
      companyName: new FormControl(experienceDetails.companyName, [Validators.required]),
      fromDate: new FormControl(experienceDetails.fromDate, [Validators.required]),
      toDate: new FormControl(experienceDetails.toDate, [Validators.required]),
      designation: new FormControl(experienceDetails.designation, [Validators.required]),
    })
  }
  faexperienceDetail(): FormArray {
    return this.fbexperience.get("experienceDetails") as FormArray
  }
  faeducationDetail():FormArray{
    return this.fbEducationDetails.get('educationDetails') as FormArray;
  }
  relationshipStatus: General[] | undefined;
  fbfamilyDetails: FormGroup;
  fafamilyDetails!: FormArray;
  submitLabel: string;
  faFamilyDetail(): FormArray {
    return this.fbfamilyDetails.get("familyDetails") as FormArray
  }

  initFamily() {
    this.fbfamilyDetails = this.formbuilder.group({
      name: new FormControl('', [Validators.required]),
      relationShip: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required]),
      Address: new FormControl('', [Validators.required]),
      Nominee: new FormControl(true, [Validators.required]),
      familyDetails: this.formbuilder.array([])
    });
  }

  generaterow1(familyDetails: familyDetailViewDto = new familyDetailViewDto()): FormGroup {
    return this.formbuilder.group({
      id: new FormControl(familyDetails.id),
      name: new FormControl(familyDetails.name, [Validators.required]),
      relationShip: new FormControl(familyDetails.relationShip, [Validators.required]),
      mobileNo: new FormControl(familyDetails.mobileNo, [Validators.required]),
      Address: new FormControl(familyDetails.Address, [Validators.required]),
    });
  }

  addFamilyMembers() {
    this.fafamilyDetails = this.fbfamilyDetails.get("familyDetails") as FormArray
    this.fafamilyDetails.push(this.generaterow1())

  }
  State: States[] | undefined;
  fbAddressDetails: FormGroup;
  faAddressDetails!: FormArray;
  showAddressDetailss: boolean = false;
  faAddressDetail(): FormArray {
    return this.fbAddressDetails.get("addressDetails") as FormArray
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
      addressDetails: this.formbuilder.array([])
    });
  }

  generaterow2(addressDetails: Address = new Address()): FormGroup {
    return this.formbuilder.group({
      Id: new FormControl(addressDetails.Id),
      AddressLine1: new FormControl(addressDetails.AddressLine1, [Validators.required]),
      AddressLine2: new FormControl(addressDetails.AddressLine2, [Validators.required]),
      Landmark: new FormControl(addressDetails.Landmark, [Validators.required]),
      ZIPCode: new FormControl(addressDetails.ZIPCode, [Validators.required]),
      City: new FormControl(addressDetails.City, [Validators.required]),
      State: new FormControl(addressDetails.State, [Validators.required]),
      Country: new FormControl(addressDetails.Country, [Validators.required]),
      IsActive: new FormControl(addressDetails.IsActive, [Validators.required]),
      CreatedAt: new FormControl(addressDetails.CreatedAt, [Validators.required]),
      UpdatedAt: new FormControl(addressDetails.UpdatedAt, [Validators.required]),
      CreatedBy: new FormControl(addressDetails.CreatedBy, [Validators.required]),
      UpdatedBy: new FormControl(addressDetails.UpdatedBy, [Validators.required]),
    });
  }

  addNewAddress() {
    this.showAddressDetailss = true;
    this.faAddressDetails = this.fbAddressDetails.get("addressDetails") as FormArray
    this.faAddressDetails.push(this.generaterow2())

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
}
