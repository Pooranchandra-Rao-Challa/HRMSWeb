import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  // styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent {
  constructor(private router: Router){}

  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/experiencedetails'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/finalsubmit'])
  }
}
