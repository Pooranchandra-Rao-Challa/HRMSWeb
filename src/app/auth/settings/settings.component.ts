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
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import jwtdecode from 'jwt-decode';
import { UpdateStatusService } from 'src/app/_services/updatestatus.service';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    // styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
    secureQuestions: BehaviorSubject<SecureQuestionDto[]> = new BehaviorSubject([]);
    allSecureQuestions: SecureQuestionDto[] = []
    userQuestions: UserQuestionDto[] = [];
    oldSecurity: UserQuestionDto = {}
    security: UserQuestionDto = {};
    showDialog: boolean = false;
    submitted: boolean = true;
    qstnSubmitLabel: String;
    fbChangePassword!: FormGroup;
    isUpdating: boolean = false;

    constructor(
        private formbuilder: FormBuilder,
        private securityService: SecurityService,
        public layoutService: LayoutService,
        private jwtService: JwtService,
        private alertMessage: AlertmessageService,
        private updateStatusService: UpdateStatusService
    ) {
        // Function to update isUpdating value
        this.updateStatusService.setIsUpdating(this.isUpdating);
    }

    ngOnInit(): void {
        this.initGetSecureQuestions();
        this.getUserQuestionsAndAnswers();
        this.changePasswordForm();
    }

    getUserQuestionsAndAnswers() {
        this.securityService.UserSecurityQuestions().subscribe((resp) => {
            this.userQuestions = resp as unknown as UserQuestionDto[];
            this.filterSecureQuestions();
        });
    }

    addSecurityQuestion() {
        this.security = {};
        this.submitted = false;
        this.qstnSubmitLabel = "Add";
        this.showDialog = true;
    }

    initGetSecureQuestions() {
        this.securityService.GetSecureQuestions().subscribe((resp) => {
            this.allSecureQuestions = resp as unknown as SecureQuestionDto[];
            this.secureQuestions.next(this.allSecureQuestions);
            this.filterSecureQuestions();
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

    editSecurityQuestion(s: UserQuestionDto) {
        Object.assign(this.security, s);
        Object.assign(this.oldSecurity, s);
        this.qstnSubmitLabel = "Update";
        this.showDialog = true;
        this.filterSecureQuestions(this.security);
    }

    deleteSecurityQuestion(question: String) {
        this.userQuestions.splice(this.userQuestions.findIndex(item => item.question === question), 1);
        this.filterSecureQuestions();
    }

    filterSecureQuestions(security: UserQuestionDto = {}) {
        if (this.userQuestions && this.allSecureQuestions) {
            const filteredQuestions = this.allSecureQuestions.filter((secureQuestion) => {
                return this.userQuestions.findIndex((userQuestion) => userQuestion.question === secureQuestion.question) === -1 || secureQuestion.question === security.question;
            });
            this.secureQuestions.next(filteredQuestions);
        }
    }

    hideDialog() {
        this.showDialog = false;
        this.submitted = false;
    }
    onChange(event: any) {
        this.security.questionId = this.allSecureQuestions[this.allSecureQuestions.findIndex(item => item.question === event.value)].questionId;
    }

    clearSelection() {
        this.showDialog = false;
        this.security = {};
        this.oldSecurity = {};
        this.filterSecureQuestions();
    }

    saveSecurityQuestions() {
        this.submitted = true;
        if (this.security.answer?.trim() && this.security.questionId) {
            let selectedIndex = this.userQuestions.findIndex(value => value.question == this.oldSecurity.question)
            if (selectedIndex == -1) {
                this.userQuestions.push(this.security);
            } else {
                this.userQuestions[selectedIndex] = this.security;
            }
            this.clearSelection();
        }
        this.isUpdating = true;
        // Function to update isUpdating value
        this.updateStatusService.setIsUpdating(this.isUpdating);
    }

    onSubmit() {
        const username = this.jwtService.GivenName;
        const userId = this.jwtService.UserId;
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
                    this.alertMessage.displayAlertMessage(ALERT_CODES["SSESQ001"]);
                    this.getUserQuestionsAndAnswers();
                    this.isUpdating = false;
                    // Function to update isUpdating value
                    this.updateStatusService.setIsUpdating(this.isUpdating);
                }
                else {
                    this.alertMessage.displayErrorMessage(ALERT_CODES["SSESQ002"]);
                }

            });

    }

    onTabChange() {
        this.fbChangePassword.reset();
    }

    ngOnDestroy() {
        if (this.isUpdating) {
            this.isUpdating = false;
            // Function to update isUpdating value
            this.updateStatusService.setIsUpdating(this.isUpdating);
        }
    }
}
