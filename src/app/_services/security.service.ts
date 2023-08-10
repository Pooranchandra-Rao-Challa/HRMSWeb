import { Injectable } from "@angular/core";
// import { ForgotUserPasswordDto, UserQuestionDto, UserViewDto } from "../_models/security";
import { ApiHttpService } from "./api.http.service";
import { FORGOT_PASSWORD_URI, GET_ROLES_URI, GET_USERS_URI, USER_SECURITY_QUESTIONS_URI } from "./api.uri.service";
import { ForgotUserPasswordDto, RoleViewDto, UserQuestionDto, UserViewDto } from "../_models/security";
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
   
   
    public GetRoles() {
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": this.jwtService.JWTToken
        });
        return this.get<RoleViewDto[]>(GET_ROLES_URI,{ headers: headers });
    }

}
