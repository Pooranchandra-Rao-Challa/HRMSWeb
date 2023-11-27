import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import { CREATE_APPLICANT_DETAILS, CREATE_VIEW_APPLICANT_EDUCATION_DETAILS, CREATE_VIEW_APPLICANT_EXPERIENCE_DETAILS, GET_APPLICANT_DETAILS, GET_VIEW_APPLICANT_DETAILS, UPDATE_VIEW_APPLICANT_EDUCATION_DETAILS, UPDATE_VIEW_APPLICANT_EXPERIENCE_DETAILS } from './api.uri.service';
import { ApplicantDto, ApplicantEducationDetailsDto, ApplicantViewDto, ApplicantWorkExperienceDto, ViewApplicantDto } from '../_models/recruitment';

@Injectable({
  providedIn: 'root'
})
export class RecruitmentService extends ApiHttpService {

  public GetviewapplicantDtls(applicantId: number) {
    return this.getWithId<ViewApplicantDto[]>(GET_VIEW_APPLICANT_DETAILS, [applicantId])
  }
  public GetApplicantDetail() {
    return this.get<ApplicantViewDto[]>(GET_APPLICANT_DETAILS);
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
}
