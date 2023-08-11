export class UserViewDto {
  userId?: string
  userName?: string
  firstName?: string
  lastName?: string
  email?: string
  mobileNumber?: any
  roleName?: string
  isActive?: boolean
  createdAt?: string
}
export class UserQuestionDto {
  userQuestionId?: number
  userId?: string
  questionId?: number
  question?: string
  answer?: string
  userName?: string;
}

export class RoleViewDto {
  roleId?: string;
  roleName?: string;
  isActive?: boolean;
  createdAt?: string;
}
export class RolePermissionDto {
  permissionId?: string
  label?: string
  screenName?: string
  displayName?: string
  assigned?: boolean = false;
}
export class RoleDto {
  roleId?: string
  Name?: string
  isActive?: boolean

}
export class ForgotUserPasswordDto {
  UserName?: string
  Password?: string
  ConfirmPassword?: string;
  UserQuestions?: UserQuestionDto[]
}

export class SecureQuestionDto {
  questionId?: number;
  question?: string;
}

export class CreateUserQuestionDto {
  userQuestionId?: number;
  userId?: number;
  questionId?: number;
  question?: string;
  answer?: string;
  userName?: string;
}

export class ChangePasswordDto {
    // UserName?: string
    CurrentPassword?: string
    NewPassword?: string
    ConfirmPassword?: string;
}

export class UpdateUserQuestionDto{
  userQuestionId?: number;
  userId? : string;
  questionId?: number;
  answer?: string;
}