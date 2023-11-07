import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiHttpService } from './api.http.service';
import {  GET_MAIL_EMPLOYEE_DETAILS } from './api.uri.service';

@Injectable({
  providedIn: 'root',
})

export class LeaveConfirmationService extends ApiHttpService{

  private result: Subject<{ confirmed: boolean; description?: string }> = new Subject<{ confirmed: boolean; description?: string }>();

  openDialogWithInput(title: string): Observable<{ confirmed: boolean; description?: string }> {
    Swal.fire({
      title: title,
      html: `
        <textarea inputId="textarea" pInputTextarea rows="4" cols="30"
       [maxlength]="256" id="textarea" placeholder="Enter Description"></textarea>
      `,
      showCancelButton: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Submit',
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

  public getEmployeeLeaveDetails() {
    // const params = new HttpParams()
    // .set('encryptedData')
    // .set('key2');
    return this.getWithParams<any[]>(GET_MAIL_EMPLOYEE_DETAILS,null)
  }

}