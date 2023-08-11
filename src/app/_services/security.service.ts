import { Injectable } from "@angular/core";
// import { ForgotUserPasswordDto, UserQuestionDto, UserViewDto } from "../_models/security";
import { ApiHttpService } from "./api.http.service";
import { CHANGE_PASSWORD_URI, CREATE_ROLE_URI, CREATE_SECURITY_QUESTIONS_URI, FORGOT_PASSWORD_URI, GET_ROLES_URI, GET_SECURITY_QUESTIONS_URI, GET_USERS_URI,  GET_USER_QUESTIONS_URI, UPDATE_USER_QUESTIONS_URI, } from "./api.uri.service";
import { ChangePasswordDto, CreateUserQuestionDto, ForgotUserPasswordDto, RoleDto, RoleViewDto, SecureQuestionDto, UpdateUserQuestionDto, UserQuestionDto, UserViewDto, } from "../_models/security";

@Injectable({ providedIn: 'root' })

export class SecurityService extends ApiHttpService {
    UpdateRole(value: any): import("rxjs").Observable<import("@angular/common/http").HttpEvent<RoleDto>> {
        throw new Error('Method not implemented.');
    }

    public UserSecurityQuestions(userName: string) {
        return this.getWithParams<UserQuestionDto>(GET_USER_QUESTIONS_URI, [userName]);
    }
    public GetUsers() {
        return this.get<UserViewDto[]>(GET_USERS_URI);
    }

    public ForgotPassword(forgotDto: ForgotUserPasswordDto) {
        return this.post(FORGOT_PASSWORD_URI, forgotDto);
    }

    public GetRoles() {
        return this.get<RoleViewDto[]>(GET_ROLES_URI);
    }
    public CreateRole(roleDto: RoleDto) {
        return this.post<any>(CREATE_ROLE_URI, roleDto);
    }

    public GetSecureQuestions() {
        return this.get<SecureQuestionDto[]>(GET_SECURITY_QUESTIONS_URI);
    }

    public CreateSecurityQuestions(securityQuestions: CreateUserQuestionDto[]) {
        return this.post<CreateUserQuestionDto[]>(CREATE_SECURITY_QUESTIONS_URI, securityQuestions, { responseType: 'text' });
    }

    public ChangePassword(changePasswordDto: ChangePasswordDto) {
        return this.post<ChangePasswordDto>(CHANGE_PASSWORD_URI, changePasswordDto, { responseType: 'text' });
    }

    public  UpdateSecurityQuestions(updateQuestions: UpdateUserQuestionDto[]) {
        return this.post<UpdateUserQuestionDto[]>(UPDATE_USER_QUESTIONS_URI, updateQuestions, { responseType: 'text' });
    }
}
