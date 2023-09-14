import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { familyDetailViewDto } from 'src/app/demo/api/security';
import { LookupViewDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { EmployeAdressViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MIN_LENGTH_2, RG_PANNO, RG_PHONE_NO } from 'src/app/_shared/regex';

interface General {
  name: string;
  code: string;
}

@Component({
  selector: 'app-family-deatils',
  templateUrl: './family-deatils.component.html',
  styleUrls: []
})
export class FamilyDeatilsComponent implements OnInit {
  relationshipStatus: General[] | undefined;
  fbfamilyDetails: FormGroup;
  fafamilyDetails!: FormArray;
  showFamilyDetails: boolean = true;
  submitLabel: string;
  employeeId: number;
  maxLength: MaxLength = new MaxLength();
  relationships: LookupViewDto[] = [];
  address: EmployeAdressViewDto[]=[];
  employee:number;
  constructor(private router: Router, 
              private route: ActivatedRoute, 
              private formbuilder: FormBuilder, 
              private lookupService: LookupService,
              private employeeService: EmployeeService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employee = params['employee'];
    });
    console.log(this.employeeId)
    this.initFamily();
    this.addFamilyMembers();
    this.initRelationship();
    this.initAddress();
  }

  initFamily() {
    this.fbfamilyDetails = this.formbuilder.group({
      familyInformationId: [0],
      employeeId: [0],
      name: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
      relationshipId: new FormControl(null, [Validators.required]),
      addressId: [0],
      dob: new FormControl('', [Validators.required]),
      adhaarNo: new FormControl('', [Validators.required]),
      panno: new FormControl('', [Validators.pattern(RG_PANNO)]),
      mobileNumber: new FormControl('', [Validators.required, Validators.pattern(RG_PHONE_NO)]),
      isNominee: new FormControl(true),
      familyDetails: this.formbuilder.array([])
    });
  }

  initRelationship() {
    this.lookupService.Relationships().subscribe((resp) => {
      this.relationships = resp as unknown as LookupViewDto[];
    });
  }
  initAddress() {
    this.employeeService.GetAddress(5).subscribe((resp) => {
      this.address = resp as unknown as EmployeAdressViewDto[];
      console.log('this.address', this.address);
    });
  }
  get FormControls() {
    return this.fbfamilyDetails.controls;
  }
  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }
  faFamilyDetail(): FormArray {
    return this.fbfamilyDetails.get("familyDetails") as FormArray
  }

  generaterow(familyDetails: familyDetailViewDto = new familyDetailViewDto()): FormGroup {
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
    this.fafamilyDetails.push(this.generaterow())

  }
  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/uploadfiles'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/bankdetails'])
  }


}
