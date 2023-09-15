import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { EmployeeService } from 'src/app/_services/employee.service';
// import { MessageService } from 'primeng/api/messageservice';

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
  employeeId: any;
  constructor(private router: Router, private route: ActivatedRoute, private formbuilder: FormBuilder, private employeeService: EmployeeService,) {

  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    console.log(this.employeeId)
    this.fbUploadDocument = this.formbuilder.group({
      uploadDocumentId: [0],
      employeeId: [this.employeeId],
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
    this.uploadDocuments = [];
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
    this.router.navigate(['employee/onboardingemployee/addressdetails',this.employeeId])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/familydetails',this.employeeId])
  }


}
