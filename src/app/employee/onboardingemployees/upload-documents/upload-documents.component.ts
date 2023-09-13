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

})
export class UploadDocumentsComponent {

  fbUploadDocument!: FormGroup;
  employeeId:any;
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

  myFiles = [];
  uploadDocuments=[];
  sMsg: string = '';


  getFileDetails(e) {

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
    this.router.navigate(['employee/onboardingemployee/addressdetails',this.employeeId])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/familydetails',this.employeeId])
  }


}
