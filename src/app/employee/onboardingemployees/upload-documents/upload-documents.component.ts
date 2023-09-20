import { HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, map, of } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { UploadDocuments } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
// import { MessageService } from 'primeng/api/messageservice';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html'
})
export class UploadDocumentsComponent {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  files = [];
  employeeId: any;
  fileSize = 20;
  title: string;
  constructor(private router: Router, private route: ActivatedRoute, private formbuilder: FormBuilder,
    private employeeService: EmployeeService, private alertMessage: AlertmessageService,) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
  }
  onClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      if (this.files.length < 5) {
        for (let index = 0; index < fileUpload.files.length; index++) {
          const file = fileUpload.files[index];
          this.files.push({ data: file, title: this.title, EmployeeId: this.employeeId });
        }
       
      }
    else {
      this.alertMessage.displayErrorMessage(ALERT_CODES["EAD001"]);
      return
    }
    this.title = '';
  }
}
removeItem(index: number): void {
  this.files.splice(index, 1);
}
uploadFile(file) {
  console.log(file)
  const formData = new FormData();
  formData.set(file.title, file.data, file.data.name);
  console.log(formData)
  this.employeeService.CreateUploadDocuments(formData).subscribe(resp => {
    if (resp) {
      this.alertMessage.displayAlertMessage(ALERT_CODES["EAD002"]);
    }
    else {
      this.alertMessage.displayErrorMessage(ALERT_CODES["EAD003"]);
    }
  })
}
uploadFiles() {
  this.fileUpload.nativeElement.value = '';
  this.files.forEach(file => {
    this.uploadFile(file);
  });
}



navigateToPrev() {
  this.router.navigate(['employee/onboardingemployee/addressdetails'])
}

navigateToNext() {
  this.router.navigate(['employee/onboardingemployee/familydetails'])
}


}
