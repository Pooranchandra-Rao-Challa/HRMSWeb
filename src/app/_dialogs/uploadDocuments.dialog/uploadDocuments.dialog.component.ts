import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { ViewEmployeeScreen } from 'src/app/_models/common';
import { EmployeeService } from 'src/app/_services/employee.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_20, MIN_LENGTH_2 } from 'src/app/_shared/regex';

@Component({
    selector: 'app-uploadDocuments.dialogs',
    templateUrl: './uploadDocuments.dialog.component.html'
})
export class uploadDocumentsDialogComponent {

    @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
    files: { fileBlob: Blob, title: string, fileName: string }[] = [];
    fbUpload!: FormGroup;
    employeeId: string;
    empUploadDetails: any = [];
    title: string;
    permissions: any;

    constructor(
        private formbuilder: FormBuilder,
        public ref: DynamicDialogRef,
        private employeeService: EmployeeService,
        private activatedRoute: ActivatedRoute,
        private alertMessage: AlertmessageService,
        private jwtService: JwtService,     
    ) {}

    ngOnInit() {
        this.permissions = this.jwtService.Permissions
        this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
        this.initUpload();
    }

    initUpload() {
        this.fbUpload = this.formbuilder.group({
            title: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
        })
    }

    get FormControls() {
        return this.fbUpload.controls;
    }

    onClick() {
        const fileUpload = this.fileUpload.nativeElement;
        fileUpload.onchange = () => {
            if (this.files.length < 5) {
                if (this.fbUpload.valid) {
                    for (let index = 0; index < fileUpload.files.length; index++) {
                        const file = fileUpload.files[index];
                        console.log(file)
                        this.files.push({ fileBlob: file, title: this.fbUpload.get('title').value, fileName: file.name });
                        // this.empUploadDetails.push({ uploadedFiles: file, title: this.fbUpload.get('title').value,filename:  file.name })
                        console.log(this.files)
                    }  
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
        this.files.splice(index, 1);
    }

    checkTitle() {
        if (!this.fbUpload.valid)
            this.alertMessage.displayErrorMessage(ALERT_CODES["EAD004"]);
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
            this.ref.close({
                "UpdatedModal": ViewEmployeeScreen.UploadDocuments
            });
        })
    }

    uploadFiles() {
        this.fileUpload.nativeElement.value = '';
        this.files.forEach((file: { fileBlob: Blob, title: string, fileName: string }) => {
            console.log(file);

            if (file.fileBlob)
                this.uploadFile(file);
        });
    }

}
