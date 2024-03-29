import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { AttendanceComponent } from './attendance/attendance.component';
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
import { EmployeeLeavesComponent } from './employeeleaves/employeeleaves.component';
import { MyleaveComponent } from './myleave/myleave.component';
import { LeaveStatisticsComponent } from './leave-statistics/leave-statistics.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'all-employees', data: { breadcrumb: 'Enrolled Employees' }, component: AllEmployeesComponent },
      { path: 'employeeleaves', data: { breadcrumb: 'Employee Leaves' }, component: EmployeeLeavesComponent },
      { path: 'myleaves', data: { breadcrumb: 'My Leaves' }, component: MyleaveComponent },
      { path: 'notifications', data: { breadcrumb: 'Notification' }, component: NotificationsComponent },
      { path: 'attendance', data: { breadcrumb: 'Attendance' }, component: AttendanceComponent },
      { path: 'leaveStatistics', data: { breadcrumb: 'Leave Statistics' }, component: LeaveStatisticsComponent },
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
      { path: 'viewemployees', data: { breadcrumb: 'View Employee' }, component: ViewemployeesComponent }
    ])
  ],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
