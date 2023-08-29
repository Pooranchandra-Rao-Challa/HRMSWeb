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
 * Admin : A
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
 * Lookup : L
 * Holiday Configuration : HC
 * Assets : A
 *
 *
 * ---------------------------------------------------------------------------
 * Assets screens
 * Assets : A
 * Assets Allotment : AA
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


    // securityquestions screen
    'SCUQ001': 'Security Questions Added Successfully',

    // settings
    // change password
    'SSECP001': 'Password Updated Successfully',
    'ESECP001': 'Invalid Current Password',

    'SMR001': 'Role Added Successfully',
    'SMR002': 'Role Updated Successfully',

    // updatesecurityquestions
    'SSESQ001': 'Security Questions Updated Successfully',
    'SSESQ002': 'Security Questions Updated Faild',
    'SSESQ003': 'Security Questions Added Successfully',


    'SMU002': 'User Update Successfully',
    'SMU001': "User has been successfully Soft Deleted",
    //LookUps
    'SML001': 'Lookup Added Successfully',
    'SML002': 'Lookup Updated Successfully',

    // Assets
    'AAS001': 'Asset Added Successfully',
    'AAS002': 'Asset Updated Successfully',
    'AAS003': 'Asset Inactivate Successfully',
    'AAS004': 'Asset Save Failed',

    // Asset Allotment
    'SAAAA001': 'Asset Allotment Added Successfully',
    'SAAAA002': 'Assets Allotment Unassigned Successfully',
    'EAAAA001': 'Asset Allotment Save Failed',

    //HOLIDAY
    'SMH001': 'Holiday Added Successfully',
    'SMH002': 'Holiday Updated Successfully',
    'SMH003': 'This date is already a holiday.',
    'SMH004': 'Holiday Soft Deleted Successfully'
}
