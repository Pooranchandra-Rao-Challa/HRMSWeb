import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CreateUserQuestionDto, SecureQuestionDto } from 'src/app/_models/security';
import { JwtService } from 'src/app/_services/jwt.service';
import { SecurityService } from 'src/app/_services/security.service';
import jwtdecode from 'jwt-decode';
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
  createUserQuestions: CreateUserQuestionDto[] = [];
  getSecureQuestions: SecureQuestionDto[] = [];
  allSecureQuestions: SecureQuestionDto[] = [];
  securityquestions: SecurQuestion[];
  selectedQuestion!: SecurQuestion;
  securityDto: SecurityDto[] = [];
  security!: SecurityDto;
  securityDialog: boolean = false;
  submitted: boolean = true;
  qstnSubmitLabel: String = "Add";

  constructor(
    private formbuilder: FormBuilder,
    private securityService: SecurityService,
    private alertMessage: AlertmessageService,
    private jwtService: JwtService,
    private router: Router,) {}
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
      this.getSecureQuestions = resp as unknown as SecureQuestionDto[];
      this.allSecureQuestions = [...this.getSecureQuestions];
    });
  }

  ngOnInit(): void {
    this.initGetSecureQuestions();
  }

  editSecurity(security: SecurityDto) {
    this.security = security;
    this.qstnSubmitLabel = "Update";
    this.securityDialog = true;
    this.getSecureQuestions.push({
      questionId: this.security.id,
      question: this.security.SecurityQuestions
    });
  }

  deleteSecurity(question: String) {
    this.securityDto.splice(this.securityDto.findIndex(item => item.SecurityQuestions === question), 1);
    this.securityDto = [...this.securityDto];
  }

  hideDialog() {
    this.securityDialog = false;
    this.submitted = false;
  }

  onChange(event: any) {
    this.security.id = this.getSecureQuestions[this.getSecureQuestions.findIndex(item => item.question === event.value)].questionId;
    this.getSecureQuestions.splice(this.getSecureQuestions.findIndex(item => item.question === event.value), 1);
  }

  saveSecurity() {
    this.submitted = true;
    if (this.security.Answer?.trim()) {
      if (this.security.id) {
        const index = this.findIndexById(this.security.id);
        if (index >= 0) {
          this.securityDto[index] = this.security;
          this.alertMessage.displayAlertMessage(ALERT_CODES["SSESQ001"]);
        } else {
          this.securityDto.push(this.security);
          this.alertMessage.displayAlertMessage(ALERT_CODES["SSESQ003"]);
        }
      }
      this.securityDto = [...this.securityDto];
      this.securityDialog = false;
      this.security = {};
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.securityDto.length; i++) {
      if (this.securityDto[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  onSubmit() {
    if (this.securityDto.length >= 2) {
      const jwtToken = jwtdecode(this.jwtService.JWTToken) as unknown as any;
      const username = jwtToken.GivenName;
      const userId = jwtToken.Id;
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
            this.createUserQuestions = resp as unknown as CreateUserQuestionDto[];
            this.alertMessage.displayAlertMessage(ALERT_CODES["SSESQ001"]);
            this.securityDto = [];
            this.router.navigate(['./dashboard/admin']);
          }
          else {
            this.alertMessage.displayErrorMessage(ALERT_CODES["SSESQ002"]);
          }
        })
    }
  }
}


