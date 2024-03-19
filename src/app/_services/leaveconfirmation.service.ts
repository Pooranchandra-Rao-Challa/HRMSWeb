import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, take } from 'rxjs';
import Swal from 'sweetalert2';
import { EmployeeLeaveDetailsDto, EmployeeLeaveDetailsViewDto } from '../_models/employes';
import { ApiHttpService } from './api.http.service';
import { GET_EMPLOYEE_MAIL_DETAILS, UPDATE_EMPLOYEE_MAIL_DETAILS } from './api.uri.service';

@Injectable({
  providedIn: 'root',
})

export class LeaveConfirmationService extends ApiHttpService {
  private router: Router;
  private result: Subject<{ confirmed: boolean; username?: string; password?: string; description?: string }> = new Subject<{ confirmed: boolean; username?: string; password?: string; description?: string }>();

  openDialogWithInput(title: string, buttonLabel: string, currentRoute): Observable<{ confirmed: boolean; username?: string; password?: string; description?: string }> {
    Swal.fire({
      title: title,
      html: this.getDialogContent(currentRoute),
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
      didOpen: () => {
        const textarea = document.getElementById('description') as HTMLTextAreaElement;
        if (textarea) {
          textarea.addEventListener('mousedown', (event) => {
            // Check if the mousedown event target is the textarea
            if (textarea) {
              event.preventDefault();
            }
          });
          textarea.addEventListener('mouseenter', () => {
            textarea.focus(); // Focus the textarea when mouse enters
          });
        }
      }
    });

    document.querySelector('.swal-button--confirm')?.addEventListener('click', () => {
      const username = (document.getElementById('username') as HTMLInputElement)?.value || '';
      const password = (document.getElementById('password') as HTMLInputElement)?.value || '';
      const description = (document.getElementById('description') as HTMLTextAreaElement)?.value || '';
      const usernameInput = document.getElementById('username') as HTMLElement;
      const passwordInput = document.getElementById('password') as HTMLElement;
      const descriptionInput = document.getElementById('description') as HTMLElement;

      // Remove previous validation errors
      document.querySelectorAll('.validation-error').forEach(element => element.remove());

      if (currentRoute === this.router) {
        if (username.length === 0) {
          usernameInput.insertAdjacentHTML('afterend', '<div class="validation-error">Please enter your username</div>');
        }

        if (password.length === 0) {
          passwordInput.insertAdjacentHTML('afterend', '<div class="validation-error">Please enter your password</div>');
        }
      }

      if (description.length === 0 || description.length < 8 || description.length > 256) {
        descriptionInput.insertAdjacentHTML('afterend', '<div class="validation-error">Please enter a description between 8 and 256 characters</div>');
      }

      if ((currentRoute === this.router && (username.length === 0 || password.length === 0)) || description.length === 0 || description.length < 8 || description.length > 256) {
        return false; // Prevent form submission
      } else {
        // Clear any existing validation errors
        document.querySelectorAll('.validation-error').forEach(element => element.remove());
        this.result.next({ confirmed: true, username: username, password: password, description: description });
        Swal.close();
        return true;
      }
    });

    document.querySelector('.swal-button--cancel')?.addEventListener('click', () => {
      Swal.close();
    });

    return this.result.asObservable().pipe(take(1));
  }

  private getDialogContent(currentRoute): string {
    if (currentRoute === this.router) {
      return `
      <div class="grid m-0 text-left">
        <div class="col-12 pt-0">
          <label for="username" class="swal2-label required">User Name:</label><br/>
          <input id="username" class="swal2-input w-100 m-0" placeholder="Enter your username">
        </div>
        <div class="col-12 pt-0">
          <label for="password" class="swal2-label required">Password</label><br/>
          <input id="password" type="password" class="swal2-input w-100 m-0" placeholder="Enter your password">
        </div>
        <div class="col-12 pt-0">
          <label for="description" class="swal2-label required">Description:</label><br/>
          <textarea id="description" class="swal2-textarea w-100 m-0" placeholder="Enter description"></textarea>
        </div>
      </div>
    `;
    } else {
      return `
      <div class="grid m-0 text-left">
        <div class="col-12 pt-0">
          <label for="description" class="swal2-label required">Description:</label><br/>
          <textarea id="description" class="swal2-textarea w-100 m-0" placeholder="Enter description"></textarea>
        </div>
      </div>
    `;
    }
  }

  public getEmployeeLeaveDetails(protectedData: string, protectedWith: string) {
    return this.getWithParams<EmployeeLeaveDetailsViewDto[]>(GET_EMPLOYEE_MAIL_DETAILS, [protectedData, protectedWith]);
  }

  public UpdateEmployeeLeaveDetails(employeeLeaveDetails: EmployeeLeaveDetailsDto) {
    return this.post<EmployeeLeaveDetailsDto>(UPDATE_EMPLOYEE_MAIL_DETAILS, employeeLeaveDetails);
  }

}