import { NgModule } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedModule } from '../_shared/shared.module';
import { AddassetallotmentDialogComponent } from './addassetallotment.dialog/addassetallotment.dialog.component';
import { UnassignassetDialogComponent } from './unassignasset.dialog/unassignasset.dialog.component';
import { ViewAssetAllotmentsDialogComponent } from './viewassetallotments.dialog/viewassetallotments.dialog.component';
import { BankdetailsDialogComponent } from './bankDetails.Dialog/bankdetails.dialog.component';

@NgModule({
  declarations: [
    AddassetallotmentDialogComponent,
    UnassignassetDialogComponent,
    ViewAssetAllotmentsDialogComponent,
    BankdetailsDialogComponent
  ],
  imports: [SharedModule],
  providers: [DialogService, DynamicDialogRef]
})
export class CommonDialogModule { }
