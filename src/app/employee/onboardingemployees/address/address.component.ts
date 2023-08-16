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
  fbAddressDetails: FormGroup;
  faAddressDetails!: FormArray;
  showAddressDetails: boolean = true;
  submitLabel: string;

  constructor(private router: Router, private route: ActivatedRoute, private formbuilder: FormBuilder) { }

  ngOnInit() {

    this.State = [
      { statename: 'Andhra Pradesh', code: 'ap' },
      { statename: 'Telangana', code: 'ts' }
    ];
    this.initFamily();

    this.addNewAddress();
  }

  faAddressDetail(): FormArray {
    return this.fbAddressDetails.get("addressDetails") as FormArray
  }

  initFamily() {
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

  generaterow(addressDetails: Address = new Address()): FormGroup {
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

  clearForm() {
    this.fbAddressDetails.reset();
  }

  addNewAddress() {
    this.showAddressDetails = true;
    this.faAddressDetails = this.fbAddressDetails.get("addressDetails") as FormArray
    this.faAddressDetails.push(this.generaterow())

  }
  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/familydetails'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/uploadfiles'])
  }
}
