import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import Swal from 'sweetalert2';
import { EmployeeLeaveDetailsDto, EmployeeLeaveDetailsViewDto } from '../_models/employes';
import { ApiHttpService } from './api.http.service';
import { GET_EMPLOYEE_MAIL_DETAILS, UPDATE_EMPLOYEE_MAIL_DETAILS } from './api.uri.service';

@Injectable({
  providedIn: 'root',
})

export class LeaveConfirmationService extends ApiHttpService {

  private result: Subject<{ confirmed: boolean; description?: string }> = new Subject<{ confirmed: boolean; description?: string }>();

  openDialogWithInput(title: string, buttonLabel: string): Observable<{ confirmed: boolean; description?: string }> {
    Swal.fire({
      title: title,
      html: `
        <textarea inputId="textarea" pInputTextarea rows="4" cols="30"
       [maxlength]="256" id="textarea" placeholder="Enter Description"></textarea>
      `,
      showCancelButton: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      confirmButtonText: buttonLabel,
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const textareaValue = (document.getElementById('textarea') as HTMLTextAreaElement).value;
        this.result.next({ confirmed: true, description: textareaValue });
      } else {
        this.result.next({ confirmed: false });
      }
    });
    return this.result.asObservable().pipe(take(1));
  }

  public getEmployeeLeaveDetails(protectedData: string, protectedWith: string) {
    return this.getWithParams<EmployeeLeaveDetailsViewDto[]>(GET_EMPLOYEE_MAIL_DETAILS, [protectedData, protectedWith]);
  }

  public UpdateEmployeeLeaveDetails(employeeLeaveDetails: EmployeeLeaveDetailsDto) {
    return this.post<EmployeeLeaveDetailsDto>(UPDATE_EMPLOYEE_MAIL_DETAILS, employeeLeaveDetails);
  }

}