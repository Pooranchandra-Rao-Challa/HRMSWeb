import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { SecurityService } from 'src/app/demo/service/security.service';
import { Assets, Employee, LookupDetailViewDto } from 'src/app/demo/api/security';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThisReceiver } from '@angular/compiler';
import { LookupService } from 'src/app/_services/lookup.service';
import { AdminService } from 'src/app/_services/admin.service';
import { AssetAllotmentDto, AssetAllotmentViewDto, AssetsByAssetTypeIdViewDto } from 'src/app/_models/admin/assetsallotment';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { Table } from 'primeng/table';
import { ITableHeader } from 'src/app/_models/common';
import { EmployeesList } from 'src/app/_models/admin';

@Component({
    selector: 'app-assetsallotment',
    templateUrl: './assetsallotment.component.html',
    styles: [
    ]
})
export class AssetsallotmentComponent {
    assetTypes: LookupDetailViewDto[] = [];
    assetCategories: LookupDetailViewDto[] = [];
    assets: AssetsByAssetTypeIdViewDto[] = [];
    sortField: string = '';
    sortOrder: number = 0;
    fbAssetAllotment!: FormGroup;
    fbUnAssignAsset!: FormGroup;
    submitLabel!: string;
    showAssetDetails: boolean = false;
    showAssetAllotment: boolean = false;
    showUnassignAsset: boolean = false;
    employees: Employee[] = [];
    employeesDropdown: EmployeesList[] = [];
    addFlag: boolean;
    assetAllotments: AssetAllotmentViewDto[] = [];
    maxDate: Date = new Date();

    // START - Displaying the table view in the listItem

    // globalFilterFields: string[] = ['empname', 'empcode', 'designation', 'email', 'phoneNo'];
    // headers: ITableHeader[] = [
    //     { field: 'empname', header: 'empname', label: 'Employee Name' },
    //     { field: 'empcode', header: 'empcode', label: 'Employee Code' },
    //     { field: 'designation', header: 'designation', label: 'Designation' },
    //     { field: 'email', header: 'email', label: 'Email' },
    //     { field: 'phoneNo', header: 'phoneNo', label: 'Phone No' },
    // ];
    // @ViewChild('filter') filter!: ElementRef;
    // totalRecords = this.employees.length; // Total number of records

    // onGlobalFilter(table: Table, event: Event) {
    //     table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    // }


    // clear(table: Table) {
    //     table.clear();
    //     this.filter.nativeElement.value = '';
    // }

    // END - Displaying the table view in the listItem

    constructor(private securityService: SecurityService,
        private formbuilder: FormBuilder,
        private adminService: AdminService,
        private lookupService: LookupService,
        private alertMessage: AlertmessageService) { }


    ngOnInit() {
        this.assetAllotmentForm();
        this.securityService.getEmployees().then((data) => (this.employees = data));
        this.initAssetCategories();
        this.initAssetTypes();
        this.unAssignAssetForm();
        this.initEmployees();
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

    initEmployees() {
        this.adminService.getEmployeesList().subscribe(resp => {
          this.employeesDropdown = resp as unknown as EmployeesList[];
          console.log(resp)
        });
      }

    assetsList = []
    //     { name: 'Mouse', code: 'MU' },
    //     { name: 'CPU', code: 'CP' },
    //     { name: 'Monitor', code: 'MO' },
    //     { name: 'Keyboard', code: 'KY' },
    //     { name: 'HeadSet', code: 'HS' },
    // ];
    // assetsCategory = [
    //     { name: 'Gadgets', code: 'GD' },
    //     { name: 'Fixed Assets', code: 'FA' }
    // ];

    assetAllotmentForm() {
        this.fbAssetAllotment = this.formbuilder.group({
            employeeId: new FormControl(null),
            assetCategoryId: new FormControl('', [Validators.required]),
            assetTypeId: new FormControl('', [Validators.required]),
            assetId: new FormControl('', [Validators.required]),
            assignedOn: new FormControl('', [Validators.required]),
            // revokedOn: new FormControl(''),
            // reasonForRevoke: new FormControl('')
            // comment: new FormControl('', [Validators.required]),
        });
    }

    get FormControls() {
        return this.fbAssetAllotment.controls;
    }

    unAssignAssetForm() {
        this.fbUnAssignAsset = this.formbuilder.group({
            assetAllotmentId: new FormControl('', [Validators.required]),
            revokedOn: new FormControl('', [Validators.required]),
            reasonForRevoke: new FormControl('', [Validators.required]),
            isActive: new FormControl('', [Validators.required]),
        });
    }

    get fcUnAssignAsset() {
        return this.fbUnAssignAsset.controls;
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    onClose() {
        this.fbAssetAllotment.reset();
    }

    addAssetAllotment() {
        this.fbAssetAllotment.controls['assignedOn'].setValue(new Date());
        this.showAssetAllotment = true;
        this.addFlag = true;
    }

    directAssetAllotment(employeeId: number) {
        this.fbAssetAllotment.value.employeeId = 3;
        this.addAssetAllotment();
    }

    viewAssetAllotments(employeeId: number) {
        this.showAssetDetails = true;
        // this.onClose();
        employeeId = 3;
        this.adminService.GetAssetAllotments(employeeId).subscribe((resp) => {
            if (resp) {
                this.assetAllotments = resp as unknown as AssetAllotmentViewDto[];
            }
        });
    }

    saveAssetAllotment(): Observable<HttpEvent<AssetAllotmentDto>> {
        if (this.addFlag) return this.adminService.CreateAssetAllotment(this.fbAssetAllotment.value)
        else return null; this.adminService.UpdateAssets(this.fbAssetAllotment.value)
    }

    onSubmitAsset() {
        this.fbAssetAllotment.controls['employeeId'].setValue(3);
        this.fbAssetAllotment.value.employeeId = 3;
        this.saveAssetAllotment().subscribe((resp) => {
            if (resp) {
                if (this.showAssetDetails) this.viewAssetAllotments(this.fbAssetAllotment.value.employeeId);
                this.onClose();
                this.showAssetAllotment = false;
                this.alertMessage.displayAlertMessage(ALERT_CODES["SAAAA001"]);
            }
            else this.alertMessage.displayErrorMessage(ALERT_CODES["EAAAA001"]);
        });
    }

    unAssignedAssetDialog(assetAllotment: AssetAllotmentViewDto) {
        this.fcUnAssignAsset['assetAllotmentId'].setValue(assetAllotment.assetAllotmentId);
        this.fcUnAssignAsset['revokedOn'].setValue(new Date());
        this.fcUnAssignAsset['isActive'].setValue(false);
        this.showUnassignAsset = true;
    }

    onSubmitUnAssignedAsset() {
        // this.fbUnAssignAsset.controls['isActive'].setValue(false);
        this.adminService.UnassignAssetAllotment(this.fbUnAssignAsset.value).subscribe((resp) => {
            if (this.showAssetDetails) this.viewAssetAllotments(this.fbAssetAllotment.value.employeeId);
            this.onCloseUnAssignAsset()
            this.showUnassignAsset = false;
            this.alertMessage.displayAlertMessage(ALERT_CODES["SAAAA002"]);
            // else this.alertMessage.displayErrorMessage(ALERT_CODES["EAAAA002"]);
        });
    }

    onCloseUnAssignAsset() {
        this.fbUnAssignAsset.reset();
    }

}
