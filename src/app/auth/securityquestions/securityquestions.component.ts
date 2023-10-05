import { BehaviorSubject, Subject } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CreateUserQuestionDto, SecureQuestionDto } from 'src/app/_models/security';
import { JwtService } from 'src/app/_services/jwt.service';
import { SecurityService } from 'src/app/_services/security.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';

export interface IHeader {
    field: string;
    header: string;
    label: string;
}

export interface SecurQuestion {
    code: number,
    name: string
}

export class SecurityDto {
    id?: number;
    SecurityQuestions?: string;
    Answer?: string;
}
@Component({
    selector: 'app-securityquestions',
    templateUrl: './securityquestions.component.html',
    styles: [
    ]
})
export class SecurityquestionsComponent {
    allSecureQuestions: SecureQuestionDto[] = [];
    secureQuestions: BehaviorSubject<SecureQuestionDto[]> = new BehaviorSubject([]);
    securityDto: SecurityDto[] = [];
    security: SecurityDto = {};
    oldSecurity: SecurityDto = {};
    securityDialog: boolean = false;
    submitted: boolean = true;
    qstnSubmitLabel: String = "Add";

    constructor(
        private formbuilder: FormBuilder,
        private securityService: SecurityService,
        private alertMessage: AlertmessageService,
        private jwtService: JwtService,
        private router: Router,) { }
    headers: IHeader[] = [
        { field: 'SecurityQuestions', header: 'SecurityQuestions', label: 'Security Questions' },
        { field: 'Answer', header: 'Answer', label: 'Answer' },
    ];

    openNew() {
        this.security = {};
        this.submitted = false;
        this.qstnSubmitLabel = "Add";
        this.securityDialog = true;
    }

    initGetSecureQuestions() {
        this.securityService.GetSecureQuestions().subscribe((resp) => {
            this.allSecureQuestions = resp as unknown as SecureQuestionDto[];
            this.secureQuestions.next(this.allSecureQuestions);
        });
    }

    ngOnInit(): void {
        this.initGetSecureQuestions();
    }

    editSecurity(s: SecurityDto) {
        Object.assign(this.security, s);
        Object.assign(this.oldSecurity, s);
        this.qstnSubmitLabel = "Update";
        this.securityDialog = true;
        this.resetSecureQuestions(this.security);
    }

    deleteSecurity(question: String) {
        this.securityDto.splice(this.securityDto.findIndex(item => item.SecurityQuestions === question), 1);
        this.resetSecureQuestions();
    }

    resetSecureQuestions(security: SecurityDto = {}) {
        let test = this.allSecureQuestions.filter((value => this.securityDto.findIndex(question => question.SecurityQuestions === value.question) == -1 || value.question === security.SecurityQuestions));
        this.secureQuestions.next(test);
    }

    hideDialog() {
        this.securityDialog = false;
        this.submitted = false;
    }

    onChange(event: any) {
        this.security.id = this.allSecureQuestions[this.allSecureQuestions.findIndex(item => item.question === event.value)].questionId;
    }

    clearSelection() {
        this.securityDialog = false;
        this.security = {};
        this.oldSecurity = {};
        this.resetSecureQuestions();
    }

    saveSecurity() {
        this.submitted = true;
        if (this.security.Answer?.trim() && this.security.id) {
            let selectedIndex = this.securityDto.findIndex(value => value.SecurityQuestions == this.oldSecurity.SecurityQuestions);
            if (selectedIndex == -1) {
                this.securityDto.push(this.security);
            } else {
                this.securityDto[selectedIndex] = this.security;
            }
            this.clearSelection();
        }
    }

    onSubmit() {
        const username = this.jwtService.GivenName;
        const userId = this.jwtService.UserId;
        const createUserQuestions: CreateUserQuestionDto[] = this.securityDto.map(security => {
            return {
                question: security.SecurityQuestions,
                answer: security.Answer,
                username: username,
                userId: userId,
                questionId: security.id,
            };
        });
        this.securityService
            .CreateSecurityQuestions(createUserQuestions)
            .subscribe((resp) => {
                if (resp) {
                    this.alertMessage.displayAlertMessage(ALERT_CODES["SCUQ001"]);
                    this.securityDto = [];
                    this.router.navigate(['./dashboard/admin']);
                }
                else {
                    this.alertMessage.displayErrorMessage(ALERT_CODES["SCUQ002"]);
                }
            })
    }
}


