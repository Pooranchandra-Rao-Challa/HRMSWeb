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
import { MAX_LENGTH_20, MIN_LENGTH_2 } from 'src/app/_shared/regex';
// import { MessageService } from 'primeng/api/messageservice';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html'
})
export class UploadDocumentsComponent {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  uploadedFiles:any = [];
  fbUpload!: FormGroup;
  employeeId: any;
  fileSize = 20;
  title: string;
  constructor(private router: Router, private route: ActivatedRoute, private formbuilder: FormBuilder,
    private employeeService: EmployeeService, private alertMessage: AlertmessageService,) {

  }
  initUpload() {
    this.fbUpload = this.formbuilder.group({
      employeeId: this.employeeId,
      uploadDocumentId: [null],
      title: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      fileName: new FormControl('', [Validators.required]),
      uploadedFiles: new FormControl('', [Validators.required]),
      uploadDocuments: this.formbuilder.array([])
    })
  }
  faupload(): FormArray {
    return this.fbUpload.get('uploadDocuments') as FormArray
  }
  get FormControls() {
    return this.fbUpload.controls;
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    this.initUpload();
  }
  onClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      if (this.uploadedFiles.length < 5) {
        for (let index = 0; index < fileUpload.files.length; index++) {
          const file = fileUpload.files[index];
          this.faupload().push(this.generaterow(file));
        }
        this.uploadedFiles=[]
        for (let item of this.fbUpload.get('uploadDocuments').value) {
          this.uploadedFiles.push(item)
       }
       this.clearForm();
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["EAD001"]);
        return
      }
    }
  }
  generaterow(file): FormGroup {
    const formGroup = this.formbuilder.group({
      employeeId: this.employeeId,
      uploadDocumentId: null,
      title: this.fbUpload.get('title').value,
      fileName: file.name,
      uploadedFiles: file,
    });
    return formGroup;
  }
  clearForm() {
    this.fbUpload.patchValue({
      employeeId: this.employeeId,
      uploadDocumentId: null,
      title: '',
      fileName: '',
      uploadedFiles: '',
    });
    this.fbUpload.markAsPristine();
    this.fbUpload.markAsUntouched();
  }
  removeItem(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  uploadFile(file) {
    this.employeeService.UploadDocuments(file).subscribe(resp => {
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
    this.uploadedFiles.forEach(file => {
      this.uploadFile(file);
    });
  }



  navigateToPrev() {
    this.router.navigate(['employee/onboardingemployee/addressdetails', this.employeeId])
  }

  navigateToNext() {
    this.router.navigate(['employee/onboardingemployee/familydetails', this.employeeId])
  }


}
