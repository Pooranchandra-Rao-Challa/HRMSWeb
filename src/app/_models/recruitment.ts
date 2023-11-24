export class ApplicantViewDto{
    applicantId?:number;
    name?:string;
    gender?:string;
    emailId?:string;
    mobileNo ?:number;
    photo?:string;
    experienceStatus ?:string;
    pendingDetails ?:string;
    skills?:string;
}

export class ApplicantDto{
    applicantId?: number;
    name?:string;
    dob?:Date;
    gender?:string;
    emailId?:string;
    mobileNo?: number;
    nationalityId?: number;
    photo?:string;
    addressLine1 ?:string;
    addressLine2?:string;
    landmark?:string;
    zipcode ?:string;
    city?:string;
    countryId?:string;
    stateId ?: number;
    resumeUrl?:string;
    isFresher?:boolean;
    applicantCertifications?:ApplicantCertificationDto[];
    applicantEducationDetails?:ApplicantEducationDetailDto[];
    applicantLanguageSkills?:ApplicantLanguageSkillDto[];
    applicantSkills ?:ApplicantSkillDto[];
    applicantWorkExperiences?:ApplicantWorkExperienceDto[];
}

export class ApplicantCertificationDto{
    applicantCertificateId?:number;
    applicantId?:number;
    certificateId?:number;
    franchiseName?:number;
    yearOfCompletion?:string;
    results?:string;
}

export class ApplicantEducationDetailDto{
    applicantEducationId ?:number;
    applicantId?:number;
    streamId?:number;
    stateId ?:number;
    institutionName?:string;
    authorityName ?:string;
    yearOfCompletion?:Date;
    gradingMethodId?:number;
    gradingValue?:string;
}

export class ApplicantLanguageSkillDto{
    applicantLanguageSkillId?:number;
    applicantId?:number;
    languageId?:number;
    canRead ?:boolean;
    canWrite?:boolean;
    canSpeak?:boolean;
}

export class ApplicantSkillDto{
    applicantSkillId?:number;
    applicantId?:number;
    skillId?:number;
    expertise?:number;
}

export class ApplicantWorkExperienceDto{
    applicantWorkExperienceId?:number;
    applicantId ?:number;
    companyName?:string;
    companyLocation?:string
    stateId ?:number;
    companyEmployeeId?:string;
    designationId ?:number;
    natureOfWork?:string;
    workedOnProjects?:string;
    dateOfJoining?:Date;
    dateOfReliving ?:Date;
}