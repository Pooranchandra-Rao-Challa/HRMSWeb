import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AlertmessageService {

  constructor(private service: MessageService) { }

  displayAlertMessage(message: string) {
    this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail: message, life: 5000 });
  }

  displayErrorMessage(message: string) {
    this.service.add({ key: 'tst', severity: 'error', summary: 'Error Message', detail: message, life: 5000 });
  }

}

export const ALERT_CODES: { [key: string]: string } = {

  // login
  'HRMS001': 'Your session is closed, so, need to sign in before continuing.',
  'HRMS002': 'Your session is auto closed.',

}