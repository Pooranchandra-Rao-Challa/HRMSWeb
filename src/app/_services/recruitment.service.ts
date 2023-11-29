import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import {CREATE_VIEW_APPLICANT_CERTIFICATION_DETAILS, CREATE_VIEW_APPLICANT_LANGUAGE_SKILL, CREATE_VIEW_APPLICANT_TECHNICAL_SKILL, Get_Applicants_with_Id, GET_APPLICANT_TECHNICAL_SKILL, GET_JOB_OPENINGS_DROPDOWN, UPDATE_APPLICANT, UPDATE_VIEW_APPLICANT_CERTIFICATION_DETAILS, UPDATE_VIEW_APPLICANT_LANGUAGE_SKILL, UPDATE_VIEW_APPLICANT_TECHNICAL_SKILL } from './api.uri.service';
import { CREATE_APPLICANT_DETAILS, CREATE_VIEW_APPLICANT_EDUCATION_DETAILS, CREATE_VIEW_APPLICANT_EXPERIENCE_DETAILS, GET_APPLICANT_DETAILS, GET_VIEW_APPLICANT_DETAILS, UPDATE_VIEW_APPLICANT_EDUCATION_DETAILS, UPDATE_VIEW_APPLICANT_EXPERIENCE_DETAILS } from './api.uri.service';
import { ApplicantCertificationDto, ApplicantDto, ApplicantEducationDetailsDto, ApplicantLanguageSkillDto, ApplicantSkillDto, ApplicantSkillViewDto, ApplicantViewDto, ApplicantWorkExperienceDto, JobOpeningsListDto, ViewApplicantDto } from '../_models/recruitment';


@Injectable({
  providedIn: 'root'
})
export class RecruitmentService extends ApiHttpService {

  public GetviewapplicantDtls(applicantId: number) {
    return this.getWithId<ViewApplicantDto[]>(GET_VIEW_APPLICANT_DETAILS, [applicantId])
  }
  public getApplicantsForInitialRound(id:number){
    return this.getWithId<ApplicantViewDto[]>(Get_Applicants_with_Id,id);
  }
  public UpdateApplicantStatus(data:any){
    return this.post(UPDATE_APPLICANT,data)
  }
  public GetApplicantDetail() {
    return this.get<ApplicantViewDto[]>(GET_APPLICANT_DETAILS);
  }
  public getJobOpeningDropdown(){
    return this.get<JobOpeningsListDto[]>(GET_JOB_OPENINGS_DROPDOWN);
  }
  public CreateApplicant(applicantDetails: ApplicantDto[]) {
    return this.post<ApplicantDto[]>(CREATE_APPLICANT_DETAILS, applicantDetails)
  }

  public CreateApplicantEducationDetails(educationDetails: ApplicantEducationDetailsDto[]) {
    return this.post<ApplicantEducationDetailsDto[]>(CREATE_VIEW_APPLICANT_EDUCATION_DETAILS, educationDetails)
  }

  public UpdateApplicantEducationDetails(educationDetails: ApplicantEducationDetailsDto[]) {
    return this.post<ApplicantEducationDetailsDto[]>(UPDATE_VIEW_APPLICANT_EDUCATION_DETAILS, educationDetails)
  }

 public CreateApplicantexperienceDetails(experienceDetails: ApplicantWorkExperienceDto[]) {
    return this.post<ApplicantWorkExperienceDto[]>(CREATE_VIEW_APPLICANT_EXPERIENCE_DETAILS, experienceDetails)
  }
  public UpdateApplicantexperienceDetails(experienceDetails: ApplicantWorkExperienceDto[]) {
    return this.post<ApplicantWorkExperienceDto[]>(UPDATE_VIEW_APPLICANT_EXPERIENCE_DETAILS, experienceDetails)
  }

  public CreateApplicantCertificationDetails(certificationDetails: ApplicantCertificationDto[]) {
    return this.post<ApplicantCertificationDto[]>(CREATE_VIEW_APPLICANT_CERTIFICATION_DETAILS, certificationDetails)
  }
  public UpdateApplicantCertificationDetails(certificationDetails: ApplicantCertificationDto[]) {
    return this.post<ApplicantCertificationDto[]>(UPDATE_VIEW_APPLICANT_CERTIFICATION_DETAILS, certificationDetails)
  }

  public CreateApplicantLanguageSkill(languageSkill: ApplicantLanguageSkillDto[]) {
    return this.post<ApplicantLanguageSkillDto[]>(CREATE_VIEW_APPLICANT_LANGUAGE_SKILL, languageSkill)
  }
  public UpdateApplicantLanguageSkill(languageSkill: ApplicantLanguageSkillDto[]) {
    return this.post<ApplicantLanguageSkillDto[]>(UPDATE_VIEW_APPLICANT_LANGUAGE_SKILL, languageSkill)
  }
  public GetTechnicalSkill(applicantId: number) {
    return this.getWithId<ApplicantSkillViewDto[]>(GET_APPLICANT_TECHNICAL_SKILL, [applicantId])
  }
  public CreateApplicantTechnicalSkill(TechnicalSkill: ApplicantSkillDto[]) {
    return this.post<ApplicantSkillDto[]>(CREATE_VIEW_APPLICANT_TECHNICAL_SKILL, TechnicalSkill)
  }
  public UpdateApplicantTechnicalSkill(TechnicalSkill: ApplicantSkillDto[]) {
    return this.post<ApplicantSkillDto[]>(UPDATE_VIEW_APPLICANT_TECHNICAL_SKILL, TechnicalSkill)
  }
}
