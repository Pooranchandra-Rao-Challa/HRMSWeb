import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityRoutingModule } from './security-routing.module';
import { UserComponent } from './user/user.component';
import { RolesComponent } from './roles/roles.component';
import { PrimengModule } from '../_shared/primeng.module';



@NgModule({
  declarations: [UserComponent, RolesComponent],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    CommonModule,
    PrimengModule
   ],
  exports:[UserComponent,RolesComponent]

})
export class SecurityModule { }
