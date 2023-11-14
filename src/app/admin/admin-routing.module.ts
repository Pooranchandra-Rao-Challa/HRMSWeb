import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AssetsComponent } from './assets/assets.component';
import { AssetsallotmentComponent } from './assetsallotment/assetsallotment.component';
import { HolidayconfigurationComponent } from './holidayconfiguration/holidayconfiguration.component';
import { LookupsComponent } from './lookups/lookups.component';
import { ProjectComponent } from './project/project.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { D3OrgChartComponent } from './project/d3-org-chart/d3-org-chart.component';
import { JobOpeningsComponent } from './jobopenings/jobopenings.component';
import { ApplicantComponent } from './applicant/applicant.component';
import { ApplicantstatusComponent } from './applicantstatus/applicantstatus.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'assets', data: { breadcrumb: 'Assets' }, component: AssetsComponent },
        { path: 'assetsallotment', data: { breadcrumb: 'Asset Allotments' }, component: AssetsallotmentComponent },
        { path: 'applicant', data: { breadcrumb: 'Applicants' }, component: ApplicantComponent },
        { path: 'applicantstatus', data: { breadcrumb: 'Applicant Status' }, component: ApplicantstatusComponent },
        { path: 'holidayconfiguration', data: { breadcrumb: 'Holiday Configuration' }, component: HolidayconfigurationComponent },
        { path: 'jobopenings', data: { breadcrumb: 'Job Openings' }, component: JobOpeningsComponent },
        { path: 'lookups', data: { breadcrumb: 'lookups' }, component: LookupsComponent },
        { path: 'recruitment', data: { breadcrumb: 'Recruitment' }, component: RecruitmentComponent },
        { path: 'project', data: { breadcrumb: 'Project' }, component: ProjectComponent },
        { path: 'd3-org-chart', component: D3OrgChartComponent }
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
