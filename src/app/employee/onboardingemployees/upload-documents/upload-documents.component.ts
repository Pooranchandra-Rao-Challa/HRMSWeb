import { HttpErrorResponse, HttpEvent, HttpEventType, HttpParams, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_20, MIN_LENGTH_2 } from 'src/app/_shared/regex';
// import { MessageService } from 'primeng/api/messageservice';

@Component({
    selector: 'app-upload-documents',
    templateUrl: './upload-documents.component.html'
})
export class UploadDocumentsComponent {
    @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;

    files: { fileBlob: Blob, title: string,fileName:string }[] = [];
    fbUpload!: FormGroup;
    employeeId: any;
    fileSize = 20;
    empUploadDetails: any = [];
    title: string;
    permissions: any;
    constructor(private router: Router, private route: ActivatedRoute, private formbuilder: FormBuilder,
        private employeeService: EmployeeService, private alertMessage: AlertmessageService, private jwtService: JwtService) {

    }
    initUpload() {
        this.fbUpload = this.formbuilder.group({
            title: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
        })
    }

    get FormControls() {
        return this.fbUpload.controls;
    }
    ngOnInit() {
        this.permissions = this.jwtService.Permissions
        this.route.params.subscribe(params => {
            this.employeeId = params['employeeId'];
        });
        this.initUpload();
        this.getUploadDocuments();
    }
    onClick() {
        const fileUpload = this.fileUpload.nativeElement;
        fileUpload.onchange = () => {
            if (this.files.length < 5) {
                if (this.fbUpload.valid) {
                    for (let index = 0; index < fileUpload.files.length; index++) {
                        const file = fileUpload.files[index];
                        console.log(file)
                        this.files.push({ fileBlob: file, title: this.fbUpload.get('title').value , fileName:  file.name});
                        this.empUploadDetails.push({ uploadedFiles: file, title: this.fbUpload.get('title').value,filename:  file.name })
                        console.log(this.empUploadDetails)
                    }
                    this.clearForm();
                }
                else {
                    this.fbUpload.markAllAsTouched();
                }
            }
            else {
                this.alertMessage.displayErrorMessage(ALERT_CODES["EAD001"]);
                return
            }
        }
    }

    clearForm() {
        this.fbUpload.patchValue({
            title: '',
        });
        this.fbUpload.markAsPristine();
        this.fbUpload.markAsUntouched();
    }

    removeItem(index: number): void {
        this.empUploadDetails.splice(index, 1);
    }

    uploadFile(file) {
        let params = new HttpParams();
        params = params.set("employeeId", this.employeeId).set('title', file.title).set('module', 'project').set('fileName', file.fileName);
        let formData = new FormData();
        formData.set('uploadedFiles', file.fileBlob, file.fileName)
        console.log(formData);

        this.employeeService.UploadDocuments(formData, params).subscribe(resp => {
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
        this.files.forEach((file: {fileBlob: Blob,title:string,fileName:string}) => {
            this.uploadFile(file);
        });
    }
    editForm(file) {

    }
    getUploadDocuments() {
        this.employeeService.GetUploadedDocuments(this.employeeId).subscribe((data) => {
            this.files = data as unknown as  {fileBlob: Blob, title: string , fileName:  string}[];
        })
    }

    navigateToPrev() {
        this.router.navigate(['employee/onboardingemployee/addressdetails', this.employeeId])
    }

    navigateToNext() {
        this.router.navigate(['employee/onboardingemployee/familydetails', this.employeeId])
    }


}
