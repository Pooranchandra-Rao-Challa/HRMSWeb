import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { familyDetailViewDto } from 'src/app/demo/api/security';

interface General {
  name: string;
  code: string;
}

@Component({
  selector: 'app-family-deatils',
  templateUrl: './family-deatils.component.html',
  styleUrls: []
})
export class FamilyDeatilsComponent implements OnInit{
  relationshipStatus: General[] | undefined;
  fbfamilyDetails:FormGroup;
  ShowFamilyDetails: boolean;
  fafamilyDetails!: FormArray;
  showFamilyDetails: boolean = true;
  submitLabel: string;
  
  constructor(private router: Router, private route: ActivatedRoute,private formbuilder:FormBuilder){}

  ngOnInit() {
    this.relationshipStatus = [
      { name: 'Father', code: 'father' },
      { name: 'Mother', code: 'mother' },
      { name: 'Spouse', code: 'spouse' },
      { name: 'Daughter', code: 'daughter' },
      { name: 'Son', code: 'son' },
      { name: 'Sister', code: 'sister' }];
      this.initFamily();
      this.addFamilyMembers();
  }

  faFamilyDetail(): FormArray {
    return this.fbfamilyDetails.get("familyDetails") as FormArray
  }
  
  initFamily(){
    this.fbfamilyDetails=this.formbuilder.group({
      name: new FormControl('', [Validators.required]),
      relationShip:new FormControl('', [Validators.required]),
      mobileNo:new FormControl('', [Validators.required]),
      Address:new FormControl('', [Validators.required]),
      Nominee:new FormControl(true, [Validators.required]),
      familyDetails: this.formbuilder.array([])
    });
  }

  generaterow(familyDetails: familyDetailViewDto = new familyDetailViewDto()): FormGroup {
    return this.formbuilder.group({   
      id:new FormControl(familyDetails.id),
      name: new FormControl(familyDetails.name, [Validators.required]),
      relationShip: new FormControl(familyDetails.relationShip, [Validators.required]),
      mobileNo: new FormControl(familyDetails.mobileNo, [Validators.required]),
      Address: new FormControl(familyDetails.Address, [Validators.required]),
    });
  }
  
  clearForm() {
    this.fbfamilyDetails.reset(); 
  }

  addFamilyMembers() {
    this.ShowFamilyDetails = true;
    this.fafamilyDetails = this.fbfamilyDetails.get("familyDetails") as FormArray
    this.fafamilyDetails.push(this.generaterow())
    
  }
  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/basicdetails'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/educationdetails'])
  }
 
 
}
