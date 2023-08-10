import { Injectable } from "@angular/core";
// import { ForgotUserPasswordDto, UserQuestionDto, UserViewDto } from "../_models/security";
import { ApiHttpService } from "./api.http.service";
import { CREATE_ROLE_URI, CREATE_SECURITY_QUESTIONS_URI, FORGOT_PASSWORD_URI, GET_ROLES_URI, GET_SECURITY_QUESTIONS_URI, GET_USERS_URI, USER_SECURITY_QUESTIONS_URI } from "./api.uri.service";
import { CreateUserQuestionDto, ForgotUserPasswordDto, RoleDto, RoleViewDto, SecureQuestionDto, UserQuestionDto, UserViewDto } from "../_models/security";
import { HttpHeaders } from "@angular/common/http";

@Injectable({ providedIn: 'root' })

export class SecurityService extends ApiHttpService {
    UpdateRole(value: any): import("rxjs").Observable<import("@angular/common/http").HttpEvent<RoleDto>> {
        throw new Error('Method not implemented.');
    }

    public UserSecurityQuestions(userName: string) {
        return this.getWithParams<UserQuestionDto>(USER_SECURITY_QUESTIONS_URI, [userName]);
    }
    public GetUsers() {
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": this.jwtService.JWTToken,
        });
        return this.get<UserViewDto[]>(GET_USERS_URI, { headers: headers });
    }

    public ForgotPassword(forgotDto: ForgotUserPasswordDto) {
        return this.post(FORGOT_PASSWORD_URI, forgotDto);
    }


    public GetRoles() {
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": this.jwtService.JWTToken
        });
        return this.get<RoleViewDto[]>(GET_ROLES_URI, { headers: headers });

    }
    public CreateRole(roleDto: RoleDto) {
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": this.jwtService.JWTToken
        });
        return this.post<any>(CREATE_ROLE_URI, roleDto, { headers: headers });
    }

    public GetSecureQuestions() {
        return this.get<SecureQuestionDto[]>(GET_SECURITY_QUESTIONS_URI);
    }

    public CreateSecurityQuestions(securityQuestions: CreateUserQuestionDto[]) {
        return this.post<CreateUserQuestionDto[]>(CREATE_SECURITY_QUESTIONS_URI, securityQuestions);
    }

}
