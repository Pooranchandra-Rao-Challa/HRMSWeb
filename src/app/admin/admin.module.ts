import { LookupsComponent } from './lookups/lookups.component';
import { HolidayconfigurationComponent } from './holidayconfiguration/holidayconfiguration.component';
import { AssetsComponent } from './assets/assets.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ProjectComponent } from './project/project.component';
import { AssetsallotmentComponent } from './assetsallotment/assetsallotment.component';
import { SharedModule } from '../_shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonDialogModule } from '../_dialogs/common.dialog.module';
import { D3OrgChartComponent } from './project/d3-org-chart/d3-org-chart.component';
import { JobOpeningsComponent } from './jobopenings/jobopenings.component';

@NgModule({
  declarations: [
    LookupsComponent,
    HolidayconfigurationComponent,
    AssetsComponent,
    JobOpeningsComponent,
    RecruitmentComponent,
    ProjectComponent,
    AssetsallotmentComponent,
    D3OrgChartComponent,

  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    CommonDialogModule
  ]
})
export class AdminModule { }
