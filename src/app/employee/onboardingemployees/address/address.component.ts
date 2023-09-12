import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/demo/api/security';
interface States {
  statename: string;
  code: string;
}
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styles: [
  ]
})
export class AddressComponent {
  State: States[] | undefined;
  ShowlookupDetails:boolean=false;
  fbAddressDetails: FormGroup;
  faAddressDetails!: FormArray;
  submitLabel: string;
  addressDetails: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private formbuilder: FormBuilder) { }

  ngOnInit() {

    this.State = [
      { statename: 'Andhra Pradesh', code: 'ap' },
      { statename: 'Telangana', code: 'ts' }
    ];
    this.initAddress();

    
  }

  faAddressDetail(): FormArray {
    return this.fbAddressDetails.get("addressDetails") as FormArray
  }

  initAddress() {
    this.fbAddressDetails = this.formbuilder.group({
      Id: [''],
      AddressLine1: new FormControl(''),
      AddressLine2: new FormControl(''),
      Landmark: new FormControl(''),
      ZIPCode: new FormControl(''),
      City: new FormControl(''),
      State: new FormControl(''),
      Country: new FormControl(''),
      addressType:[],
      IsActive: new FormControl(''),
      // addressDetails: this.formbuilder.array([])
    });
  }


  clearForm() {
    this.fbAddressDetails.reset();
  }

  addNewAddress() {
   
    if (this.fbAddressDetails.valid) {
      const addressData = this.fbAddressDetails.value;
      this.addressDetails.push(addressData);
      this.clearForm();
      this.ShowlookupDetails = true;
    }
  }

  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/experiencedetails'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/uploadfiles'])
  }
}
