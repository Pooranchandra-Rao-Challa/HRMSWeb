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
    userAnswer?: string
    userName?: string;
}

export class ForgotUserPasswordDto {
    UserName?: string
    Password?: string
    ConfirmPassword?: string;
    UserQuestions?: UserQuestionDto[]
}
  