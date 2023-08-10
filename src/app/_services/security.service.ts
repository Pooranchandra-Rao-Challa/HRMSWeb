import { Injectable } from "@angular/core";
// import { ForgotUserPasswordDto, UserQuestionDto, UserViewDto } from "../_models/security";
import { ApiHttpService } from "./api.http.service";
import { CHANGE_PASSWORD_URI, CREATE_SECURITY_QUESTIONS_URI, FORGOT_PASSWORD_URI, GET_SECURITY_QUESTIONS_URI, GET_USERS_URI, USER_SECURITY_QUESTIONS_URI } from "./api.uri.service";
import { ChangePasswordDto, CreateUserQuestionDto, ForgotUserPasswordDto, SecureQuestionDto, UserQuestionDto, UserViewDto } from "../_models/security";
import { HttpHeaders } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class SecurityService extends ApiHttpService {

    public UserSecurityQuestions(userName: string) {
        return this.getWithParams<UserQuestionDto>(USER_SECURITY_QUESTIONS_URI, [userName]);
    }

    public GetUsers() {
        return this.get<UserViewDto[]>(GET_USERS_URI);
    }

    public ForgotPassword(forgotDto: ForgotUserPasswordDto) {
        return this.post(FORGOT_PASSWORD_URI, forgotDto);
    }


    public GetSecureQuestions() {
        return this.get<SecureQuestionDto[]>(GET_SECURITY_QUESTIONS_URI);
    }

    public CreateSecurityQuestions(securityQuestions: CreateUserQuestionDto[]) {
        return this.post<CreateUserQuestionDto[]>(CREATE_SECURITY_QUESTIONS_URI, securityQuestions);
    }

    public ChangePassword(changePasswordDto: ChangePasswordDto) {
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": this.jwtService.JWTToken,
        });
        return this.post<ChangePasswordDto>(CHANGE_PASSWORD_URI, changePasswordDto, { headers: headers, responseType: 'text' });
    }

}
