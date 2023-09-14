import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { EmployeeService } from 'src/app/_services/employee.service';


@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  // styles:[
  //   custom-file-input {
  //     background-color: #e0e0e0; /* Set your desired background color here */
  //     padding: 10px 15px;
  //     border: 1px solid #ccc;
  //     border-radius: 5px;
  //     cursor: pointer;
  //     display: inline-block;
  //   }
    
  //   /* You can also add hover and active styles for better user experience */
  //   .custom-file-input:hover {
  //     background-color: #d0d0d0; /* Change background color on hover */
  //   }
    
  //   .custom-file-input:active {
  //     background-color: #c0c0c0; /* Change background color when clicked */
  //   }
  // ]
})
export class UploadDocumentsComponent {
  myFiles = [];
  uploadDocuments=[];
  fbUploadDocument!: FormGroup;
  constructor(private router: Router, private formbuilder: FormBuilder, private employeeService: EmployeeService,) {

  }
  ngOnInit() {
    this.fbUploadDocument = this.formbuilder.group({
      uploadDocumentId: new FormControl(0),
      employeeId: new FormControl(0),
      title: new FormControl(''),
      fileName: new FormControl(''),
    })
  }

  getFileDetails(e) {
   console.log(e.target)
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  uploadFiles() {
    this.uploadDocuments=[];
    for (let i = 0; i < this.myFiles.length; i++) {
      let fileDetails = this.myFiles[i];
      this.fbUploadDocument.patchValue({
        title: fileDetails.name,
        fileName: fileDetails.type
      })
      this.uploadDocuments.push(this.fbUploadDocument.value)
    }
    this.employeeService.CreateUploadDocuments(this.uploadDocuments).subscribe((resp) => {
      console.log(resp);
    })

  }



  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/addressdetails'])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/familydetails'])
  }


}
