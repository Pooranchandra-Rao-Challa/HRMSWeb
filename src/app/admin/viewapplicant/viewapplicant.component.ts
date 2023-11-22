import { Component } from '@angular/core';
import { RecruitmentService } from 'src/app/_services/recruitment.service';

@Component({
  selector: 'app-viewapplicant',
  templateUrl: './viewapplicant.component.html',
  styles: [
  ]
})
export class ViewapplicantComponent {
  applicantId :any;
  viewApplicantDetails: any;

  constructor(private RecruitmentService:RecruitmentService,){}

  ngOnInit(){
    // this.initviewapplicantdetails();
  }
  events =[{},{},{}]
  initviewapplicantdetails(){
       this.RecruitmentService.GetviewapplicantDtls(this.applicantId).subscribe((resp) => {
        this.viewApplicantDetails = resp as unknown as any[];
       })
  }

}
