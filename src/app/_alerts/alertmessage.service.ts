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

/**
 * Please add here more screens info when developer finds new.
 *
 */

/**
 * MessageTypes: Success: S Error: E Waring: W,I: Info,Titles: T
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 * Login forms; L
 * ---------------------------------------------------------------------------
 * Modules;
 * ---------------------------------------------------------------------------
 * Settings : SE
 * Security : S
 *
 * ---------------------------------------------------------------------------
 * Settings Screens
 *
 * Change Password : CP
 * Security Questions : SQ
 *
 * ---------------------------------------------------------------------------
 * Security Screens
 *
 * Users: U
 * Roles: R
 *
 * ---------------------------------------------------------------------------
 * Admin Screens
 *
 *
 * ---------------------------------------------------
 * If the screens has more funcitonal items then
 * Like in settings use frist letter as code, if same
 * code is comming more times then use two letters
 * If two words use to letters
 * ---------------------------------------------------
 * ---------------------------------------------------
 * Errors Number should be three digits like.. 001
 *
 * Example if Messages for Setting screen of providers the Message like M2J001
 * On any change in the above counter should be initialized.
 */

export const ALERT_CODES: { [key: string]: string } = {

  // login
  'HRMS001': 'Your session is closed, so, need to sign in before continuing.',
  'HRMS002': 'Your session is closed.',

  // settings
  // change password
  'SSECP001': 'Password Updated Successfully',
  'ESECP001': 'Invalid Current Password',



}
