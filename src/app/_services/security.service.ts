import { Injectable } from "@angular/core";
import { ForgotUserPasswordDto, UserQuestionDto } from "../_models/security";
import { ApiHttpService } from "./api.http.service";
import { FORGOT_PASSWORD_URI, USER_SECURITY_QUESTIONS_URI } from "./api.uri.service";

@Injectable({ providedIn: 'root' })
export class SecurityService extends ApiHttpService {

    public UserSecurityQuestions(userName: string) {
        return this.getWithParams<UserQuestionDto>(USER_SECURITY_QUESTIONS_URI, [userName]);
    }

    public ForgotPassword(forgotDto: ForgotUserPasswordDto) {
        return this.post(FORGOT_PASSWORD_URI, forgotDto);
    }
}
