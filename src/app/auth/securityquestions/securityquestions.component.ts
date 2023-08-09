import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SecureQuestionDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';

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
  getSecureQuestions: SecureQuestionDto[] = []
  allSecureQuestions: SecureQuestionDto[] = []
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


  ) {
    this.securityquestions = [
      { code: 1, name: 'What city were you born in?' },
      { code: 2, name: 'What is the name of your first pet?' },
      { code: 3, name: 'What is the title and artist of your favorite song?' },
      { code: 4, name: 'What is your astrological sign?' },
      { code: 5, name: 'What is your date of birth?' }
    ];
    this.selectedQuestion = this.securityquestions[0];
  }
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
    this.securityService.GetSecureQuestions().then((data: SecureQuestionDto[]) => (this.getSecureQuestions = data));

  }
  ngOnInit(): void {

    this.initGetSecureQuestions();
  }



  editSecurity(security: SecurityDto) {
    this.security = { ...security };
    this.qstnSubmitLabel = "Update";
    this.securityDialog = true;
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
    // this.deleteMsg(event);
    this.submitted = true;
    if (this.security.Answer?.trim()) {
      if (this.security.id) {
        if (this.findIndexById(this.security.id) >= 0) {
          this.securityDto[this.findIndexById(this.security.id)] = this.security;
        }
        else {
          this.securityDto.push(this.security);
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
}

