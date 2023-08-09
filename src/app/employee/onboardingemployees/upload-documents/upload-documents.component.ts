import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
// import { MessageService } from 'primeng/api/messageservice';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  // styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent {
  constructor(private router: Router, ){} uploadedFiles: any[] = [];

  // constructor(private messageService: MessageService) {}

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
    this.router.navigate(['employee/onboardingemployee/experiencedetails'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/finalsubmit'])
  }
  // navigateToPrev() {
  //   this.router.navigate(['employee/onboardingemployee/experiencedetails'])
  // }

  // navigateToNext() {
  //   this.router.navigate(['employee/onboardingemployee/finalsubmit'])
  // }
}
