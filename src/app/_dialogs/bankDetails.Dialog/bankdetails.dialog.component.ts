import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { AdminService } from 'src/app/_services/admin.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BankDetailViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { MIN_LENGTH_2, MIN_LENGTH_8, RG_ALPHA_ONLY, RG_IFSC, RG_NUMERIC_ONLY } from 'src/app/_shared/regex';
import { ActivatedRoute } from '@angular/router';
import { Actions, BankDetails, DialogRequest, MaxLength } from 'src/app/_models/common';

@Component({
    selector: 'app-bankdetails.dialog',
    templateUrl: './bankdetails.dialog.component.html'
})
export class BankdetailsDialogComponent {
    
    fbBankDetails!: FormGroup;
    bankDetails1: BankDetailViewDto[];
    submitLabel: string;
    label: string
    employeeId: any
    ActionTypes = Actions;
    bankData: any
    maxLength: MaxLength = new MaxLength();
    dialogRequest: DialogRequest = new DialogRequest();
    BankdetailsDialogComponent = BankdetailsDialogComponent;

    constructor(private formbuilder: FormBuilder,
        private alertMessage: AlertmessageService,
        public ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private employeeService: EmployeeService,
        private activatedRoute: ActivatedRoute,

    ) {
        console.log('this.config.data', this.config.data);
    }

    ngOnInit() {
        this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
        this.initBankDetails();
        this.bankDetailsForm();
        if (this.config.data) this.editBankDetails(this.config.data);
    }

    initBankDetails() {
        this.employeeService.GetBankDetails(this.employeeId).subscribe((resp) => {
            this.bankDetails1 = resp as unknown as BankDetailViewDto[];
            console.log('this.BankDetails', this.bankDetails1);
        });
    }
    
    bankDetailsForm() {
        this.fbBankDetails = this.formbuilder.group({
            bankId: [0],
            employeeId: this.employeeId,
            name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
            branchName: new FormControl('', [Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
            ifsc: new FormControl('', [Validators.required, Validators.pattern(RG_IFSC)]),
            accountNumber: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY), Validators.minLength(MIN_LENGTH_8)]),
            isActive: new FormControl(true)
        });
    }
    
    get FormControls() {
        return this.fbBankDetails.controls;
    }

    editBankDetails(bank) {
        this.fbBankDetails.patchValue({
            bankId: bank.bankDetailId,
            employeeId: bank.employeeId,
            name: bank.bankName,
            branchName: bank.branchName,
            ifsc: bank.ifsc,
            accountNumber: bank.accountNumber,
            isActive: bank.isActive

        });
    }
    
    saveBankDetails() {
        this.employeeId = +this.activatedRoute.snapshot.queryParams['employeeId'];
        const { ...formValue } = this.fbBankDetails.value;
        const isUpdate = this.fbBankDetails.value.bankId !== null;
        formValue.employeeId = this.employeeId;

        this.employeeService.CreateBankDetails(formValue).subscribe((resp) => {
            if (resp) {
                const alertCode = isUpdate ? "SMBD002" : "SMBD001";
                this.alertMessage.displayAlertMessage(ALERT_CODES[alertCode]);

                this.ref.close({

                    "UpdatedModal": BankDetails.Add

                });

            }
        });
    }

    restrictSpaces(event: KeyboardEvent) {
        if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
            event.preventDefault();
        }
    }
}