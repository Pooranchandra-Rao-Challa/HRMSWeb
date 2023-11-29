import { JwtService } from 'src/app/_services/jwt.service';
import { LoginService } from 'src/app/_services/login.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { ALERT_CODES } from '../_alerts/alertmessage.service';
import { UnsavedChangesGuard } from '../_guards/unsaved-changes.guard';
import { UpdateStatusService } from '../_services/updatestatus.service';
import { Actions, DialogRequest } from '../_models/common';
import { LookupDialogComponent } from '../_dialogs/lookup.dialog/lookup.dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeeService } from '../_services/employee.service';
import { EmployeeBasicDetailViewDto } from '../_models/employes';
import { RecruitmentAttributesComponent } from '../admin/recruitment/recruitmentattributes.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent {
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    activeItem!: number;
    loggedInUser: String = "";
    isUpdating: boolean;
    ActionTypes = Actions;
    lookupDialogComponent = LookupDialogComponent;
    recruitmentAttributesComponent = RecruitmentAttributesComponent;
    dialogRequest: DialogRequest = new DialogRequest();
    employeeDtls = new EmployeeBasicDetailViewDto();
    EmployeeId: number;

    constructor(public layoutService: LayoutService,
        private jwtService: JwtService,
        public el: ElementRef,
        private unsavedChangesGuard: UnsavedChangesGuard,
        private loginService: LoginService,
        private updateStatusService: UpdateStatusService,
        private dialogService: DialogService,
        public ref: DynamicDialogRef,
        private employeeService: EmployeeService,) {
        this.loggedInUser = this.jwtService.GivenName;
        this.EmployeeId = this.jwtService.EmployeeId;
    }

    ngOnInit(): void {
        if (this.EmployeeId) {
            this.initViewEmpDtls();
        }
    }

    initViewEmpDtls() {
        this.employeeService.GetViewEmpPersDtls(this.EmployeeId).subscribe((resp) => {
            this.employeeDtls = resp as unknown as EmployeeBasicDetailViewDto;
        });
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onSidebarButtonClick() {
        this.layoutService.showSidebar();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    logOut() {
        // Set the flag before initiating the logout action
        this.unsavedChangesGuard.setLogoutInProgress(false);
        this.isUpdating = this.updateStatusService.getIsUpdating();
        if (this.isUpdating) {
            this.unsavedChangesGuard.openDialog().subscribe((canLogout) => {
                if (canLogout) {
                    this.isUpdating = false;
                    this.updateStatusService.setIsUpdating(this.isUpdating);
                    // Perform actual logout
                    this.loginService.revokeToken(ALERT_CODES["HRMS002"]);
                    this.unsavedChangesGuard.setLogoutInProgress(true);
                }
                else {
                    this.unsavedChangesGuard.setLogoutInProgress(false);
                }
            });
        }
        else {
            this.loginService.revokeToken(ALERT_CODES["HRMS002"]);
        }
    }

    openComponentDialogforRecruitmentAttributes(content: any,
        dialogData, action: Actions = this.ActionTypes.add) {
        if (action == Actions.save && content === this.recruitmentAttributesComponent) {
            this.dialogRequest.dialogData = dialogData;
            this.dialogRequest.header = "Recruitment Attributes";
            this.dialogRequest.width = "70%";
        }
        this.ref = this.dialogService.open(content, {
            data: this.dialogRequest.dialogData,
            header: this.dialogRequest.header,
            width: this.dialogRequest.width
        });
        // this.ref.onClose.subscribe((res: any) => {
        //   if (res) this.getLookUp(true);
        //   event.preventDefault(); // Prevent the default form submission
        // });
    }

    openComponentDialog(content: any,
        dialogData, action: Actions = this.ActionTypes.add) {
        if (action == Actions.save && content === this.lookupDialogComponent) {
            this.dialogRequest.dialogData = dialogData;
            this.dialogRequest.header = "Lookup";
            this.dialogRequest.width = "70%";
        }
        this.ref = this.dialogService.open(content, {
            data: this.dialogRequest.dialogData,
            header: this.dialogRequest.header,
            width: this.dialogRequest.width
        });
        // this.ref.onClose.subscribe((res: any) => {
        //   if (res) this.getLookUp(true);
        //   event.preventDefault(); // Prevent the default form submission
        // });
    }
}
