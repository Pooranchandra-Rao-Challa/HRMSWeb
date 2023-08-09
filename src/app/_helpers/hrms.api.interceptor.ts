import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, catchError, filter, finalize, map, Observable, switchMap, take, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../_models/login.model';
import { JwtService } from '../_services/jwt.service';
import { LoaderService } from '../_services/loader.service';
import { LoginService } from '../_services/login.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class HrmsAPIInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private jwtService: JwtService, private loginService: LoginService, private messageService: MessageService, public loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    debugger
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

    return next.handle(request);
  }


}