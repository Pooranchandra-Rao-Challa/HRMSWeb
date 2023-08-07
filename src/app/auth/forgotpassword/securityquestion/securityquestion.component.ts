import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserQuestionDto } from 'src/app/demo/api/security';

@Component({
  selector: 'app-securityquestion',
  templateUrl: './securityquestion.component.html',
  styles: [
  ]
})
export class SecurityquestionComponent {
  userQuestions: UserQuestionDto[] = []
  userName?: string;

  constructor(private router: Router) { }

  navigateToPrev() {
    this.router.navigate(['auth/forgotpassword/username']);
  }

  navigateToNext() {
    this.router.navigate(['auth/forgotpassword/changepassword'])
  }

}



