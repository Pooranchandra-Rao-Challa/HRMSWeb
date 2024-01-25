import { Component } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AssetAllotmentViewDto } from 'src/app/_models/admin/assetsallotment';
import { Actions, DialogRequest } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { AddassetallotmentDialogComponent } from '../addassetallotment.dialog/addassetallotment.dialog.component';
import { UnassignassetDialogComponent } from '../unassignasset.dialog/unassignasset.dialog.component';

@Component({
    selector: 'app-viewassetallotments.dialog',
    templateUrl: './viewassetallotments.dialog.component.html',
})
export class ViewAssetAllotmentsDialogComponent {
    assetAllotments: AssetAllotmentViewDto[] = [];
    ActionTypes = Actions;
    addassetallotmentDialogComponent = AddassetallotmentDialogComponent;
    unassignassetDialogComponent = UnassignassetDialogComponent;
    dialogRequest: DialogRequest = new DialogRequest();
    defaultPhoto: string;
    
    constructor(private adminService: AdminService,
        public ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private dialogService: DialogService) { }

    ngOnInit() {
        this.initAssetAllotments();
        this.defaultPhoto = './assets/layout/images/projectsDefault.jpg';
    }

    initAssetAllotments() {
        this.adminService.GetAssetAllotments(this.config.data.employeeId).subscribe((resp) => {
            if (resp) {
                this.assetAllotments = resp as unknown as AssetAllotmentViewDto[];
            }
        });
    }

    openComponentDialog(content: any,
        dialogData, action: Actions = this.ActionTypes.add) {
        if (action == Actions.unassign && content === this.unassignassetDialogComponent) {
            this.dialogRequest.dialogData = dialogData;
            this.dialogRequest.header = "Unassign Asset";
            this.dialogRequest.width = "40%";
        }
        else if (action == Actions.add && content === this.addassetallotmentDialogComponent) {
            this.dialogRequest.dialogData = {
                employeeId: this.config.data.employeeId
            }
            this.dialogRequest.header = "Asset Allotment";
            this.dialogRequest.width = "70%";
        }
        this.ref = this.dialogService.open(content, {
            data: this.dialogRequest.dialogData,
            header: this.dialogRequest.header,
            width: this.dialogRequest.width
        });
        this.ref.onClose.subscribe((res: any) => {
            if (res) this.initAssetAllotments();
            event.preventDefault(); // Prevent the default form submission
        });
    }

}
