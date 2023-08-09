import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


interface General {
  name: string;
  code: string;
}

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  // styleUrls: ['./basic-details.component.scss']
})
export class BasicDetailsComponent implements OnInit{

  genders: General[] | undefined;
  BloodGroup: General[] | undefined;
  MaritalStatus: General[] | undefined;
  skills: General[] | undefined;
  fbbasicDetails:FormGroup;
  constructor(private router: Router, private route: ActivatedRoute,private formbuilder:FormBuilder){}
  
  ngOnInit() {
    this.fbbasicDetails=this.formbuilder.group({
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl(''),
      lastName: new FormControl('', [Validators.required]),
      gender:new FormControl('', [Validators.required]),
      bloodGroup:new FormControl('', [Validators.required]),
      maritalStatus:new FormControl('', [Validators.required]),
      mobileNo:new FormControl('', [Validators.required]),
      AlternativePhNo:new FormControl(''),
      email:new FormControl('', [Validators.required]),
      currentAddress:new FormControl('', [Validators.required]),
      permanentAddress:new FormControl('', [Validators.required]),
      skills: new FormControl<General[] | null>(null)
    });


    this.genders = [
        { name: 'Male', code: 'M' },
        { name: 'Female', code: 'F' },
        { name: 'Others', code: 'O' }];
    this.BloodGroup = [
          { name: 'A+',code:'A+'},
          { name: 'A-',code:'A-'},
          { name: 'B+',code:'B+'},
          { name: 'B-',code:'B-'},
          { name: 'O+',code:'O+'},
          { name: 'O-',code:'o-'},
          { name: 'AB+',code:'AB+'},
          { name: 'AB-',code:'AB-'}];
    this. MaritalStatus= [
          { name: 'Single', code: 'single' },
          { name: 'Married', code: 'married' },
          { name: 'Widow', code: 'widow' },
          { name: 'Divorced', code: 'divorced' },
        ];
        this.skills= [
          { name: 'C', code: 'C' },
          { name: 'C++', code: 'C++' },
          { name: 'C#', code: 'C#' },
          { name: 'Java', code: 'Java' },
        ];
   }
  

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/familydetails'] );
  }
}
