import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { AddressDetailsDto, EmployeAdressViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { MAX_LENGTH_256, MAX_LENGTH_50, MAX_LENGTH_6, MIN_LENGTH_2, MIN_LENGTH_6, RG_ALPHA_NUMERIC, RG_PINCODE } from 'src/app/_shared/regex';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { LookupService } from 'src/app/_services/lookup.service';
import { JwtService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styles: [
  ]
})
export class AddressComponent {
  states: LookupDetailsDto[] = [];
  countries: LookupDetailsDto[] = [];
  fbAddressDetails: FormGroup;
  faAddressDetails!: FormArray;
  submitLabel: string;
  employeeId: any;
  addFlag: boolean = true;
  maxLength: MaxLength = new MaxLength();
  empAddrDetails: any = [];
  permissions: any;
  showAddressDetails: boolean = true;
  addaddressdetailsshowForm: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute,  private jwtService: JwtService,private formbuilder: FormBuilder,
    private alertMessage: AlertmessageService, private employeeService: EmployeeService,
    private lookupService: LookupService,
  ) { }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    this.initAddress();
    this.initCountries();
    this.getEmpAddressDetails();
  }
  initCountries() {
    this.lookupService.Country().subscribe((resp) => {
      this.countries = resp as unknown as LookupDetailsDto[];
    })
  }
  getStatesByCountryId(id: number) {
    this.lookupService.getStates(id).subscribe((resp) => {
      if (resp) {
        this.states = resp as unknown as LookupDetailsDto[];
      }
    })
  }

  initAddress() {
    this.fbAddressDetails = this.formbuilder.group({
      employeeId: [this.employeeId],
      addressId: [null],
      addressLine1: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      addressLine2: new FormControl('', [Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      landmark: new FormControl('', [Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      zipCode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      stateId: new FormControl('', [Validators.required]),
      countryId: new FormControl('', [Validators.required]),
      addressType: new FormControl('', [Validators.required]),
      isActive: new FormControl(true, Validators.requiredTrue),
      addressDetails: this.formbuilder.array([])
    });
  }
  headers: ITableHeader[] = [
    { field: 'addressLine1', header: 'addressLine1', label: 'AddressLine1' },
    { field: 'addressLine2', header: 'addressLine2', label: 'AddressLine2' },
    { field: 'landmark', header: 'landmark', label: 'Landmark' },
    { field: 'zipCode', header: 'zipCode', label: 'ZIPCode' },
    { field: 'city', header: 'city', label: 'City' },
    { field: 'stateId', header: 'stateId', label: 'State' },
    { field: 'addressType', header: 'addressType', label: 'AddressType' },
    { field: 'isActive', header: 'isActive', label: 'IsActive' }
  ];
  removeItem(index: number): void {
    this.empAddrDetails.splice(index, 1);
  }

  addAddress() {
    if (this.fbAddressDetails.get('addressId').value) {
      this.onSubmit();
    }
    else {
      if (this.fbAddressDetails.invalid) {
        return;
      }
      let count = 0, count1 = 0;
      let addressArray = this.empAddrDetails;
      let length = addressArray.length;
      if (length > 0) {
        addressArray.forEach((control) => {
          if (control.addressType == "PermanentAddress" && this.fbAddressDetails.get('addressType').value == "PermanentAddress") {
            count++;
          }
          if (control.addressType == "CurrentAddress" && this.fbAddressDetails.get('addressType').value == "CurrentAddress") {
            count1++;
          }
        });
        if (count >= 1 || count1 >= 1) {
          this.alertMessage.displayErrorMessage(count >= 1 ? ALERT_CODES["SAP001"] : ALERT_CODES['SAC001']);
          this.fbAddressDetails.get('addressType')?.setValue('');
          this.fbAddressDetails.markAllAsTouched();
        }
        else {
          this.save();
        }
      }
    else{
      this.save();
    }
  }
  this.addaddressdetailsshowForm = !this.addaddressdetailsshowForm;
  this.showAddressDetails = !this.showAddressDetails;
  }

  save() {
    // Push current values into the FormArray
    this.faAddressDetail().push(this.generaterow(this.fbAddressDetails.getRawValue()));
    // Reset form controls for the next entry
    for (let item of this.fbAddressDetails.get('addressDetails').value) {
      let stateName = this.states.filter(x => x.lookupDetailId == item.stateId);
      item.state = stateName[0].name
      this.empAddrDetails.push(item)
    }
    this.fbAddressDetails.patchValue({
      employeeId: this.employeeId,
      addressId: null,
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      zipCode: '',
      city: '',
      stateId: '',
      addressType: '',
      isActive: true,
    });
    // Clear validation errors
    this.fbAddressDetails.markAsPristine();
    this.fbAddressDetails.markAsUntouched();

  }

  faAddressDetail(): FormArray {
    return this.fbAddressDetails.get('addressDetails') as FormArray
  }
  get FormControls() {
    return this.fbAddressDetails.controls;
  }
  generaterow(addressDetails: AddressDetailsDto = new AddressDetailsDto()): FormGroup {
    const formGroup = this.formbuilder.group({
      employeeId: new FormControl({ value: addressDetails.employeeId, disabled: true }),
      addressId: new FormControl({ value: addressDetails.addressId, disabled: true }),
      addressLine1: new FormControl({ value: addressDetails.addressLine1, disabled: true }),
      addressLine2: new FormControl({ value: addressDetails.addressLine2, disabled: true }),
      landmark: new FormControl({ value: addressDetails.landmark, disabled: true }),
      zipCode: new FormControl({ value: addressDetails.zipCode, disabled: true }),
      city: new FormControl({ value: addressDetails.city, disabled: true }),
      stateId: new FormControl({ value: addressDetails.stateId, disabled: true }),
      addressType: new FormControl({ value: addressDetails.addressType, disabled: true }),
      isActive: new FormControl({ value: addressDetails.isActive, disabled: true }),
    });
    return formGroup;
  }
  saveAddress(): Observable<HttpEvent<any>> {
    if (this.addFlag)
      return this.employeeService.CreateAddress(this.empAddrDetails);
    else
      return this.employeeService.CreateAddress([this.fbAddressDetails.value]);
  }
  getEmpAddressDetails() {
    this.employeeService.GetAddress(this.employeeId).subscribe((data) => {
      this.empAddrDetails = data;
    })
  }
  onSubmit() {
    this.saveAddress().subscribe(res => {
      this.addFlag = true;
      if (res) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SAD001"]);
        this.navigateToNext();
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["SAD001"]);
      }
    });
  }
  clearForm() {
    this.fbAddressDetails.reset();
  }

  editForm(addressDetails) {
    this.addFlag = false;
    this.getStatesByCountryId(addressDetails.countryId)
    this.fbAddressDetails.patchValue({
      employeeId: addressDetails.employeeId,
      addressId: addressDetails.addressId,
      addressLine1: addressDetails.addressLine1,
      addressLine2: addressDetails.addressLine2,
      landmark: addressDetails.landmark,
      zipCode: addressDetails.zipCode,
      city: addressDetails.city,
      countryId: addressDetails.countryId,
      stateId: addressDetails.stateId,
      addressType: addressDetails.addressType,
      isActive: addressDetails.isActive,
    })
    this.addaddressdetailsshowForm = !this.addaddressdetailsshowForm;
    this.showAddressDetails = !this.showAddressDetails;
  }


  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/experiencedetails', this.employeeId])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/uploadfiles', this.employeeId])
  }
  toggleTab() {
    this.addaddressdetailsshowForm = !this.addaddressdetailsshowForm;
    this.showAddressDetails = !this.showAddressDetails;
  }
}
