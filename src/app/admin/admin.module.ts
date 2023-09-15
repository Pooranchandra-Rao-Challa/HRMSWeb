import { LookupsComponent } from './lookups/lookups.component';
import { HolidayconfigurationComponent } from './holidayconfiguration/holidayconfiguration.component';
import { AssetsComponent } from './assets/assets.component';
import { JobdesignComponent } from './jobdesign/jobdesign.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ProjectComponent } from './project/project.component';
import { AssetsallotmentComponent } from './assetsallotment/assetsallotment.component';
import { SharedModule } from '../_shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonDialogModule } from '../_dialogs/common.dialog.module';

@NgModule({
  declarations: [
    LookupsComponent,
    HolidayconfigurationComponent,
    AssetsComponent,
    JobdesignComponent,
    RecruitmentComponent,
    ProjectComponent,
    AssetsallotmentComponent,

  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    CommonDialogModule
  ]
})
export class AdminModule { }
