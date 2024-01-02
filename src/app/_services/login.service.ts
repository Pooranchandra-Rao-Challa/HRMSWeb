import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, } from 'rxjs';
import { LoginModel, ResponseModel } from '../_models/login.model';
import { ApiHttpService } from './api.http.service';
import { LOGIN_URI, REFRESH_TOKEN_URI, REVOKE_TOKEN_URI } from './api.uri.service';
import Swal from 'sweetalert2'
import { ALERT_CODES } from '../_alerts/alertmessage.service';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import jwtdecode from 'jwt-decode'

export class LogInSuccessModel {
    isFirstTimeLogin: boolean = false;
    isLoginSuccess: boolean = false;
    hasSecureQuestions: boolean = false;
}
@Injectable({
    providedIn: 'root'
})
export class LoginService extends ApiHttpService {
    ApiUrl: string = environment.ApiUrl;
    private refreshTokenTimer;

    public Authenticate(data: LoginModel): Observable<LogInSuccessModel> {
        return this.post<ResponseModel>(LOGIN_URI, data).pipe(
            switchMap(resp => {
                this.saveToken((resp as ResponseModel))
                this.UpdateLookups(true);
                const model: LogInSuccessModel = {
                    isFirstTimeLogin: this.IsFirstTimeLogin,
                    isLoginSuccess: true,
                    hasSecureQuestions: this.HasQuestions
                }
                return of<LogInSuccessModel>(model)
            })
        )
    }

    refreshToken() {
        this.getWithParams<any>(REFRESH_TOKEN_URI, [encodeURIComponent(this.jwtService.RefreshToken)])
            .subscribe((resp) => {
                if (resp) {
                    const u = resp as any;
                    const tokens = {
                        accessToken: u.accessToken,
                        refreshToken: u.refreshToken
                    }
                    this.jwtService.SaveToken(tokens);
                    this.startRefreshTokenTimer();
                }
            })
    }

    // resetSessionMonitor;
    openRefeshDialog() {
        let timerInterval
        Swal.fire({
            title: 'Do you want extend the session?',
            html: 'Session will close in <b></b> seconds.',
            // showDenyButton: true,
            showCancelButton: false,
            confirmButtonColor: '#FF810E',
            confirmButtonText: 'Refresh Session',
            denyButtonText: `Revoke Session`,
            timer: 60000,
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(Swal.getDenyButton())
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Math.floor(Swal.getTimerLeft() / 2000) + ''
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval);
            },
            customClass: {
                container: '.swal2-container',
                popup: 'swal-background',
            }
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                clearInterval(timerInterval);
                this.refreshToken();
            } else
                if (result.dismiss === Swal.DismissReason.timer) {
                    this.revokeToken(ALERT_CODES["HRMS002"]);
                }
        })
    }

    revokeToken(error: any = '') {
        if (!this.jwtService.JWTToken) {
            this.stopRefreshTokenTimer();
            return;
        }
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": this.jwtService.JWTToken
        });
        this.getWithParams<any>(REVOKE_TOKEN_URI, [encodeURIComponent(this.jwtService.RefreshToken)], { headers: headers })
            .subscribe({
                next: (resp) => {
                    this.stopRefreshTokenTimer();
                    if (error != '' && error != null)
                        localStorage.setItem('message', error);
                    this.jwtService.Logout();
                },
                error: (error1) => {
                    this.stopRefreshTokenTimer();
                    //   localStorage.removeItem('user');
                    if (error != '' && error != null)
                        localStorage.setItem('message', JSON.stringify(error.message));
                    this.jwtService.Logout();
                },
                complete: () => {
                }
            }
            );
    }

    isLoggedIn() {
        if (!this.jwtService.JWTToken) return false;
        const jwtToken = this.jwtService.JWTToken as unknown as any;
        const exp = new Date(jwtToken.exp * 1000);
        const iat = new Date(jwtToken.iat);
        const nbf = new Date(jwtToken.nbf);
        // exp.setSeconds(0);
        iat.setSeconds(0);
        nbf.setSeconds(0);
        const today = new Date();
        const flag = today >= nbf && today >= iat && today <= exp;
        return flag
    }

    public startRefreshTokenTimer() {
        const jwtToken = jwtdecode(this.jwtService.JWTToken) as unknown as any;
        const expires = new Date(jwtToken.exp * 1000);
        console.log(`Session Timeout:  ${expires}`)
        const timeout = expires.getTime() - (new Date()).getTime() - 60000;
        console.log(`timeout ${timeout}`);

        if (this.refreshTokenTimer) this.clearTimer();
        this.refreshTokenTimer = setTimeout(() => this.openRefeshDialog(), timeout);
    }

    public clearTimer() {
        clearTimeout(this.refreshTokenTimer);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimer);
    }

}


