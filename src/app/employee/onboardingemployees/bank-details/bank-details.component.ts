import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaxLength } from 'src/app/_models/common';
import {MIN_LENGTH_2, MIN_LENGTH_8,RG_ALPHA_ONLY, RG_IFSC, RG_NUMERIC_ONLY } from 'src/app/_shared/regex';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styles: [
  ]
})
export class BankDetailsComponent {
  fbbankDetails!: FormGroup;
  maxLength: MaxLength = new MaxLength();

  constructor(private router: Router, private formbuilder: FormBuilder) { }
  ngOnInit(): void {
    this.bankDetailsForm();
  }
  bankDetailsForm(){
    this.fbbankDetails = this.formbuilder.group({
      bankId: [0],
      employeeId:[0],
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      branchName: new FormControl('', [Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      ifsc: new FormControl('', [Validators.required,Validators.pattern(RG_IFSC)]),
      accountNumber: new FormControl('', [Validators.required,Validators.pattern(RG_NUMERIC_ONLY),Validators.minLength(MIN_LENGTH_8)]),
      isActive: new FormControl(true)
    });

  }
  get FormControls() {
    return this.fbbankDetails.controls;
  }
  
  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }
  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/familydetails'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/finalsubmit'])
  }
}
