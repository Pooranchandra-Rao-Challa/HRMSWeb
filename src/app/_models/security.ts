export class UserViewDto {
  userId?: string
  userName?: string
  firstName?: string
  lastName?: string
  email?: string
  mobileNumber?: any
  roleName?: string
  roleId?:any
  isActive?: boolean
  createdAt?: string
}
export class UserQuestionDto {
  userQuestionId?: number
  userId?: string
  questionId?: number
  question?: string
  answer?: string
  userAnswer?: string
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
  roleName?: string
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
export class UserUpdateDto {
  userId?: string
  roleId?: string
  firstName?: string
  password?: string
  lastName?: string
  userName?: string
  email?: string
  mobileNumber?: string
  isActive?: boolean
  createdAt: string
  }