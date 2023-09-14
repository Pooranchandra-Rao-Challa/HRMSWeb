import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/demo/api/security';
// import { States } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { MAX_LENGTH_256, MIN_LENGTH_2, RG_ALPHA_NUMERIC } from 'src/app/_shared/regex';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styles: [
  ]
})
export class AddressComponent {
  // states: States[] =[];
  ShowlookupDetails: boolean = false;
  fbAddressDetails: FormGroup;
  faAddressDetails!: FormArray;
  submitLabel: string;
  addressDetails: any[] = [];
  employeeId: any;
  constructor(private router: Router, private route: ActivatedRoute, private formbuilder: FormBuilder, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    console.log(this.employeeId)
    // this.initStates();
    this.initAddress();
  }

  // initStates(){
  //   this.employeeService.GetStates().subscribe((resp)=>{
  //     this.states=resp as unknown as States[];
  //   })
  // }

  faAddressDetail(): FormArray {
    return this.fbAddressDetails.get("addressDetails") as FormArray
  }

  initAddress() {
    this.fbAddressDetails = this.formbuilder.group({
      Id: [''],
      AddressLine1: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      AddressLine2: new FormControl(''),
      Landmark: new FormControl(''),
      ZIPCode: new FormControl(''),
      City: new FormControl(''),
      State: new FormControl(''),
      Country: new FormControl(''),
      addressType: [],
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
    this.router.navigate(['employee/onboardingemployee/experiencedetails', this.employeeId])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/uploadfiles', this.employeeId])
  }
}
