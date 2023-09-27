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
    //Roles
    'SMR001': 'Role Added Successfully',
    'SMR002': 'Role Updated Successfully',

    // updatesecurityquestions
    'SSESQ001': 'Security Questions Updated Successfully',
    'SSESQ002': 'Security Questions Updated Faild',
    'SSESQ003': 'Security Questions Added Successfully',

    //Projects
    'PAS001': 'Project Added Successfully',
    'PAS002': 'Project Updated Successfully',
    'SMEUA001': 'Employee Unassigned Successfully',
    //Users
    'SMU002': 'User Updated Successfully',
    'SMU001': "User Has Been Successfully Soft Deleted",
    //LookUps
    'SML001': 'Lookup Added Successfully',
    'SML002': 'Lookup Updated Successfully',

    // Assets
    'AAS001': 'Asset Added Successfully',
    'AAS002': 'Asset Updated Successfully',
    'AAS003': 'Asset In Activate Successfully',
    'AAS004': 'Asset Save Failed',

    // Asset Allotment
    'SAAAA001': 'Asset Allotment Added Successfully',
    'SAAAA002': 'Assets Allotment Unassigned Successfully',
    'EAAAA001': 'Asset Allotment Save Failed',
    'EAAAA002': 'Assets Allotment Unassigned Failed',

    //HOLIDAY
    'SMH001': 'Holiday Added Successfully',
    'SMH002': 'Holiday Updated Successfully',
    'SMH003': 'Selected Date is Already Exist',
    'SMH004': 'Holiday Soft Deleted Successfully',
    'SMH005': 'The selected from Date already Added in List.',

    //Basic Details
    'SBD001': 'Basic Details Added Successfully',
    'SBD002': 'Basic Details Updated Successfully',
    //Educaiton Details 
    'SEDU001': 'Education Details Added Successfully',
    'SEDU002':'Education Details Updated Successfully',
    //Family Details 
    'SFD001': 'Family Details Added Successfully',
    'SFD002': 'Family Details Updated Successfully',
    //Bank Details
    'SBDS001': 'Bank Details Added Successfully',
    //Address Details
    'SAD001': 'Address Details Added Successfully',
    'SAD002': 'Address Details Not Added',
    'SAP001':'Permanent address already Existed',
    'SAC001': 'Current address already Existed',
    'SMAD004': 'Address Details Update Successfully',
    'SMAD005': 'Employee already has a Permanent Address',
    'SMAD006': 'Employee already has three types of addresses. Please edit an existing address.',

   
  

    //uploadDocuments
    'EAD001':'More than 5 Files not Accepted',
    'EAD002':'Upload documents Added Successfully',
    'EAD003':'Upload documents Not Added',
    //Enroll Employee

    'SEE001': 'Employee Enrolled Successfully',
    'SEE002': 'Employee Not Enrolled',
    //Experience Details
    'SED001': 'Experience Details Added Successfully',
    'SED002': 'Experience Details Not Added',
    // View Employee Basic Details
    'EVEBD001': 'Basic Details Updated Successfully',
    'EVEBD002': 'Basic Details Updated Faild',

    // View Employee Office Details
    'EVEOFF001': 'Office Details Updated Successfully',
    'EVEOFF002': 'Office Details Added Successfully',
    'EVEOFF003': 'Office Details Updated Faild',

    // View Employee Experience Details
    'EVEEXP001': 'Experience Details Submitted Successfully',
    'EVEEXP002': 'Experience Details Faild',

  // View Employee Education Details
    'EVEEDU001': 'Education Details Submitted Successfully',
    'EVEEDU002': 'Education Details Faild',

    //Bank Details
    'SMBD001': 'Bank Details Added Successfully',
    'SMBD002': 'Bank Details Update Successfully',
    //Family Details
    'SMFD001': 'Family Details Added Successfully',
    'SMFD002': 'Family Details Update Successfully'



}

