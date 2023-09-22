import { NgModule } from '@angular/core';
import { EmployeeRoutingModule } from './employee-routing.module';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { LeavesComponent } from './leaves/leaves.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { OnboardingemployeesComponent } from './onboardingemployees/onboardingemployees.component';
import { ViewemployeesComponent } from './viewemployees/viewemployees.component';
import { BasicDetailsComponent } from './onboardingemployees/basic-details/basic-details.component';
import { EducationDetailsComponent } from './onboardingemployees/education-details/education-details.component';
import { ExperienceDetailsComponent } from './onboardingemployees/experience-details/experience-details.component';
import { StepsModule } from 'primeng/steps';
import { UploadDocumentsComponent } from './onboardingemployees/upload-documents/upload-documents.component';
import { FinalSubmitComponent } from './onboardingemployees/final-submit/final-submit.component';
import { FamilyDeatilsComponent } from './onboardingemployees/family-deatils/family-deatils.component';
import { FileUploadModule } from 'primeng/fileupload';
import { SharedModule } from '../_shared/shared.module';
import { AddressComponent } from './onboardingemployees/address/address.component';
import { BankDetailsComponent } from './onboardingemployees/bank-details/bank-details.component';
import { CommonDialogModule } from '../_dialogs/common.dialog.module';



@NgModule({
  declarations: [
    AllEmployeesComponent,
    LeavesComponent,
    AttendanceComponent,
    NotificationsComponent,
    OnboardingemployeesComponent,
    ViewemployeesComponent,
    BasicDetailsComponent,
    EducationDetailsComponent,
    ExperienceDetailsComponent,
    UploadDocumentsComponent,
    FinalSubmitComponent,
    FamilyDeatilsComponent,
    AddressComponent,
    BankDetailsComponent
  ],

  imports: [
    // ListDemoRoutingModule,
    EmployeeRoutingModule,
    StepsModule,
    FileUploadModule,
    SharedModule,
    CommonDialogModule
  ]
})
export class EmployeeModule { }
