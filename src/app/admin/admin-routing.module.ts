import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AssetsComponent } from './assets/assets.component';
import { AssetsallotmentComponent } from './assetsallotment/assetsallotment.component';
import { HolidayconfigurationComponent } from './holidayconfiguration/holidayconfiguration.component';
import { JobdesignComponent } from './jobdesign/jobdesign.component';
import { LookupsComponent } from './lookups/lookups.component';
import { ProjectComponent } from './project/project.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'assets', data: { breadcrumb: 'Assets' }, component: AssetsComponent },
        { path:'assetsallotment', data: { breadcrumb: 'Asset Allotments' }, component:AssetsallotmentComponent},
        { path: 'holidayconfiguration', data: { breadcrumb: 'Holiday Configuration' }, component: HolidayconfigurationComponent },
        { path: 'jobdesign', data: { breadcrumb: 'Job Design' }, component: JobdesignComponent },
        { path: 'lookups', data: { breadcrumb: 'lookups' }, component: LookupsComponent },
        { path: 'recruitment', data: { breadcrumb: 'Recruitment' }, component: RecruitmentComponent },
        { path: 'project', data: { breadcrumb: 'Project' }, component: ProjectComponent },
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
