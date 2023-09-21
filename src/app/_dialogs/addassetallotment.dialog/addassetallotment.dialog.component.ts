import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { AssetAllotmentDto, AssetAllotmentViewDto, AssetsByAssetTypeIdViewDto } from 'src/app/_models/admin/assetsallotment';
import { AdminService } from 'src/app/_services/admin.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeesList, LookupDetailsDto } from 'src/app/_models/admin';
import { AssetAllotment } from 'src/app/_models/common';

@Component({
    selector: 'app-addassetallotment.dialog',
    templateUrl: './addassetallotment.dialog.component.html'
})
export class AddassetallotmentDialogComponent {
    assetTypes: LookupDetailsDto[] = [];
    assetCategories: LookupDetailsDto[] = [];
    assets: AssetsByAssetTypeIdViewDto[] = [];
    sortField: string = '';
    sortOrder: number = 0;
    fbAssetAllotment!: FormGroup;
    fbUnAssignAsset!: FormGroup;
    submitLabel!: string;
    assetAllotments: AssetAllotmentViewDto[] = [];
    maxDate: Date = new Date();
    employeesDropdown: EmployeesList[] = [];


    constructor(private formbuilder: FormBuilder,
        private adminService: AdminService,
        private lookupService: LookupService,
        private alertMessage: AlertmessageService,
        public ref: DynamicDialogRef,
        private config: DynamicDialogConfig) {
            console.log(this.config.data.employeeId);

         }

    ngOnInit() {
        debugger
        this.initEmployees();
        this.assetAllotmentForm();
        this.initAssetCategories();
        this.initAssetTypes();
    }

    initEmployees() {
        this.adminService.getEmployeesList().subscribe((resp) => {
            this.employeesDropdown = resp as unknown as EmployeesList[];
        });
    }

    initAssetCategories() {
        this.lookupService.AssetCategories().subscribe((resp) => {
            this.assetCategories = resp as unknown as LookupDetailsDto[];
        });
    }

    initAssetTypes() {
        this.lookupService.AssetTypes().subscribe((resp) => {
            this.assetTypes = resp as unknown as LookupDetailsDto[];
        });
    }

    getAssetsByAssetType(assetTypeId: number) {
        this.adminService.GetAssetsByAssetType(assetTypeId).subscribe((resp) => {
            this.assets = resp as unknown as AssetsByAssetTypeIdViewDto[];
        });
    }

    assetAllotmentForm() {
        this.fbAssetAllotment = this.formbuilder.group({
            employeeId: new FormControl(this.config.data.employeeId ? this.config.data.employeeId : null),
            assetCategoryId: new FormControl('', [Validators.required]),
            assetTypeId: new FormControl('', [Validators.required]),
            assetId: new FormControl('', [Validators.required]),
            assignedOn: new FormControl(new Date(), [Validators.required]),
        });
    }

    get FormControls() {
        return this.fbAssetAllotment.controls;
    }

    saveAssetAllotment(): Observable<HttpEvent<AssetAllotmentDto>> {
        return this.adminService.CreateAssetAllotment(this.fbAssetAllotment.value)
    }

    onSubmitAsset() {
        debugger
        this.saveAssetAllotment().subscribe((resp) => {
            if (resp) {
                this.alertMessage.displayAlertMessage(ALERT_CODES["SAAAA001"]);
                this.ref.close({
                    "UpdatedModal": AssetAllotment.Add
                });
            }
            else this.alertMessage.displayErrorMessage(ALERT_CODES["EAAAA001"]);
        });
    }

}
