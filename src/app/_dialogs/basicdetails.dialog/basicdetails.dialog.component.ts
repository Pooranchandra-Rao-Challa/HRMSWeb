import { PlatformLocation } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { LookupViewDto } from 'src/app/_models/admin';
import { MaxLength, PhotoFileProperties, ViewEmployeeScreen } from 'src/app/_models/common';
import { EmployeeBasicDetailDto, EmployeeBasicDetailViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MIN_LENGTH_2, RG_ALPHA_ONLY, RG_EMAIL, RG_PHONE_NO } from 'src/app/_shared/regex';
import { ValidateFileThenUpload } from 'src/app/_validators/upload.validators'
interface Gender {
    name: string;
    code: string;
}

export class Status {
    name: string;
    code: string;
}

@Component({
    selector: 'app-basicdetails.dialog',
    templateUrl: './basicdetails.dialog.component.html',
    styles: [
    ]
})
export class BasicdetailsDialogComponent {
    @ViewChild("fileUpload", { static: true }) fileUpload: ElementRef;
    fbEmpBasDtls!: FormGroup;
    imageSize: string;
    selectedFileBase64: string | null = null; // To store the selected file as base64
    genders: Gender[];
    status: Status[];
    maxLength: MaxLength = new MaxLength();
    bloodgroups: LookupViewDto[] = [];
    nationality: LookupViewDto[] = [];
    employeeId: string;
    maxDate: Date = new Date();
    fileTypes: string = ".jpg, .jpeg, .gif"
    @Output() ImageValidator = new EventEmitter<PhotoFileProperties>();
    defaultPhoto: string;

    constructor(
        private formbuilder: FormBuilder,
        private employeeService: EmployeeService,
        private alertMessage: AlertmessageService,
        private lookupService: LookupService,
        public ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private activatedRoute: ActivatedRoute,) {
        this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
    }

    ngOnInit(): void {
        this.empBasicDtlsForm();
        this.staticData();
        this.initBloodGroups();
        this.getNationality();
        if (this.config.data) this.showEmpPersDtlsDialog(this.config.data);
        this.ImageValidator.subscribe((p: PhotoFileProperties) => {
            if (this.fileTypes.indexOf(p.FileExtension) > 0 && p.Resize || (p.Size / 1024 / 1024 < 1
                && (p.isPdf || (!p.isPdf && p.Width <= 300 && p.Height <= 300)))) {
                this.fbEmpBasDtls.get('photo').setValue(p.File);
            } else {
                this.alertMessage.displayErrorMessage(p.Message);
            }

        })
        this.fileUpload.nativeElement.onchange = (source) => {
            for (let index = 0; index < this.fileUpload.nativeElement.files.length; index++) {
                const file = this.fileUpload.nativeElement.files[index];
                ValidateFileThenUpload(file, this.ImageValidator, 1, '300 x 300 pixels', true);
            }
        }
        this.defaultPhoto = /^female$/gi.test(this.fbEmpBasDtls.get('gender').value) ? './assets/layout/images/women-emp-2.jpg' : './assets/layout/images/men-emp.jpg'
    }
    staticData() {
        this.genders = [
            { name: 'Female', code: 'FM' },
            { name: 'Male', code: 'M' },
        ];
        this.status = [
            { name: 'Married', code: 'DS' },
            { name: 'Single', code: 'SN' },
            { name: 'Widow', code: 'WD' },
            { name: 'Divorced', code: 'DV' },
        ];
    }

