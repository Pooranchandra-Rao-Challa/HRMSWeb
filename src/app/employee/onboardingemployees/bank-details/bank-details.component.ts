import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MaxLength } from 'src/app/_models/common';
import { BankDetailDto, EmployeeBasicDetailDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
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
  addFlag: boolean = true;
  employees:EmployeeBasicDetailDto[];
  employeeId:any;
  constructor(private router: Router,private route:ActivatedRoute, private formbuilder: FormBuilder,private employeeService:EmployeeService) { }
  ngOnInit(): void {
    this.bankDetailsForm();
    
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
console.log(this.employeeId)
  }
  bankDetailsForm(){
    this.fbbankDetails = this.formbuilder.group({
      bankId: [0],
      employeeId:this.employeeId,
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
  
  savebankDetails(): Observable<HttpEvent<BankDetailDto>> {
    return this.employeeService.CreateBankDetails(this.fbbankDetails.value)
  }
  onSubmit() {
    if (this.fbbankDetails.valid) {
      if (this.addFlag) {
        this.save();
        console.log(this.fbbankDetails.value);
      }
    } else {
      this.fbbankDetails.markAllAsTouched();
    }
  }
  save() {
    if (this.fbbankDetails.valid) {
      this.savebankDetails().subscribe(resp => {
        this.fbbankDetails.disable();
      })
    }
    else {
      this.fbbankDetails.markAllAsTouched();
    }
  }
  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }
  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/familydetails',this.employeeId])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/finalsubmit',this.employeeId])
  }
}
