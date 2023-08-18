import { JwtService } from 'src/app/_services/jwt.service';
import { LoginService } from 'src/app/_services/login.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { ALERT_CODES } from '../_alerts/alertmessage.service';
import { CanDeactivateGuard } from '../_guards/can-deactivate.guard';
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

    constructor(public layoutService: LayoutService,
        private jwtService: JwtService,
        public el: ElementRef,
        private canDeactivateGuard: CanDeactivateGuard,
        private route: ActivatedRoute,
        private loginService: LoginService,
        private updateStatusService: UpdateStatusService) {
        this.loggedInUser = this.jwtService.GivenName;
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
        this.canDeactivateGuard.setLogoutInProgress(false);

        this.isUpdating = this.updateStatusService.getIsUpdating();


        if (this.isUpdating) {
            this.canDeactivateGuard.openDialog().subscribe((canLogout) => {
                if (canLogout) {
                    this.isUpdating = false;
                    this.updateStatusService.setIsUpdating(this.isUpdating);
                    // Perform actual logout
                    this.loginService.revokeToken(ALERT_CODES["HRMS002"]);
                    this.canDeactivateGuard.setLogoutInProgress(true);
                }
                else {
                    this.canDeactivateGuard.setLogoutInProgress(false);
                }
            });
        }
        else {
            this.loginService.revokeToken(ALERT_CODES["HRMS002"]);
        }
    }
}
