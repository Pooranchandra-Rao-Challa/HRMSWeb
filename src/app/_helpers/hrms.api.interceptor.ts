import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../_models/login.model';
import { JwtService } from '../_services/jwt.service';
import { LoaderService } from '../_services/loader.service';
import { LoginService } from '../_services/login.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class HrmsAPIInterceptor implements HttpInterceptor {
    
    constructor(private jwtService: JwtService, private loginService: LoginService, private messageService: MessageService, public loaderService: LoaderService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): any {
        // add auth header with ehr user, if user is logged in and request is to the api url

    const isApiUrl = request.url.startsWith(environment.ApiUrl);
    const currentUser = this.loginService.userValue;
    const isLoggedIn = this.loginService.isLoggedIn();

    if (isLoggedIn && isApiUrl) {
      //this.authenticationService.refreshToken();
      const req = request.clone({
        headers: request.headers.set(TOKEN_HEADER_KEY, currentUser.JwtToken)
      });
      return next.handle(req);
    }

    return next.handle(request)
}
}