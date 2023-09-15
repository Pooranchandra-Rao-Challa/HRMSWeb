import { DatePipe } from '@angular/common';
import { HttpEvent } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { familyDetailViewDto } from 'src/app/demo/api/security';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { LookupViewDto } from 'src/app/_models/admin';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { EmployeAdressViewDto, FamilyDetailsDto } from 'src/app/_models/employes';
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
  address: EmployeAdressViewDto[] = [];
  employee: number;
  familyDetails: FamilyDetailsDto[] = [];
  ShowfamilyDetails: boolean = false;
  mediumDate: string = MEDIUM_DATE;
  addFlag: boolean = true;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private employeeService: EmployeeService, private alertMessage: AlertmessageService) { }

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
  headers: ITableHeader[] = [
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'relationshipId', header: 'relationshipId', label: 'Relationship' },
    { field: 'addressId', header: 'addressId', label: 'Address' },
    { field: 'dob', header: 'dob', label: 'DOB' },
    { field: 'adhaarNo', header: 'adhaarNo', label: 'Adhaar Number' },
    { field: 'panno', header: 'panno', label: 'Pan Number' },
    { field: 'mobileNumber', header: 'mobileNumber', label: 'Mobile Number' },
    { field: 'isNominee', header: 'isNominee', label: 'Is Nominee' }
  ];
  initFamily() {
    this.fbfamilyDetails = this.formbuilder.group({
      familyInformationId: [null],
      employeeId: [22],
      name: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
      relationshipId: new FormControl(null, [Validators.required]),
      addressId: new FormControl(null),
      dob: new FormControl('', [Validators.required]),
      adhaarNo: new FormControl('', [Validators.required]),
      panno: new FormControl('', [Validators.pattern(RG_PANNO)]),
      mobileNumber: new FormControl('', [Validators.required, Validators.pattern(RG_PHONE_NO)]),
      isNominee: new FormControl(true),
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

  generaterow(familyDetails: FamilyDetailsDto = new FamilyDetailsDto()): FormGroup {
    return this.formbuilder.group({
      familyInformationId: new FormControl(familyDetails.familyInformationId),
      employeeId: new FormControl(familyDetails.employeeId),
      name: new FormControl(familyDetails.name, [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
      relationshipId: new FormControl(familyDetails.relationshipId, [Validators.required]),
      addressId: new FormControl(familyDetails.addressId),
      dob: new FormControl(familyDetails.dob, [Validators.required]),
      adhaarNo: new FormControl(familyDetails.adhaarNo, [Validators.required]),
      panno: new FormControl(familyDetails.panno, [Validators.pattern(RG_PANNO)]),
      mobileNumber: new FormControl(familyDetails.mobileNumber, [Validators.required, Validators.pattern(RG_PHONE_NO)]),
      isNominee: new FormControl(familyDetails.isNominee),
    });
  }
  clearForm() {
    this.fbfamilyDetails.reset();
    this.fbfamilyDetails.get('isNominee').setValue(true);
  }
  addFamilyMembers() {
    if (this.fbfamilyDetails.valid) {
      const familyData = this.fbfamilyDetails.value;
      this.familyDetails.push(familyData);
      this.fbfamilyDetails.disable;
      console.log(this.familyDetails.values);
      this.clearForm();
      this.ShowfamilyDetails = true;
    }
  }
  savefamilyDetails(): Observable<HttpEvent<FamilyDetailsDto[]>> {
    return this.employeeService.CreateFamilyDetails(this.familyDetails);
  }
  onSubmit() {
    if (this.addFlag) {
      this.save();
    }
    else {
      this.fbfamilyDetails.markAllAsTouched();
    }
  }
  save() {
    this.savefamilyDetails().subscribe(resp => {
      console.log(resp);
      // this.employeeId = resp;
      this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SFD001" : "SFD002"]);

      this.navigateToNext()
    })

  }
  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/uploadfiles'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/bankdetails'])
  }


}