    initBloodGroups() {
        this.lookupService.BloodGroups().subscribe((resp) => {
            this.bloodgroups = resp as unknown as LookupViewDto[];
        });
    }
    getNationality() {
        this.lookupService.Nationality().subscribe((resp) => {
            this.nationality = resp as unknown as LookupViewDto[];
        })
    }
    empBasicDtlsForm() {
        this.fbEmpBasDtls = this.formbuilder.group({
            employeeId: (this.employeeId),
            firstName: new FormControl(null, [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
            middleName: new FormControl(null, [Validators.minLength(MIN_LENGTH_2)]),
            lastName: new FormControl(null, [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
            code: [null],
            gender: new FormControl(null, [Validators.required]),
            bloodGroupId: new FormControl(null, [Validators.required]),
            maritalStatus: new FormControl(null, [Validators.required]),
            mobileNumber: new FormControl(null, [Validators.required, Validators.pattern(RG_PHONE_NO)]),
            alternateMobileNumber: new FormControl(null, [Validators.pattern(RG_PHONE_NO)]),
            originalDob: new FormControl(null, [Validators.required]),
            certificateDob: new FormControl(null, [Validators.required]),
            emailId: new FormControl(null, [Validators.required, Validators.pattern(RG_EMAIL)]),
            nationality:new FormControl(null,[Validators.required]),
            isActive: (''),
            isAFresher: (''),
            signDate: (''),
            photo: []
        });
    }

    get empBasDtlsFormControls() {
        return this.fbEmpBasDtls.controls;
    }

    restrictSpaces(event: KeyboardEvent) {
        const target = event.target as HTMLInputElement;
        // Prevent the first key from being a space
        if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0)
            event.preventDefault();

        // Restrict multiple spaces
        if (event.key === ' ' && target.selectionStart > 0 && target.value.charAt(target.selectionStart - 1) === ' ') {
            event.preventDefault();
        }
    }
    onGenderChange() {
        const selectedGender = this.fbEmpBasDtls.get('gender').value;
        if (selectedGender) {
            this.defaultPhoto = /^female$/gi.test(this.fbEmpBasDtls.get('gender').value) ? './assets/layout/images/women-emp-2.jpg' : './assets/layout/images/men-emp.jpg'
        }
    }

    onFileSelect(event: any): void {
        const selectedFile = event.files[0];
        this.imageSize = selectedFile.size;
        if (selectedFile) {
            this.convertFileToBase64(selectedFile, (base64String) => {
                this.selectedFileBase64 = base64String;
                this.fbEmpBasDtls.get('photo').setValue(this.selectedFileBase64);
            });
        } else {
            this.selectedFileBase64 = null;
        }
    }

    private convertFileToBase64(file: File, callback: (base64String: string) => void): void {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = reader.result as string;
            callback(base64String);
        };
    }

    showEmpPersDtlsDialog(employeePrsDtls: EmployeeBasicDetailViewDto) {
        var employeePrsDtl = employeePrsDtls as unknown as EmployeeBasicDetailDto;
        employeePrsDtl.originalDob = new Date(employeePrsDtls.originalDOB);
        employeePrsDtl.certificateDob = new Date(employeePrsDtls.certificateDOB);
        employeePrsDtl.isActive = true;
        this.fbEmpBasDtls.patchValue({
            employeeId: employeePrsDtls.employeeId,
            firstName: employeePrsDtls.firstName,
            middleName: employeePrsDtls.middleName,
            lastName: employeePrsDtls.lastName,
            code: employeePrsDtl.code,
            gender: employeePrsDtls.gender,
            bloodGroupId: employeePrsDtls.bloodGroupId,
            maritalStatus: employeePrsDtls.maritalStatus,
            mobileNumber: employeePrsDtls.mobileNumber,
            alternateMobileNumber: employeePrsDtls.alternateMobileNumber,
            originalDob: FORMAT_DATE(new Date(employeePrsDtls.originalDOB)),
            certificateDob: FORMAT_DATE(new Date(employeePrsDtls.certificateDOB)),
            emailId: employeePrsDtls.emailId,
            isActive: employeePrsDtls.isActive,
            isAFresher: employeePrsDtl.isAFresher,
            nationality:employeePrsDtls.nationality,
            signDate: employeePrsDtls.signDate,
            photo:employeePrsDtls.photo,
        });
        this.defaultPhoto = /^female$/gi.test(employeePrsDtls.gender) ? './assets/layout/images/women-emp-2.jpg' : './assets/layout/images/men-emp.jpg'

    }

    saveEmpBscDtls() {
        this.fbEmpBasDtls.value.originalDob = FORMAT_DATE(this.fbEmpBasDtls.value.originalDob);
        this.fbEmpBasDtls.value.certificateDob = FORMAT_DATE(this.fbEmpBasDtls.value.certificateDob);
        this.employeeService.updateViewEmpPersDtls(this.fbEmpBasDtls.value).subscribe((resp) => {
            if (resp) {
                this.alertMessage.displayAlertMessage(ALERT_CODES["EVEBD001"]);
                this.ref.close({
                    "UpdatedModal": ViewEmployeeScreen.BasicDetails
                });
            }
            else {
                this.alertMessage.displayErrorMessage(ALERT_CODES["EVEBD002"]);
            }
        })
    }

}
