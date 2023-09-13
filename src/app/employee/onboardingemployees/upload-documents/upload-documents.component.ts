import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
// import { MessageService } from 'primeng/api/messageservice';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  // styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent {
  employeeId:any;
  uploadedFiles: any[] = [];
  constructor(private router: Router,private route:ActivatedRoute){}
  // constructor(private messageService: MessageService) {}
ngOnInt(){
  
  this.route.params.subscribe(params => {
    this.employeeId = params['employeeId'];
  });
console.log(this.employeeId)
}
  onUpload(event: any) {
      for (const file of event.files) {
          this.uploadedFiles.push(file);
      }

      // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  }

  onBasicUpload() {
      // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }
  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/addressdetails',this.employeeId])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/familydetails',this.employeeId])
  }
  // navigateToPrev() {
  //   this.router.navigate(['employee/onboardingemployee/experiencedetails'])
  // }

  // navigateToNext() {
  //   this.router.navigate(['employee/onboardingemployee/finalsubmit'])
  // }
}
