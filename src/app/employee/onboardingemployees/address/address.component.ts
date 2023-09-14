import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Address } from 'src/app/demo/api/security';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { AddressDetailsDto, Countries, States } from 'src/app/_models/employes';
// import { States } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { MAX_LENGTH_256, MAX_LENGTH_50, MIN_LENGTH_2, RG_ALPHA_NUMERIC } from 'src/app/_shared/regex';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styles: [
  ]
})
export class AddressComponent {
  states: States[] = [];
  countries: Countries[] = [];
  ShowlookupDetails: boolean = false;
  fbAddressDetails: FormGroup;
  faAddressDetails!: FormArray;
  submitLabel: string;
  addressDetails: any[] = [];
  employeeId: any;
  constructor(private router: Router, private route: ActivatedRoute, private formbuilder: FormBuilder,
    private alertMessage: AlertmessageService, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    this.initAddress();
    this.initStates();
    this.initCountries();
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

  initAddress() {
    this.fbAddressDetails = this.formbuilder.group({
      employeeId: [22],
      addressId: [0],
      AddressLine1: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      AddressLine2: new FormControl('', [ Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      Landmark: new FormControl('', [ Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      ZIPCode: new FormControl('',[Validators.required]),
      City: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      stateId: new FormControl('',[Validators.required]),
      countryId: new FormControl('',[Validators.required]),
      addressType: new FormControl('',[Validators.required,Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      IsActive: new FormControl(true, Validators.requiredTrue),
      addressDetails: this.formbuilder.array([])
    });
  }
  addAddress() {
    if (this.fbAddressDetails.invalid) {
      return;
    }
    this.save();
    let count = 0;
    let count1 = 0;
    const addressArray = this.fbAddressDetails.get('addressDetails').value;
    const length = addressArray.length;
    console.log(addressArray)
    if (length > 0) {
      addressArray.forEach((control, index) => {
        console.log(control);
        
        if (control.addressType == "PermanentAddress") {
          count++;
        }
        if (control.addressType == "CurrentAddress") {
          count1++;
        }
      });
      if (count >= 2) {
        this.alertMessage.displayErrorMessage(ALERT_CODES["SAP001"]);
        this.fbAddressDetails.markAllAsTouched();
      }
      else if (count1 >= 2) {
        this.alertMessage.displayErrorMessage(ALERT_CODES["SAC001"]);
        this.fbAddressDetails.markAllAsTouched();
      }
    }

  }

  save() {

    // Push current values into the FormArray
    this.faAddressDetail().push(this.generaterow(this.fbAddressDetails.getRawValue()));
    // Reset form controls for the next entry
    this.fbAddressDetails.patchValue({
      employeeId: 22,
      addressId: null,
      AddressLine1: '',
      AddressLine2: '',
      Landmark: '',
      ZIPCode: '',
      City: '',
      stateId: '',
      countryId: '',
      addressType: '',
      IsActive: true,
    });
    // Clear validation errors
    this.fbAddressDetails.markAsPristine();
    this.fbAddressDetails.markAsUntouched();
  }

  faAddressDetail(): FormArray {
    return this.fbAddressDetails.get('addressDetails') as FormArray
  }
  onSelectState(e) {
    this.fbAddressDetails.get('stateId')?.setValue(e.value.lookupDetailId);
  }
  onSelectCountry(e) {
    this.fbAddressDetails.get('countryId')?.setValue(e.value.lookupDetailId);
  }
  generaterow(addressDetails: AddressDetailsDto = new AddressDetailsDto()): FormGroup {
    const formGroup = this.formbuilder.group({
      employeeId: new FormControl({ value: 22, disabled: true }),
      addressId: new FormControl({ value: addressDetails.addressId, disabled: true }),
      AddressLine1: new FormControl({ value: addressDetails.AddressLine1, disabled: true }),
      AddressLine2: new FormControl({ value: addressDetails.AddressLine2, disabled: true }),
      Landmark: new FormControl({ value: addressDetails.Landmark, disabled: true }),
      ZIPCode: new FormControl({ value: addressDetails.ZIPCode, disabled: true }),
      City: new FormControl({ value: addressDetails.City, disabled: true }),
      stateId: new FormControl({ value: addressDetails.stateId, disabled: true }),
      countryId: new FormControl({ value: addressDetails.countryId, disabled: true }),
      addressType: new FormControl({ value: addressDetails.addressType, disabled: true }),
      IsActive: new FormControl({ value: addressDetails.IsActive, disabled: true }),
    });
    return formGroup;
  }
  saveAddress(): Observable<HttpEvent<any>> {
    return this.employeeService.CreateAddress(this.fbAddressDetails.get('addressDetails').value);
  }
  onSubmit() {
    this.saveAddress().subscribe(res => {
      this.initAddress();
      if(res){
        this.alertMessage.displayAlertMessage(ALERT_CODES["SAD001"]);
      }
    });
  }
  clearForm() {
    this.fbAddressDetails.reset();
  }



  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/experiencedetails', this.employeeId])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/uploadfiles'])
  }
}
