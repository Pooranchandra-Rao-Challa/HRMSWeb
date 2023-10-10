import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { LeavesComponent } from './leaves/leaves.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AddressComponent } from './onboardingemployees/address/address.component';
import { BankDetailsComponent } from './onboardingemployees/bank-details/bank-details.component';
import { BasicDetailsComponent } from './onboardingemployees/basic-details/basic-details.component';
import { EducationDetailsComponent } from './onboardingemployees/education-details/education-details.component';
import { ExperienceDetailsComponent } from './onboardingemployees/experience-details/experience-details.component';
import { FamilyDeatilsComponent } from './onboardingemployees/family-deatils/family-deatils.component';
import { FinalSubmitComponent } from './onboardingemployees/final-submit/final-submit.component';
import { OnboardingemployeesComponent } from './onboardingemployees/onboardingemployees.component';
import { UploadDocumentsComponent } from './onboardingemployees/upload-documents/upload-documents.component';
import { ViewemployeesComponent } from './viewemployees/viewemployees.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'all-employees', data: { breadcrumb: 'Search Employee' }, component: AllEmployeesComponent },
      { path: 'leaves', data: { breadcrumb: 'Leaves' }, component: LeavesComponent },
      { path: 'notifications', data: { breadcrumb: 'Notification' }, component: NotificationsComponent },
      { path: 'attendance', data: { breadcrumb: 'Attendance' }, component: AttendanceComponent },
      {
        path: 'onboardingemployee', data: { breadcrumb: 'On-Boarding Employees' }, component: OnboardingemployeesComponent,
        children: [
          { path: 'addressdetails/:employeeId', component: AddressComponent },
          { path: 'basicdetails', component: BasicDetailsComponent },
          { path: 'educationdetails/:employeeId', component: EducationDetailsComponent },
          { path: 'experiencedetails/:employeeId', component: ExperienceDetailsComponent },
          { path: 'bankdetails/:employeeId', component: BankDetailsComponent },
          { path: 'uploadfiles/:employeeId', component: UploadDocumentsComponent },
          { path: 'finalsubmit/:employeeId', component: FinalSubmitComponent },
          { path: 'familydetails/:employeeId', component: FamilyDeatilsComponent }
        ],
      },
      { path: 'viewemployees', data: { breadcrumb: 'Employee Name' }, component: ViewemployeesComponent }
    ])
  ],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
