import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LookupsComponent } from './lookups/lookups.component';
import { HolidayconfigurationComponent } from './holidayconfiguration/holidayconfiguration.component';
import { AssetsComponent } from './assets/assets.component';
import { JobdesignComponent } from './jobdesign/jobdesign.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { AdminRoutingModule } from './admin-routing.module';
import { PrimengModule } from '../_shared/primeng.module';
import { ProjectComponent } from './project/project.component';
import { AssetsallotmentComponent } from './assetsallotment/assetsallotment.component';

@NgModule({
  declarations: [
    LookupsComponent,
    HolidayconfigurationComponent,
    AssetsComponent,
    JobdesignComponent,
    RecruitmentComponent,
    ProjectComponent,
    AssetsallotmentComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PrimengModule
  ]
})
export class AdminModule { }
