import { Component } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { SecurityService } from 'src/app/demo/service/security.service';
import { Assets, Employee, LookupDetailViewDto } from 'src/app/demo/api/security';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThisReceiver } from '@angular/compiler';
import { LookupService } from 'src/app/_services/lookup.service';
import { AdminService } from 'src/app/_services/admin.service';
import { AssetsByAssetTypeIdViewDto } from 'src/app/_models/admin/assetsallotment';

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
    submitLabel!: string;
    showAssetDetails: boolean = false;
    showAssetAllotment: boolean = false;
    employees: Employee[] = [];

    constructor(private securityService: SecurityService,
        private formbuilder: FormBuilder,
        private adminService: AdminService,
        private lookupService: LookupService) { }


    ngOnInit() {
        this.assetAllotmentForm();
        this.securityService.getEmployees().then((data) => (this.employees = data));
        this.initAssetCategories();
        this.initAssetTypes();
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
            empId: new FormControl('', [Validators.required]),
            assetCategoryId: new FormControl('', [Validators.required]),
            assetTypeId: new FormControl('', [Validators.required]),
            assetId: new FormControl('', [Validators.required]),
            assignedOn: new FormControl('', [Validators.required]),
            // comment: new FormControl('', [Validators.required]),
        });
    }

    get FormControls() {
        return this.fbAssetAllotment.controls;
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    onClose() {
        this.fbAssetAllotment.reset();
    }

    addAssestAllotment() {
        this.fbAssetAllotment.controls['assignedOn'].setValue(new Date());
        this.showAssetAllotment = true;
    }

    addAssetsDialog() {
        this.showAssetDetails = true;
        this.onClose();
    }

    onSubmit() { }

}
