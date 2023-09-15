import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee, LookupDetailViewDto } from 'src/app/demo/api/security';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { AssetAllotmentDto, AssetAllotmentViewDto, AssetsByAssetTypeIdViewDto } from 'src/app/_models/admin/assetsallotment';
import { AdminService } from 'src/app/_services/admin.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { SecurityService } from 'src/app/demo/service/security.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeesList } from 'src/app/_models/admin';

@Component({
    selector: 'app-addassetallotment.dialog',
    templateUrl: './addassetallotment.dialog.component.html'
})
export class AddassetallotmentDialogComponent {
    assetTypes: LookupDetailViewDto[] = [];
    assetCategories: LookupDetailViewDto[] = [];
    assets: AssetsByAssetTypeIdViewDto[] = [];
    sortField: string = '';
    sortOrder: number = 0;
    fbAssetAllotment!: FormGroup;
    fbUnAssignAsset!: FormGroup;
    submitLabel!: string;
    employees: Employee[] = [];
    assetAllotments: AssetAllotmentViewDto[] = [];
    maxDate: Date = new Date();
    employeesDropdown: EmployeesList[] = [];


    constructor(private securityService: SecurityService,
        private formbuilder: FormBuilder,
        private adminService: AdminService,
        private lookupService: LookupService,
        private alertMessage: AlertmessageService,
        public ref: DynamicDialogRef,
        private config: DynamicDialogConfig) { }

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
            this.assetCategories = resp as unknown as LookupDetailViewDto[];
        });
    }

    initAssetTypes() {
        this.lookupService.AssetTypes().subscribe((resp) => {
            this.assetTypes = resp as unknown as LookupDetailViewDto[];
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
                this.ref.close(resp);
            }
            else this.alertMessage.displayErrorMessage(ALERT_CODES["EAAAA001"]);
        });
    }

}
