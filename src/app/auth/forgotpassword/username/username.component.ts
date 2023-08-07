import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styles: [
  ]
})
export class UsernameComponent {
  userName?: string;

  constructor(private router: Router) { }

  navigateToNext() {
    this.router.navigate(['auth/forgotpassword/securityquestion'])
  }
}
