import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import { GET_APPLICANT_DETAILS, GET_VIEW_APPLICANT_DETAILS } from './api.uri.service';
import { ApplicantDto, ApplicantViewDto, ViewApplicantDto } from '../_models/recruitment';

@Injectable({
  providedIn: 'root'
})
export class RecruitmentService extends ApiHttpService {

  public GetviewapplicantDtls(applicantId: number) {
    return this.getWithId<ViewApplicantDto[]>(GET_VIEW_APPLICANT_DETAILS, [applicantId])
  }
  public GetApplicantDetail(){
    return this.get<ApplicantViewDto[]>(GET_APPLICANT_DETAILS);
  }
}
