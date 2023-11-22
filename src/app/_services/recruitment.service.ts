import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import { GET_VIEW_APPLICANT_DETAILS } from './api.uri.service';

@Injectable({
  providedIn: 'root'
})
export class RecruitmentService extends ApiHttpService {

  public GetviewapplicantDtls(applicantId: number) {
    return this.getWithId<any[]>(GET_VIEW_APPLICANT_DETAILS, [applicantId])
  }

}
