import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';

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
  visible:boolean = false;
  skillSets!: Skills[];
  personalDetails !:FormGroup;
  OfficialDetails !:FormGroup;
  showDialog() {
    this.dialog = true;
this.personalDetails.reset();
  }
Dialog(){
  this.visible =true;
  this.OfficialDetails.reset();
}
  constructor(private securityService: SecurityService,private formbuilder:FormBuilder) { }
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
    MobileNumber : new FormControl('', [Validators.required]),
    AltMobileNumber : new FormControl('', [Validators.required]),
    DOB: new FormControl('', [Validators.required]),
    CertificateDOB: new FormControl('', [Validators.required]),
    MaritalStatus: new FormControl('', [Validators.required]),
    EmailID: new FormControl('', [Validators.required]),
    CurrentAddress: new FormControl('', [Validators.required]),
    PermanentAddress: new FormControl('', [Validators.required]),
    SkillSet: new FormControl('', [Validators.required]),
  });
  this.OfficialDetails= this.formbuilder.group({
    Id: new FormControl('', [Validators.required]),
    Shift: new FormControl('', [Validators.required]),
    OfficeEmailID: new FormControl('', [Validators.required]),
    JoiningDate: new FormControl('', [Validators.required]),
    Designation : new FormControl('', [Validators.required]),
    ReportedTo : new FormControl('', [Validators.required]),
    ProjectName: new FormControl('', [Validators.required]),
    PFEligible: new FormControl('', [Validators.required]),
    ESIEligible: new FormControl('', [Validators.required])
  });
  }
}
