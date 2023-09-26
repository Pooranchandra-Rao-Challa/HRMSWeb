import { Injectable } from '@angular/core';
import { ResponseModel } from '../_models/login.model';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';


const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const LOOKUP_KEYS = 'lookupkeys';
@Injectable({
    providedIn: 'root'
})
export class JwtService {

    constructor(private router: Router,) { }

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
        return jwt.IsFirstTimeLogin === true;
    }
    public SaveToken(tokens: ResponseModel) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.setItem(TOKEN_KEY, tokens.accessToken)
        this.saveRefreshToken(tokens);
    }
    public get IsLoggedIn(): boolean {
        return this.DecodedJWT != undefined;
    }
    public get Permissions(): any {
        const jwt = this.DecodedJWT;
        if (!jwt || jwt == "") return {};
        return JSON.parse(jwt.Permissions)
    }
    public Logout() {
        //localStorage.removeItem("respModel");
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESHTOKEN_KEY);
        localStorage.clear();
        this.router.navigate(["/"]);
    }
    public saveRefreshToken(tokens: ResponseModel) {
        localStorage.removeItem(REFRESHTOKEN_KEY)
        localStorage.setItem(REFRESHTOKEN_KEY, tokens.refreshToken)
    }

    public addLookupKeys(keys: {},forceLocal:boolean = false) {
        if ((keys && !this.HasLookupKey) || forceLocal) {
            localStorage.setItem(LOOKUP_KEYS, JSON.stringify(keys))
        }
    }

    public get LookupKeys() {
        console.log(JSON.parse(localStorage.getItem(LOOKUP_KEYS)).Lookups);

        if (this.HasLookupKey)
            return JSON.parse(localStorage.getItem(LOOKUP_KEYS)).Lookups;
        else return {}
    }

    public get HasLookupKey(): boolean {
        return localStorage.getItem(LOOKUP_KEYS) != null && localStorage.getItem(LOOKUP_KEYS) != '';
    }

    public clearLookupKeys() {
        localStorage.removeItem(LOOKUP_KEYS)
    }
    public get ThemeName(): string {
        const jwt = this.DecodedJWT;
        return jwt.ThemeName;
    }

    public get GivenName(): string {
        const jwt = this.DecodedJWT;
        return jwt.GivenName;
    }

    public get UserId(): string {
        const jwt = this.DecodedJWT;
        return jwt.Id;
    }

    // public get UserPhoto(): string {
    //     const jwt = this.DecodedJWT;
    //     return jwt.Photo;
    // }
}

