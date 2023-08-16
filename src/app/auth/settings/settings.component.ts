import { JwtService } from 'src/app/_services/jwt.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { SecureQuestionDto, UserQuestionDto } from 'src/app/_models/security';
import { SecurityService } from 'src/app/_services/security.service';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { ConfirmedValidator } from 'src/app/_validators/confirmValidator';
import { HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import jwtdecode from 'jwt-decode';

export class SecurityDto {
    id?: number;
    SecurityQuestions?: string;
    Answer?: string;
}

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    // styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
    getSecureQuestions: SecureQuestionDto[] = []
    allSecureQuestions: SecureQuestionDto[] = []
    updateQuestions: UserQuestionDto[] = []
    securityDto: SecurityDto[] = [];
    // selectedQuestion!: SecurQuestion;
    // userQuestions: UserQuestionDto[] = [];
    // changePassword: ChangePasswordDto = {}
    security!: UserQuestionDto;
    showDialog: boolean = false;
    submitted: boolean = true;
    qstnSubmitLabel: String = "Add";
    fbChangePassword!: FormGroup;
    userQuestions: UserQuestionDto[] = [];
    addFlag!: boolean;
    isUpdating: boolean = false;

    constructor(
        private messageService: MessageService,
        private formbuilder: FormBuilder,
        private securityService: SecurityService,
        public layoutService: LayoutService,
        private jwtService: JwtService,
        private alertMessage: AlertmessageService
    ) { }

    ngOnInit(): void {
        this.initGetSecureQuestions();
        this.getUserQuestionsAndAnswers();
        this.changePasswordForm();
    }

    getUserQuestionsAndAnswers() {
        this.securityService.UserSecurityQuestions(this.jwtService.GivenName).subscribe({
            next: (resp) => {
                this.userQuestions = resp as unknown as UserQuestionDto[];
                this.filterSecurityQuestion(this.userQuestions);
            }
        });
    }

    filterSecurityQuestion(userQuestions: UserQuestionDto[]) {
        this.userQuestions.forEach(userQuestion => {
            this.getSecureQuestions = this.getSecureQuestions.filter(x => x.question != userQuestion.question) as UserQuestionDto[];
        });
    }

    addSecurityQuestion() {
        this.security = {};
        this.submitted = false;
        this.qstnSubmitLabel = "Add";
        this.showDialog = true;
        this.addFlag = true;
    }

    initGetSecureQuestions() {
        this.securityService.GetSecureQuestions().subscribe((resp) => {
            this.getSecureQuestions = resp as unknown as SecureQuestionDto[];
            this.allSecureQuestions = [...this.getSecureQuestions];
        });
    }

    changePasswordForm() {
        this.fbChangePassword = this.formbuilder.group({
            password: new FormControl('', Validators.required),
            newPassword: new FormControl('', Validators.required),
            confirmPassword: new FormControl('', Validators.required)
        }, {
            validator: ConfirmedValidator('newPassword', 'confirmPassword')
        });
    }

    get FormControls() {
        return this.fbChangePassword.controls;
    }

    onChangePassword() {
        this.securityService.ChangePassword(this.fbChangePassword.value).pipe(
            catchError((error) => {
                this.alertMessage.displayErrorMessage(ALERT_CODES["ESECP001"]);
                return throwError(error); // Re-throw the error to propagate it further if needed
            })
        ).subscribe(resp => {
            this.alertMessage.displayAlertMessage(ALERT_CODES["SSECP001"]);
            this.fbChangePassword.reset();
        });
    }

    editSecurityQuestion(security: UserQuestionDto) {
        this.onFilterSelection(security);
        this.security = security;
        this.qstnSubmitLabel = "Update";
        this.showDialog = true;
        this.addFlag = false;
    }

    deleteSecurityQuestion(question: String) {
        this.userQuestions.splice(this.userQuestions.findIndex(item => item.question === question), 1);
        this.userQuestions = [...this.userQuestions];
    }

    hideDialog() {
        this.showDialog = false;
        this.submitted = false;
    }
    onChange(event: any) {
        this.security.questionId = this.getSecureQuestions[this.getSecureQuestions.findIndex(item => item.question === event.value)].questionId;
        this.getSecureQuestions.splice(this.getSecureQuestions.findIndex(item => item.question === event.value), 1);
    }

    saveSecurityQuestions() {
        this.submitted = true;
        if (this.security.answer?.trim()) {
            if (this.security.questionId) {
                const index = this.findIndexById(this.security.questionId);
                if (index >= 0) {
                    this.userQuestions[index] = this.security;
                    this.alertMessage.displayAlertMessage(ALERT_CODES["SSESQ001"]);
                } else {
                    this.userQuestions.push(this.security);
                    this.alertMessage.displayAlertMessage(ALERT_CODES["SSESQ003"]);
                }
            }
            this.userQuestions = this.userQuestions;
            this.showDialog = false;
            this.security = {};
        }
        else {
            this.userQuestions.push(this.security);
        }
        this.onFilterSelection(this.security);
        this.userQuestions = [...this.userQuestions];
        this.showDialog = false;
        this.isUpdating = true;
    }

    onFilterSelection(security: UserQuestionDto) {
        if (!this.addFlag) {
            let tempData = this.getSecureQuestions.filter(x => x.question == security.question) as UserQuestionDto[];
            if (tempData.length == 0) {
                let params = {
                    questionId: security.questionId,
                    question: security.question
                }
                this.getSecureQuestions.push(params);
            }
        }
        else {
            this.getSecureQuestions.splice(this.getSecureQuestions.findIndex(item => item.question === this.security.question), 1);
        }
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.userQuestions.length; i++) {
            if (this.userQuestions[i].questionId === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    onSubmit() {
        const jwtToken = jwtdecode(this.jwtService.JWTToken) as unknown as any;
        const username = jwtToken.GivenName;
        const userId = jwtToken.Id;
        this.userQuestions = this.userQuestions.map(security => {
            return {
                userQuestionId: security.userQuestionId,
                answer: security.answer,
                userName: username,
                userId: userId,
                questionId: security.questionId,
                question: security.question,
            };
        });
        this.securityService
            .UpdateSecurityQuestions(this.userQuestions)
            .subscribe((resp) => {
                if (resp) {
                    this.userQuestions = resp as unknown as UserQuestionDto[];
                    this.alertMessage.displayAlertMessage(ALERT_CODES["SSESQ001"]);
                    this.getUserQuestionsAndAnswers();
                    this.isUpdating = false;
                }
                else{
                    this.alertMessage.displayErrorMessage(ALERT_CODES["SSESQ002"]);
                }

            });

    }
}
