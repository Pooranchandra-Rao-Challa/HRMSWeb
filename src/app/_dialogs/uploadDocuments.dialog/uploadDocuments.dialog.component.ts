import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { ViewEmployeeScreen } from 'src/app/_models/common';
import { EmployeeService } from 'src/app/_services/employee.service';
import { MAX_LENGTH_20, MIN_LENGTH_2 } from 'src/app/_shared/regex';

@Component({
	selector: 'app-uploadDocuments.dialogs',
	templateUrl: './uploadDocuments.dialog.component.html'
})
export class uploadDocumentsDialogComponent {
    
	@ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
	uploadedFiles: any = [];
	fbUpload!: FormGroup;
	employeeId: number;
	fileSize = 20;
	title: string;
	
	constructor(
		private formbuilder: FormBuilder,
		public ref: DynamicDialogRef,
		private employeeService: EmployeeService,
		private activatedRoute: ActivatedRoute,
		private alertMessage: AlertmessageService,) {
	}
	
	ngOnInit() {
        this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
		this.initUpload();
	}
	
	initUpload() {
		this.fbUpload = this.formbuilder.group({
			employeeId: this.employeeId,
			uploadDocumentId: [null],
			title: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
			fileName: new FormControl(),
			uploadedFiles: new FormControl(),
			uploadDocuments: this.formbuilder.array([])
		})
    }
    
	faupload(): FormArray {
		return this.fbUpload.get('uploadDocuments') as FormArray
	}
	
	get FormControls() {
		return this.fbUpload.controls;
	}
	
    onClick() {
        const fileUpload = this.fileUpload.nativeElement;
        fileUpload.onchange = () => {
            if (this.uploadedFiles.length < 5) {
                if (this.fbUpload.valid) {
                    for (let index = 0; index < fileUpload.files.length; index++) {
                        const file = fileUpload.files[index];
                        this.faupload().push(this.generaterow(file));
                    }
                    this.uploadedFiles = []
                    for (let item of this.fbUpload.get('uploadDocuments').value) {
                        this.uploadedFiles.push(item)
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
				this.ref.close({
					"UpdatedModal": ViewEmployeeScreen.UploadDocuments,
				});
			}
		})
    }
    
	uploadFiles() {
		this.fileUpload.nativeElement.value = '';
		this.uploadedFiles.forEach(file => {
			this.uploadFile(file);
        });
        
	}





}
