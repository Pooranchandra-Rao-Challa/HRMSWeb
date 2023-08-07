import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotUserPasswordDto } from 'src/app/demo/api/security';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styles: [
  ]
})
export class ChangepasswordComponent {

  fbChangePassword!: FormGroup;
  changePassword: ForgotUserPasswordDto = {}

  constructor(private router: Router,
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) { }

  navigateToPrev() {
    this.router.navigate(['auth/forgotpassword/securityquestion'])
  }

  navigateToNext() {
    this.router.navigate(['auth/forgotpassword/successmessage'])

    // if (this.fbChangePassword.valid) {
    //   this.securityService.UpdateForgotPassword(this.fbChangePassword.value).subscribe(resp => {
    //     if (resp as unknown as boolean) {
    //       this.router.navigate(['/forgotpassword/successmessage'])
    //     }
    //   })
    // }
    // else {
    //   this.fbChangePassword.markAllAsTouched();
    // }
  }

  ngOnInit(): void {
    this.changePasswordForm();
    this.fbChangePassword.controls['auth/forgotpassword/userName'].setValue(this.activatedRoute.snapshot.queryParams['username']);
  }

  changePasswordForm() {
    this.fbChangePassword = this.formbuilder.group({
      userName: new FormControl(''),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    }, {
    });
  }

  get FormControls() {
    return this.fbChangePassword.controls;
  }

}
