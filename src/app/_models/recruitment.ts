export class ApplicantDto {
    applicantId?: number;
    name?: string;
    gender?: string;
    emailId?: string;
    mobileNo?: number;
    photo?: string;
    experienceStatus?: string;
    pendingDetails?: string;
    skills?: string;
}
export class ApplicantViewDto {
    applicantId?: number;
    name?: string;
    emailId?: string;
    dob?: string;
    gender?: string;
    isFresher?: string;
    mobileNo?: number;
    photo?: string;
    city?: string;
    state?: string;
    stateId?: number;
    country?: string;
    countryId?: number;
    zipCode?: number;
    landmark?: string;
    resumeUrl?: string;
    applicantCertifications?: applicantCertifications;
    applicantEducationDetails?: applicantEducationDetails;
    applicantLanguageSkills?: applicantLanguageSkills;
    applicantSkills?: applicantSkills;
    applicantWorkExperience?: applicantWorkExperience;
}

export class applicantCertifications {
    applicantId?: number;
    applicantCertificateId?: number;
    certificateId?: number;
    certificateName?: string;
    franchiseName?: string;
    yearOfCompletion?: string;
    results?: string;
}

export class applicantEducationDetails {
    applicantId?: number;
    applicantEducationDetailId?: number;
    StreamId?: number;
    stateId?: number;
    state?: string;
    countryId?: number;
    country?: string;
    institutionName?: string;
    authorityName?: string;
    yearOfCompletion?: Date;
    gradingMethodId?: number;
    gradingMethod?: string;
    gradingValue?: number
}
export class applicantLanguageSkills {
    applicantId?: number;
    applicantLanguageSkillId?: number;
    languageId?: number;
    language?: string;
    canRead?: boolean;
    canSpeak?: boolean;
    canWrite?: boolean;
}

export class applicantSkills {
    applicantId?: number;
    applicantSkillId?: number;
    skillId?: number;
    skill?: string;
    expertise?: number;
}

export class applicantWorkExperience {

}