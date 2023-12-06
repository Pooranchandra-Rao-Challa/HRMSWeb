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
      input: 'textarea',
      inputPlaceholder: 'Enter Description',
      footer: `
        <div>
          <button class="swal-button swal-button--confirm">${buttonLabel}</button>
          <button class="swal-button swal-button--cancel">Cancel</button>
        </div>
      `,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        title: 'swal_title',
        footer: 'swal-footer',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const textareaValue = result.value as string;
        this.result.next({ confirmed: true, description: textareaValue });
      } else {
        this.result.next({ confirmed: false });
      }
    });

    document.querySelector('.swal-button--confirm')?.addEventListener('click', () => {
      const result = Swal.getPopup().querySelector('textarea');
      const textareaValue = result ? result.value.trim() : '';
      if (textareaValue === '') {
        // Swal.showValidationMessage('Please Enter Description');
        return true;
      }
      if (textareaValue.length < 8) {
        Swal.showValidationMessage('Please Enter Description Minimum 8 Charecters');
        return false;
      } else if (textareaValue.length > 256) {
        Swal.showValidationMessage('Please Enter Description Maximum 256 Charecters');
        return false;
      } else {
        this.result.next({ confirmed: true, description: textareaValue });
        Swal.close();
        return true;
      }
    });
    document.querySelector('.swal-button--cancel')?.addEventListener('click', () => {
      Swal.close();
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