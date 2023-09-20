import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Address } from 'src/app/demo/api/security';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { AddressDetailsDto, Countries, EmployeAdressViewDto, States } from 'src/app/_models/employes';
// import { States } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { MAX_LENGTH_256, MAX_LENGTH_50, MAX_LENGTH_6, MIN_LENGTH_2, MIN_LENGTH_6, RG_ALPHA_NUMERIC, RG_PINCODE } from 'src/app/_shared/regex';
import { ITableHeader, MaxLength } from 'src/app/_models/common';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styles: [
  ]
})
export class AddressComponent {
  states: States[] = [];
  countries: Countries[] = [];
  fbAddressDetails: FormGroup;
  faAddressDetails!: FormArray;
  submitLabel: string;
  employeeId: any;
  maxLength: MaxLength = new MaxLength();
  empAddrDetails: EmployeAdressViewDto[]=[];
  
  constructor(private router: Router, private route: ActivatedRoute, private formbuilder: FormBuilder,
    private alertMessage: AlertmessageService, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    this.initAddress();
    this.initStates();
    this.initCountries();
    this.getEmpAddressDetails();
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
      employeeId: [this.employeeId],
      addressId: [null],
      addressLine1: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      addressLine2: new FormControl('', [Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      landmark: new FormControl('', [ Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      zipCode: new FormControl('',[Validators.required]),
      city: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      stateId: new FormControl('',[Validators.required]),
      countryId: new FormControl('',[Validators.required]),
      addressType: new FormControl('',[Validators.required]),
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
    { field: 'countryId', header: 'countryId', label: 'Country' },
    { field: 'addressType', header: 'addressType', label: 'AddressType' },
    { field: 'isActive', header: 'isActive', label: 'IsActive' }
  ];
  addAddress() {
    if (this.fbAddressDetails.invalid) {
      return;
    }
    let count = 0,count1=0;
    let addressArray = this.fbAddressDetails.get('addressDetails').value;
    let length = addressArray.length;
    if (length > 0) {
      addressArray.forEach((control) => {        
        if (control.addressType == "PermanentAddress"&& this.fbAddressDetails.get('addressType').value=="PermanentAddress") {
          count++;
        }
        if (control.addressType == "CurrentAddress" && this.fbAddressDetails.get('addressType').value=="CurrentAddress") {
          count1++;
        }
      });
      if (count >= 1 || count1 >= 1) {
        this.alertMessage.displayErrorMessage(count>=1?ALERT_CODES["SAP001"]:ALERT_CODES['SAC001']);
        this.fbAddressDetails.get('addressType')?.setValue('');
        this.fbAddressDetails.markAllAsTouched();
      }
      else{
        this.save();
      }
    }
    else{
      this.save();
    }
    
  }

  save() {

    // Push current values into the FormArray
    this.faAddressDetail().push(this.generaterow(this.fbAddressDetails.getRawValue()));
    // Reset form controls for the next entry
    for (let item of this.fbAddressDetails.get('addressDetails').value) {
       this.empAddrDetails.push(item)
    }
    console.log(this.empAddrDetails)
    this.fbAddressDetails.patchValue({
      employeeId: this.employeeId,
      addressId: null,
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      zipCode: '',
      city: '',
      stateId: '',
      countryId: '',
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
      countryId: new FormControl({ value: addressDetails.countryId, disabled: true }),
      addressType: new FormControl({ value: addressDetails.addressType, disabled: true }),
      isActive: new FormControl({ value: addressDetails.isActive, disabled: true }),
    });
    return formGroup;
  }
  saveAddress(): Observable<HttpEvent<any>> {
    return this.employeeService.CreateAddress(this.fbAddressDetails.get('addressDetails').value);
  }
  getEmpAddressDetails(){
    this.employeeService.GetAddress(this.employeeId).subscribe((data) => {
      this.empAddrDetails = data as unknown as EmployeAdressViewDto[];
    })
  }
  onSubmit() {
    this.saveAddress().subscribe(res => {
      if(res){
        this.alertMessage.displayAlertMessage(ALERT_CODES["SAD001"]);
        this.navigateToNext();
      }
      else{
        this.alertMessage.displayErrorMessage(ALERT_CODES["SAD001"]);
      }
    });
  }
  clearForm() {
    this.fbAddressDetails.reset();
  }



  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/experiencedetails',22])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/uploadfiles',this.employeeId])
  }
}
