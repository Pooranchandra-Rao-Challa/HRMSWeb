import { JwtService } from 'src/app/_services/jwt.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, finalize, map, Observable } from 'rxjs';
import { LoaderService } from '../_services/loader.service';
import { environment } from 'src/environments/environment';

const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class HRMSAPIInterceptor implements HttpInterceptor {
    constructor(private jwtService: JwtService,
        public loaderService: LoaderService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.isLoading.next(true);
        const isApiUrl = request.url.startsWith(environment.ApiUrl);
        const isLoggedIn = this.jwtService.IsLoggedIn;

        //isLogin true block
        if (isLoggedIn && isApiUrl) {
            let authReq = request;
            const token = this.jwtService.JWTToken;
            if (token != null) {
                authReq = this.addTokenHeader(request, token);
            }
            return next.handle(authReq)
                .pipe(
                    finalize(
                        () => {
                            setTimeout(() => {
                                this.loaderService.isLoading.next(false);
                            }, 500);
                        }
                    )
                );
        }
        else if (!isLoggedIn) {
            const url = isApiUrl + "Security/ValidateUserQuestions";
            const url2 = isApiUrl + "Security/ForgotPassword";
            // Check if the request URL is the specific URL you want to skip
            if (request.url === url || request.url === url2) {
                // Skip authentication and move to the next interceptor or backend
                return next.handle(request).pipe(
                    finalize(() => {
                        setTimeout(() => {
                            this.loaderService.isLoading.next(false);
                        }, 500);
                    })
                );

            }
        }
        else this.jwtService.Logout()
        //if not logged in
        return next.handle(request).pipe(
            map(resp => {
                return resp;
            }),
            finalize(
                () => {
                    setTimeout(() => {
                        this.loaderService.isLoading.next(false);
                    }, 500);
                }
            )
        );
    };

    private addTokenHeader(request: HttpRequest<any>, token: string) {
        /* for Spring Boot back-end */
        // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

        /* for Node.js Express back-end */
        return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
    }

}



