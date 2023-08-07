import { Injectable } from '@angular/core';
import { ResponseModel } from '../_models/login.model';
import jwt_decode from 'jwt-decode';


const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  private get DecodedJWT(): any {
    if (this.JWTToken != "")
      return jwt_decode(this.JWTToken);
  }

  public get JWTToken(): string {
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  public get RefreshToken(): string {
    return localStorage.getItem(REFRESHTOKEN_KEY) || "";
  }

  public get HasQuestions(): boolean {
    const jwt = this.DecodedJWT;
    if (!jwt || jwt == "") return false;
    return jwt.SecureQuestions > 0;
  }

  public get IsFirstTimeLogin(): boolean {
    const jwt = this.DecodedJWT;
    if (!jwt || jwt == "") return false;
    return jwt.IsFirstTimeLogin > 0;
  }
  public SaveToken(tokens: ResponseModel) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.setItem(TOKEN_KEY, tokens.accessToken || "")
    this.saveRefreshToken(tokens);
  }

  public saveRefreshToken(tokens: ResponseModel) {
    localStorage.removeItem(REFRESHTOKEN_KEY)
    localStorage.setItem(REFRESHTOKEN_KEY, tokens.refreshToken || "")
  }
  public get ThemeName(): string {
    const jwt = this.DecodedJWT;
    return jwt.ThemeName;
  }
}

