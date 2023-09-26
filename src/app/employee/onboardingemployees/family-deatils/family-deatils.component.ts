import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { EmployeAdressViewDto, FamilyDetailsDto, FamilyDetailsViewDto } from 'src/app/_models/employes';
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
relationshipStatus: General[] |undefined ;
  fbfamilyDetails: FormGroup;
  showFamilyDetails: boolean = true;
  addfamilydetailsshowForm: boolean = false;
  submitLabel: string;
  employeeId: any;
  maxLength: MaxLength = new MaxLength();
  relationships: LookupDetailsDto[] = [];
  address: EmployeAdressViewDto[] = [];
  employee: number;
  ShowfamilyDetails: boolean = false;
  mediumDate: string = MEDIUM_DATE;
  addFlag: boolean = true;
  empFamDetails: FamilyDetailsDto[] = [];


  constructor(private router: Router,
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private employeeService: EmployeeService, private alertMessage: AlertmessageService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    this.getFamilyDetails();
    this.initFamily();
    this.initRelationship();
    this.initAddress();
  }
  headers: ITableHeader[] = [
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'relationshipId', header: 'relationshipId', label: 'Relationship' },
    { field: 'addressId', header: 'addressId', label: 'Address' },
    { field: 'dob', header: 'dob', label: 'DOB' },
    { field: 'adhaarNo', header: 'adhaarNo', label: 'Adhaar Number' },
    { field: 'panNo', header: 'panNo', label: 'Pan Number' },
    { field: 'mobileNumber', header: 'mobileNumber', label: 'Mobile Number' },
    { field: 'isNominee', header: 'isNominee', label: 'Is Nominee' }
  ];
  initFamily() {
    this.fbfamilyDetails = this.formbuilder.group({
      familyInformationId: [null],
      employeeId: this.employeeId,
      name: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
      relationshipId: new FormControl(null, [Validators.required]),
      addressId: new FormControl(null),
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
      this.relationships = resp as unknown as LookupDetailsDto[];
    });
  }
  initAddress() {
    this.employeeService.GetAddress(this.employeeId).subscribe((resp) => {
      this.address = resp as unknown as EmployeAdressViewDto[];
      console.log(resp);
    });
  }
  get FormControls() {
    return this.fbfamilyDetails.controls;
  }
  getFamilyDetails() {
    return this.employeeService.getFamilyDetails(this.employeeId).subscribe((data) => {
      this.empFamDetails = data as unknown as FamilyDetailsDto[];
      console.log(data)
    })
  }
  addFamilyMembers() {
    let famDetailId = this.fbfamilyDetails.get('familyInformationId').value
    if (famDetailId == null) {
      this.faFamilyDetail().push(this.generaterow(this.fbfamilyDetails.getRawValue()));
      for (let item of this.fbfamilyDetails.get('familyDetails').value) {
        console.log(item)
        let relationShipName = this.relationships.filter(x => x.lookupDetailId == item.relationshipId);
        item.relationship = relationShipName[0].name
        let addressName = this.address.filter(x => x.addressId == item.addressId);
        item.addressLine1 = addressName[0].addressLine1
        item.city = addressName[0].city
        item.state =addressName[0].state
        item.country =addressName[0].country
        this.empFamDetails.push(item)
      }
      this.clearForm();
      this.addFlag = true;
      this.fbfamilyDetails.get('isNominee').setValue(true);
    }
    else {
      this.addFlag = false;
      this.onSubmit();
    }
    this.addfamilydetailsshowForm = !this.addfamilydetailsshowForm;
    this.showFamilyDetails = !this.showFamilyDetails;
  }
  faFamilyDetail(): FormArray {
    return this.fbfamilyDetails.get("familyDetails") as FormArray
  }
  generaterow(familyDetails: FamilyDetailsDto = new FamilyDetailsDto()): FormGroup {
    return this.formbuilder.group({
      familyInformationId: new FormControl(familyDetails.familyInformationId),
      employeeId: new FormControl(familyDetails.employeeId),
      name: new FormControl(familyDetails.name),
      relationshipId: new FormControl(familyDetails.relationshipId),
      addressId: new FormControl(familyDetails.addressId),
      dob: new FormControl(familyDetails.dob),
      adhaarNo: new FormControl(familyDetails.adhaarNo),
      panno: new FormControl(familyDetails.panno),
      mobileNumber: new FormControl(familyDetails.mobileNumber),
      isNominee: new FormControl(familyDetails.isNominee),
    });
  }
  editAddressDetails(familyDetails) {
    this.fbfamilyDetails.patchValue({
      familyInformationId: familyDetails.familyInformationId,
      employeeId: familyDetails.employeeId,
      name: familyDetails.name,
      relationshipId: familyDetails.relationshipId,
      addressId: familyDetails.addressId,
      dob: FORMAT_DATE(new Date(familyDetails.dob)),
      adhaarNo: familyDetails.adhaarNo,
      panno: familyDetails.panNo,
      mobileNumber: familyDetails.mobileNumber,
      isNominee: familyDetails.isNominee,
    })
    this.addfamilydetailsshowForm = !this.addfamilydetailsshowForm;
    this.showFamilyDetails = !this.showFamilyDetails;
  }
  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }
  removeRow(index: number): void {
    if (index >= 0 && index < this.empFamDetails.length) {
      this.empFamDetails.splice(index, 1); // Remove 1 item at the specified index
    }
  }
  clearForm() {
    this.fbfamilyDetails.reset();
  }
  savefamilyDetails(): Observable<HttpEvent<FamilyDetailsDto[]>> {
    if (this.addFlag) {
      return this.employeeService.CreateFamilyDetails(this.empFamDetails);
    } else
      return this.employeeService.CreateFamilyDetails([this.fbfamilyDetails.value]);
  }
  onSubmit() {
    this.savefamilyDetails().subscribe(resp => {
      if (resp) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SFD001"]);
        this.navigateToNext();
      }
      else {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SFD002"]);
      }
      this.navigateToNext();
    })
    this.addfamilydetailsshowForm = !this.addfamilydetailsshowForm;
    this.showFamilyDetails = !this.showFamilyDetails;

  }
  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/uploadfiles', this.employeeId])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/bankdetails', this.employeeId])
  }

  toggleTab() {
    this.addfamilydetailsshowForm = !this.addfamilydetailsshowForm;
    this.showFamilyDetails = !this.showFamilyDetails;
  }
}
