import { NgModule } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedModule } from '../_shared/shared.module';
import { AddassetallotmentDialogComponent } from './addassetallotment.dialog/addassetallotment.dialog.component';
import { UnassignassetDialogComponent } from './unassignasset.dialog/unassignasset.dialog.component';
import { ViewAssetAllotmentsDialogComponent } from './viewassetallotments.dialog/viewassetallotments.dialog.component';
import { BankdetailsDialogComponent } from './bankDetails.Dialog/bankdetails.dialog.component';
import { AddressDialogComponent } from './address.dialog/address.dialog.component';
import { UploadDocumentsDialogComponent } from './uploadDocuments.dialog/uploadDocuments.dialog.component';
import { FamilydetailsDialogComponent } from './familydetails.dailog/familydetails.dialog.component';
import { BasicdetailsDialogComponent } from './basicdetails.dialog/basicdetails.dialog.component';
import { OfficedetailsDialogComponent } from './officedetails.dialog/officedetails.dialog.component';
import { EducationdetailsDialogComponent } from './educationdetails.dialog/educationdetails.dialog.component';
import { ExperiencedetailsDialogComponent } from './experiencedetails.dialog/experiencedetails.dialog.component';
import { LookupDialogComponent } from './lookup.dialog/lookup.dialog.component';
import { LeaveDialogComponent } from './leave.dialog/leave.dialog.component';
import { JobOpeningsDialogComponent } from './jobopenings.dialog/jobopenings.dialog.component';
import { ApplicantDialogComponent } from './applicant.dialog/applicant.dialog.component';
import { ViewapplicantDialogComponent } from './viewapplicant.dialog/viewapplicant.dialog.component';
import { StarRatingComponent } from './star-rating/star-rating.component';

@NgModule({
  declarations: [
    AddassetallotmentDialogComponent,
    UnassignassetDialogComponent,
    ViewAssetAllotmentsDialogComponent,
    BankdetailsDialogComponent,
    AddressDialogComponent,
    UploadDocumentsDialogComponent,
    FamilydetailsDialogComponent,
    BasicdetailsDialogComponent,
    OfficedetailsDialogComponent,
    EducationdetailsDialogComponent,
    ExperiencedetailsDialogComponent,
    LookupDialogComponent,
    LeaveDialogComponent,
    JobOpeningsDialogComponent,
    ApplicantDialogComponent,
    ViewapplicantDialogComponent,
    StarRatingComponent
  ],
  imports: [SharedModule],
  providers: [DialogService, DynamicDialogRef]
})
export class CommonDialogModule { }
