import { NgModule } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedModule } from '../_shared/shared.module';
import { AddassetallotmentDialogComponent } from './addassetallotment.dialog/addassetallotment.dialog.component';
import { UnassignassetDialogComponent } from './unassignasset.dialog/unassignasset.dialog.component';
import { ViewAssetAllotmentsDialogComponent } from './viewassetallotments.dialog/viewassetallotments.dialog.component';
import { BankdetailsDialogComponent } from './bankDetails.Dialog/bankdetails.dialog.component';
import { AddressDialogComponent } from './address.dialog/address.dialog.component';
import { uploadDocumentsDialogComponent } from './uploadDocuments.dialog/uploadDocuments.dialog.component';
import { FamilydetailsDialogComponent } from './familydetails.dailog/familydetails.dialog.component';

@NgModule({
  declarations: [
    AddassetallotmentDialogComponent,
    UnassignassetDialogComponent,
    ViewAssetAllotmentsDialogComponent,
    BankdetailsDialogComponent,
    AddressDialogComponent,
    uploadDocumentsDialogComponent,
    FamilydetailsDialogComponent
  ],
  imports: [SharedModule],
  providers: [DialogService, DynamicDialogRef]
})
export class CommonDialogModule { }
