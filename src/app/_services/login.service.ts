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
    private respSubject?: BehaviorSubject<ResponseModel>;
    ApiUrl: string = environment.ApiUrl;
    private userSubject: BehaviorSubject<any>;
    public user: Observable<any>;
    private refreshTokenTimer;

    public get userValue(): any {
        if (this.userSubject != undefined)
            return this.userSubject.getValue();
        else return undefined;
    }

    public Authenticate(data: LoginModel): Observable<LogInSuccessModel> {
        return this.post<ResponseModel>(LOGIN_URI, data).pipe(
            switchMap(resp => {
                this.saveToken((resp as ResponseModel))
                localStorage.setItem("respModel", JSON.stringify(resp as ResponseModel))
                this.respSubject = new BehaviorSubject<ResponseModel>(resp as ResponseModel);
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
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": this.jwtService.JWTToken
        });
        this.getWithParams<any>(REFRESH_TOKEN_URI, [encodeURIComponent(this.jwtService.RefreshToken)], { headers: headers })
            .subscribe((resp) => {
                if (resp) {
                    const u = resp as any;
                    const tokens = {
                        accessToken: u.accessToken,
                        refreshToken: u.refreshToken
                    }
                    this.jwtService.SaveToken(tokens);
                    //   this.userSubject = new BehaviorSubject<any>(this.userValue);
                    //   localStorage.setItem('user', JSON.stringify(this.userValue));
                    this.startRefreshTokenTimer();
                }
            })
    }

    // resetSessionMonitor;
    openRefeshDialog() {
        let timerInterval
        this.UserIp().subscribe(resp => {
            Swal.fire({
                title: 'Do you want extend the session?',
                html: 'Session will close in <b></b> seconds.',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Refresh Session',
                denyButtonText: `Revoke Session`,
                timer: 60000,
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading(Swal.getDenyButton())
                    const b = Swal.getHtmlContainer().querySelector('b')
                    timerInterval = setInterval(() => {
                        b.textContent = Math.floor(Swal.getTimerLeft() / 1000) + ''
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval);
                },
                customClass: {
                    confirmButton: 'confirm-refresh-session',
                    container: 'swal2-container-high-zindex',
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
        });
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

    logout(error: any = '') {
        this.revokeToken(error);
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
        console.log('Session Timeout: ' + expires)
        const timeout = expires.getTime() - (new Date()).getTime() - 60000;
        if (this.refreshTokenTimer) this.clearTimer();
        this.refreshTokenTimer = setTimeout(() => this.openRefeshDialog(), timeout);
        // this.isLoggedIn();
    }

    public clearTimer() {
        clearTimeout(this.refreshTokenTimer);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimer);
    }

}


