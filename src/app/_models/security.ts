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
