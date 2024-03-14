export class SelfEmployeeDto {
    employeeId?: number;
    code?: string;
    employeeName?: string;
    gender?: string;
    mobileNumber?: number;
    originalDOB?: Date;
    photo?: string;
    isAFresher?: boolean;
    nationality?: string;
    dateofJoin?: Date;
    designation?: string;
    experienceInCompany?:string;
    officeEmailId?: string;
    reportingToId?: number;
    reportingTo?: string;
    usedCasualLeavesInMonth?: number;
    usedCasualLeavesInYear?: number;
    usedSickLeaves?: number;
    usedEarnedLeaves?: number;
    usedPrivilegeLeavesInMonth?: number;
    usedPrivilegeLeavesInYear?: number;
    usedLWPInMonth?: number;
    usedLWPInYear?: number;
    allottedCasualLeaves?: number;
    allottedPrivilegeLeaves?: number;
    allottedAssets?: string;
    assets?: allottedAssets[];
    workingProjects?: string;
    projects?: workingProjects[];
    addresses?: string;
    empaddress?: addresses[];
}
export class selfEmployeeMonthlyLeaves {
    employeeLeaveId?:number;
    employeeName?: string;
    leaveType?: string;
    status?: string;
    isDeleted?: boolean;
    isHalfDayLeave?:boolean;
    usedCLsInMonth?: number;
    usedPLsInMonth?: number;
    fromDate?:Date;
    toDate?:Date;
    isLeaveUsed?: boolean;
}
export class allottedAssets {
    assetId?: number;
    assetName?: string;
    description?: string;
    assetCode?: string;
    assignedOn?: string;
    thumbnail?: string;
    assetType?: string;
}
export class workingProjects {
    projectId?: number;
    projectName?: string;
    projectLogo?: string;
    projectDescription?: string;
    sinceFrom?: Date;
    endAt?: Date;
}
export class NotificationsDto {
    code?:string;
    employeeId?: number
    employeeName?: string
    message?: string
    messageType?: string
    messageTypeId?: number
    createdAt?:any
}
export class NotificationsRepliesDto {
    code?:string
    employeeId?: number
    employeeName?: string
    isActive?:boolean
    message?: string
    messageType?: string
    messageTypeId?: number
    notificationId?:number
    notificationMessage?:string
    notificationReplyId?:number
}
export class HrNotification{
    employeeId?: number
    message?: string
    messageTypeId?: string
    notifyTill?:Date
}
export class addresses {
    addressId?: number;
    addressLine1?: string;
    addressLine2?: string;
    addressType?: string;
    city?: string;
}

export class adminDashboardViewDto {
    activeEmployees?: number;
    activeProjects?: string;
    savedactiveProjects?: activeProjects[];
    supsendedProjects?: string;
    savedsupsendedProjects?: supsendedProjects[];
    employeeLeaveCounts?: string;
    savedemployeeLeaveCounts?: employeeLeaveCounts[];
    employeeBirthdays?: string;
    savedActiveEmployeesInOffice?: absentEmployees[]
    savedemployeeBirthdays?: employeeBirthdays[];
    employeesOnLeave?: string;
    savedemployeesOnLeave?: employeesOnLeave[];
    absentEmployees?: string;
    savedabsentEmployees?: absentEmployees[];
    calculatedLeaveCount: number;
    totalprojectsCount: number;
    activeEmployeesInOffice?: string
}

export class AttendanceCountBasedOnTypeViewDto{
    value?:string;
    lwp?:number;
    pt?:number;
    cl?:number;
    pl?:number;
    wfh?:number;
    projectId?:number;
    projectName?:string;
}

export class EmployeesofAttendanceCountsViewDto{
    value?:string;
    dayWorkStatus?:string;
    employeeName?:string;
    code?:string;
    monthNames?:string;
    projectName?:string;
}

export class activeProjects {
    projectStatus?: string;
    projectStatusCount?: number;
}

export class supsendedProjects {
    projectStatus?: string;
    projectStatusCount?: number;
}

export class employeeLeaveCounts {
    leaveType?: string;
    leaveTypeCount?: number;
}
export class employeeBirthdays {
    employeeName?: string;
    employeeDOB?: Date;
    employeecode?: string;
}
export class employeesOnLeave {
    employeeName?: string;
    leaveType?: string;
    employeecode?: string;
    designation?: string;
}
export class absentEmployees {
    employeeStatus?: string;
    employeesCount?: number;
}