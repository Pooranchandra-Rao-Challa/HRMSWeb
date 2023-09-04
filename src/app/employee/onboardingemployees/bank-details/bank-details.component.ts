import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/_services/security.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styles: [
  ]
})
export class BankDetailsComponent {
  fbBankDetails!: FormGroup;
  bankDetails:boolean=false;

  constructor(private router: Router, private formbuilder: FormBuilder) { }
  ngOnInit(): void {
    
    this.fbBankDetails=this.formbuilder.group({
      AccountNo:new FormControl('', [Validators.required]),
      IFSCCode:new FormControl('', [Validators.required]),
      BranchName:new FormControl('', [Validators.required])
    });
  }

  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/addressdetails'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/uploadfiles'])
  }
}
