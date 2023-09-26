import { JwtService } from 'src/app/_services/jwt.service';
import { LoginService } from 'src/app/_services/login.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { ALERT_CODES } from '../_alerts/alertmessage.service';
import { UnsavedChangesGuard } from '../_guards/unsaved-changes.guard';
import { ActivatedRoute } from '@angular/router';
import { UpdateStatusService } from '../_services/updatestatus.service';

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
    // userPhoto: string;

    constructor(public layoutService: LayoutService,
        private jwtService: JwtService,
        public el: ElementRef,
        private unsavedChangesGuard: UnsavedChangesGuard,
        private route: ActivatedRoute,
        private loginService: LoginService,
        private updateStatusService: UpdateStatusService) {
        this.loggedInUser = this.jwtService.GivenName;
        // this.userPhoto = this.jwtService.UserPhoto;
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
}
