import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LoginModel } from 'src/app/_models/login.model';
import { JwtService } from 'src/app/_services/jwt.service';
import { LoginService, LogInSuccessModel } from 'src/app/_services/login.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    rememberMe: boolean = false;
    submitted = false;
    fbloginForm: FormGroup;

    constructor(private layoutService: LayoutService,
        private loginService: LoginService,
        private router: Router,
        private messageService: MessageService,
        private jWTService: JwtService) { }

    ngOnInit() {
        this.loginForm();
    }

    loginForm() {
        this.fbloginForm = new FormGroup({
            userName: new FormControl(null),
            password: new FormControl(null)
        });
    }

    get FormControls() {
        return this.fbloginForm.controls;
    }
    onSubmit() {
        this.submitted = true;
        this.loginService.Authenticate(this.fbloginForm.value as LoginModel)
            .subscribe(
                {
                    next: (resp: LogInSuccessModel) => {
                        if (resp.isLoginSuccess && resp.hasSecureQuestions) {
                            this.messageService.add({ severity: 'success', key: 'myToast', summary: 'Success!', detail: 'Signing in...!' });
                            setTimeout(() => {
                                this.router.navigate(['./dashboard/admin']);
                            }, 1000);
                            this.loginService.startRefreshTokenTimer();
                        }
                        else if (resp.isLoginSuccess && !resp.hasSecureQuestions) {
                            this.router.navigate(['./auth/security']);
                        } else {
                            this.submitted = false;
                        }
                    },
                    error: (error) => {
                        this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error: ' + error.statusCode + ' - ' + error.statusDescription, detail: error.errorMsg });
                        this.submitted = false;
                    },
                    complete: () => {
                        console.log("The user is login successfully");
                    }
                });
    }

    get dark(): boolean {
        return this.layoutService.config.colorScheme !== 'light';
    }

}
