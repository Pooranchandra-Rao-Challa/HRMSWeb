import { interval, Subject, takeUntil } from 'rxjs';
import { ViewAssetAllotmentsDialogComponent } from './../../_dialogs/viewassetallotments.dialog/viewassetallotments.dialog.component';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { AdminService } from 'src/app/_services/admin.service';
import { AssetsByAssetTypeIdViewDto } from 'src/app/_models/admin/assetsallotment';
import { Table } from 'primeng/table';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { EmployeesForAllottedAssetsViewDto, EmployeesList } from 'src/app/_models/admin';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddassetallotmentDialogComponent } from 'src/app/_dialogs/addassetallotment.dialog/addassetallotment.dialog.component';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { Unsubscribe } from 'src/app/_helpers/unsubscribe';

@Component({
    selector: 'app-assetsallotment',
    templateUrl: './assetsallotment.component.html',
    styles: [
    ]
})
export class AssetsallotmentComponent extends Unsubscribe {
    assets: AssetsByAssetTypeIdViewDto[] = [];
    sortField: string = '';
    sortOrder: number = 0;
    submitLabel!: string;
    showAssetDetails: boolean = false;
    showAssetAllotment: boolean = false;
    showUnassignAsset: boolean = false;
    employeesDropdown: EmployeesList[] = [];
    addFlag: boolean;
    maxDate: Date = new Date();
    employeesForAllottedAssets: EmployeesForAllottedAssetsViewDto[] = [];
    selectedEmployeeId: number;
    globalFilterFields: string[] = ['gender', 'employeeName', 'code', 'certificateDOB', 'employeeRoleName', 'dateofJoin', 'designation', 'officeEmailId', 'mobileNumber'];
    headers: ITableHeader[] = [
        { field: 'gender', header: 'gender', label: 'Gender' },
        { field: 'employeeName', header: 'employeeName', label: 'Employee Name' },
        { field: 'code', header: 'code', label: 'Employee Code' },
        { field: 'certificateDOB', header: 'certificateDOB', label: 'Certificate DOB' },
        { field: 'employeeRoleName', header: 'employeeRoleName', label: 'Employee Role' },
        { field: 'dateofJoin', header: 'dateofJoin', label: 'Date of Join' },
        { field: 'designation', header: 'designation', label: 'Designation' },
        { field: 'officeEmailId', header: 'officeEmailId', label: 'Email' },
        { field: 'mobileNumber', header: 'mobileNumber', label: 'Phone No' },
    ];
    @ViewChild('filter') filter!: ElementRef;
    totalRecords = this.employeesForAllottedAssets.length; // Total number of records
    ActionTypes = Actions;
    viewAssetAllotmentsDialogComponent = ViewAssetAllotmentsDialogComponent;
    addassetallotmentDialogComponent = AddassetallotmentDialogComponent;
    dialogRequest: DialogRequest = new DialogRequest();
    mediumDate: string = MEDIUM_DATE;

    constructor(private adminService: AdminService,
        public ref: DynamicDialogRef,
        private dialogService: DialogService) {
        super();
    }

    ngOnInit() {
        this.initEmployeesForAllottedAssets();
    }

    initEmployeesForAllottedAssets() {
        this.adminService.EmployeesForAllottedAssets().pipe(takeUntil(this.unsubscribe$)).subscribe((resp) => {
            this.employeesForAllottedAssets = resp as unknown as EmployeesForAllottedAssetsViewDto[];
        });
    }

    openComponentDialog(content: any,
        dialogData, action: Actions = this.ActionTypes.add) {
        if (action == Actions.view && content === this.viewAssetAllotmentsDialogComponent) {
            this.dialogRequest.header = "View Asset Allotment";
            this.dialogRequest.width = "70%";
        }
        else if (action == Actions.add && content === this.addassetallotmentDialogComponent) {
            this.dialogRequest.header = "Asset Allotment";
            this.dialogRequest.width = "70%";
        }
        this.ref = this.dialogService.open(content, {
            data: {
                employeeId: dialogData
            },
            header: this.dialogRequest.header,
            width: this.dialogRequest.width
        });
        this.ref.onClose.subscribe((res: any) => {
            event.preventDefault(); // Prevent the default form submission
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }


    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

}
