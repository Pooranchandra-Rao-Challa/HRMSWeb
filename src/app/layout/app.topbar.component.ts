import { JwtService } from 'src/app/_services/jwt.service';
import { LoginService } from 'src/app/_services/login.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { ALERT_CODES } from '../_alerts/alertmessage.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent {
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    activeItem!: number;
    loggedInUser: String = "";

    constructor(public layoutService: LayoutService,
        private jwtService: JwtService,
        public el: ElementRef,
        private loginService: LoginService) {
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
        this.loginService.revokeToken(ALERT_CODES["HRMS002"]);
    }
}
