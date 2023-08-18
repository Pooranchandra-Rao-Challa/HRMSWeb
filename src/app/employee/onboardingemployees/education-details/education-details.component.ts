import { Component, OnInit } from '@angular/core';
import { FormGroup ,FormBuilder, FormControl, Validators, FormArray} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-education-details',
  templateUrl: './education-details.component.html',
  // styleUrls: ['./education-details.component.scss']
})
export class EducationDetailsComponent implements OnInit{
  showDialog: boolean = false;
  fbEducationDetails!:FormGroup;
  selectedYear:Date;
  ShowlookupDetails:boolean=false;
  educationDetails: any[] = [];

  constructor(private formbuilder: FormBuilder,private router: Router, private route: ActivatedRoute){}

  States= [
    { name: 'Andhra Pradesh', code: 'AP' },
    { name: 'Telangana', code: 'TS' }
  ];
Courses=[
  { name: 'SSC', code: 'SSC' },
  { name: 'Inter', code: 'Inter' },
  { name:'Under Graduation', code: 'UG' },
  { name:'Post Graduation', code: 'PG' },
]
  ngOnInit(){
    this.fbEducationDetails = this.formbuilder.group({
      course: new FormControl(''),
      state: new FormControl(''),
      school: new FormControl(''),
      board: new FormControl(''),
      stream: new FormControl(''),
      yearofpass: new FormControl(''),
      gradingsystem: new FormControl(''),
      cgpa: new FormControl(''),
    });

  }

  saveEducationDetails(){
if (this.fbEducationDetails.valid) {
      const educationData = this.fbEducationDetails.value;
      this.educationDetails.push(educationData);
      this.clearForm();
      this.ShowlookupDetails = true;
    }
  }
  // removeEducationEntry(index: number) {
  //   this.educationDetails.splice(index, 1);
  // }
    clearForm() {
    this.fbEducationDetails.reset();
  }
  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/basicdetails'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/experiencedetails'])
  }

}
