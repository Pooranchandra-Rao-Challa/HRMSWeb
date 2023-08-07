import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { URI_ENDPOINT, URI_ENDPOINT_WITH_ID, URI_ENDPOINT_WITH_PARAMS } from 'src/environments/environment';
import { ResponseModel } from '../_models/login.model';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ApiHttpService {

  constructor(private http: HttpClient,
    private jwtService: JwtService ){}
  
  public get<T>(uri: string, options?: any) {
    return this.http.get<T>(URI_ENDPOINT(uri), options)
      .pipe(
        catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }
          // Add Redirect to default page
          return throwError(() => errorMsg);
        })
      );
  }


  public getWithId<T>(uri: string,id: any, options?: any) {
    console.log(URI_ENDPOINT_WITH_ID(uri,id));

    return this.http.get<T>(URI_ENDPOINT_WITH_ID(uri,id), options)
      .pipe(
        catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }
          // Add Redirect to default page
          return throwError(() => errorMsg);
        })
      );
  }
  public post<T>(uri: string, data: any, options?: any) {
    return this.http.post<T>(URI_ENDPOINT(uri), data, options)
      .pipe(
        catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }
          // this.router.navigate(["error"])// Add Redirect to default page
          return throwError(() => errorMsg);
        })
      );
  }

  public getWithParams<T>(uri: string,params:any[], options?: any) {
    console.log(URI_ENDPOINT_WITH_PARAMS(uri,params));

    return this.http.get<T>(URI_ENDPOINT_WITH_PARAMS(uri,params), options)
      .pipe(
        catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }
          // Add Redirect to default page
          return throwError(() => errorMsg);
        })
      );
  }

  public put<T>(uri: string, data: any, options?: any) {
    return this.http.put(URI_ENDPOINT(uri), data, options);
  }
  public delete(uri: string, options?: any) {
    return this.http.delete(URI_ENDPOINT(uri), options);
  }
  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404: {
        return `Not Found: ${error.message}`;
      }
      case 403: {
        return `Access Denied: ${error.message}`;
      }
      case 500: {
        return `Internal Server Error: ${error.message}`;
      }
      default: {
        return `Unknown Server Error: ${error.message}`;
      }

    }
  }
  saveToken(token: ResponseModel){
    this.jwtService.SaveToken(token);
  }
  get IsFirstTimeLogin(): boolean{
    return this.jwtService.IsFirstTimeLogin;
  }
  get HasQuestions(): boolean{
    return this.jwtService.HasQuestions;
  }
}
