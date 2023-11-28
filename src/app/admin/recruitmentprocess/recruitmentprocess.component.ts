import { Component } from '@angular/core';
import { RecruitmentService } from 'src/app/_services/recruitment.service';

@Component({
  selector: 'app-recruitmentprocess',
  templateUrl: './recruitmentprocess.component.html',
  styles: [
  ]
})
export class RecruitmentProcessComponent {
  processedJobOpening:any;
  applicantsList:any;
  checked: boolean = false;
  constructor(private RecruitmentService: RecruitmentService) { }

  ngOnInit() {
    this.initProcessedJobOpening();
    // this.initApplicants();
  }

  initProcessedJobOpening() {
     this.RecruitmentService.getJobOpening().subscribe(resp=>{
       this.processedJobOpening=resp;
     });
  }
  // initApplicants(){
  //    this.RecruitmentService.getApplicants().subscribe(resp=>{
  //      this.applicantsList=resp;
  //    })
  // }

}
