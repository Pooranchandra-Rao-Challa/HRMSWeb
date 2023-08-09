import { Injectable } from "@angular/core";
// import { ForgotUserPasswordDto, UserQuestionDto, UserViewDto } from "../_models/security";
import { ApiHttpService } from "./api.http.service";
import { FORGOT_PASSWORD_URI, GET_USERS_URI, USER_SECURITY_QUESTIONS_URI } from "./api.uri.service";
import { ForgotUserPasswordDto, UserQuestionDto, UserViewDto } from "../_models/security";

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
}
