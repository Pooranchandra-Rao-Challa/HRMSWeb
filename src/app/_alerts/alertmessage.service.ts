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

    displayMessage(message: string) {
        this.service.add({ key: 'tst',severity: 'error',  summary: '',detail: message, life: 5000 });
    }

    displayMessageforLeave(message: string) {
        this.service.add({ key: 'tst', severity: 'error', summary: 'Status', detail: message, life: 5000 });
    }

    displayInfo(message: string) {
        this.service.add({ key: 'tst', severity: 'info', summary: 'Info', detail: message, life: 5000 });
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
    'SCUQ002': 'Security Questions Added Failed',
    'SCUQ003': 'Password Updated & Security Questions Added Successfully',

    // settings

    //Hr Notifications
    'HRN001': 'Notification Added Successfully',
    'HRN002': 'Notification Added Failed',
    'HRN003': 'Notification Deleted Successfully',
    'HRN004': 'Notification Deletion Failed',
    // change password
    'SSECP001': 'Password Updated Successfully',
    'ESECP001': 'Invalid Current Password',
    //Roles
    'SMR001': 'Role Added Successfully',
    'SMR002': 'Role Updated Successfully',

    // updatesecurityquestions
    'SSESQ001': 'Security Question Added Successfully',
    'SSESQ005': 'Security Question Updated Successfully',
    'SSESQ002': 'Security Question Saved Failed',
    'SSESQ003': 'Security Question Deleted Successfully',
    'SSESQ004': 'Security Question Deleted Failed',
    //Admin Settings
    'ASS001': 'Settings Updated Successfully',
    'ASS002': 'Settings Updated Failed',
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
    'SEDU002': 'Education Details Updated Successfully',
    //Family Details
    'SFD001': 'Family Details Added Successfully',
    'SFD002': 'Family Details Updated Successfully',
    //Bank Details
    'SBDS001': 'Bank Details Added Successfully',
    //Address Details
    'SAD001': 'Address Details Saved Successfully',
    'SAD002': 'Address Details Not Added',
    'SAP001': 'Permanent Address Already Existed',
    'SAC001': 'Current Address Already Existed',
    'SMAD004': 'Address Details Update Successfully',
    'SMAD005': 'Employee Already Has a Permanent Address',
    'SMAD006': 'Employee Already Has a Current Address.',
    'SMAD007': 'Each employee is allowed to have only one permanent address and one temporary address and one current address.',
    'EMAD001': 'All The 3 Types Of Addresses Existing In Database You Can Only Alter The addresses.',



    //uploadDocuments
    'EAD001': 'More Than 5 Files Not Accepted',
    'EAD002': 'Upload Documents Added Successfully',
    'EAD003': 'Upload Documents Not Added',
    'EAD004': 'Please Enter Title',
    'EAD005': 'File size is too large. Please select a smaller file.',
    'EAD006': 'Document Deleted Successfully.',
    'EAD007': 'Document Not Deleted.',
    //Enroll Employee

    'SEE001': 'Employee Enrolled Successfully',
    'SEE002': 'Employee Not Enrolled Please Enter Valid Name',
    //Experience Details
    'SED001': 'Experience Details Added Successfully',
    'SED002': 'Experience Details Not Added',
    // View Employee Basic Details
    'EVEBD001': 'Basic Details Updated Successfully',
    'EVEBD002': 'Basic Details Updated Failed',

    // View Employee Office Details
    'EVEOFF001': 'Office Details Saved Successfully',
    'EVEOFF002': 'Office Details Updated Failed',

    // View Employee Experience Details
    'EVEEXP001': 'Experience Details Saved Successfully',
    'EVEEXP002': 'Experience Details Failed',

    // View Employee Education Details
    'EVEEDU001': 'Education Details Saved Successfully',
    'EVEEDU002': 'Education Details Failed',

    //Bank Details
    'SMBD001': 'Bank Details Saved Successfully',

    //Family Details
    'SMFD001': 'Family Details Saved Successfully',

    //Attendence
    'EAAS001': 'Attendence Added Successfully',
    'EAAS002': 'Attendence Not Added',
    'EAAS003': 'Please Enter Attendance For ',
    'EAAS004': 'Please Enter Leave Narration',
    'EAAS005': 'Leave Applied Successfully.',
    'EAAS006': 'Attendence Details Updated For Current Date.',
    'EAAS007': 'Please Enter Previous Day Attendance.',
    'EAAS008': 'Attendence Updated Successfully',
    'EAAS009': 'Attendence Not Updated ',



    //Leave Details
    'ELD001': 'Leave Applied Successfully',
    'ELA001': 'Leave Approved Successfully',
    'ELR002': 'Leave Rejected',
    'ELA005': 'Leave Accepted Successfully',
    'WFH001': 'WFH Applied successfully',
    'WFH002': 'WFH Failed to Applied',
    'ELA003': 'Leave Deleted Successfully',
    'ELA004': 'Leave Deleted Failed',
    //Job Opening Details
    'JOD001': 'Job Opening Added Successfully',
    'DPJ001': 'There is no Suitable Applicants for this Job.',

    //    Leave Confirmation
    'ALC001_PL': 'PL Approved Successfully',
    'ALC002_CL': 'CL Approved Successfully',
    'ALC003_WFH': 'WFH Approved Successfully',
    'ALC004_PL': 'PL Rejected Successfully',
    'ALC005_CL': 'CL Rejected Successfully',
    'ALC006_WFH': 'WFH Rejected Successfully',
    'ALC007_PL': 'PL Accepted Successfully',
    'ALC008_CL': 'CL Accepted Successfully',
    'ALC009_WFH': 'WFH Accepted Successfully',
    'ALC0010_LWP': 'LWP Approved Successfully',
    'ALC0011_LWP': 'LWP Accepted Successfully',
    'ALC0012_LWP': 'LWP Rejected Successfully',
    // view applicant
    'ARVAP001': 'Applicant Details Added Successfully',
    'ARVAP002': 'Applicant Details Updated Successfully',
    'ARVAP003': 'Applicant Details saved Failed',
    //Applicant
    'AP001': 'Applicant Added Successfully',
    'AP002': 'Applicant Updated Successfully',
    //Recruitment Attributes
    'RAS001': 'Recruitment Attribute Added Successfully',
    'RAS003': 'Recruitment Attribute Not Added',
    'RAS002': 'Recruitment Attribute Updated Successfully',
    'RAS004': 'Recruitment Attribute Not Updated',

    //Leave Configuration
    'LC001': 'Leave Configuration Added Successfully',
    'LC002': 'Leave Configuration Updated Successfully',

    'ADW001': 'Wishes Send Successfully',
    'ADW002': 'Wishes Send Failed',

}

