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
    officeEmailId?: string;
    reportingToId?: number;
    reportingTo?: string;
    usedCasualLeavesInMonth?: number;
    usedCasualLeavesInYear?: number;
    usedSickLeaves?: number;
    usedEarnedLeaves?: number;
    usedPrivilegeLeavesInMonth?: number;
    usedPrivilegeLeavesInYear?: number;
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
    usedCLsInMonth?: number
    usedPLsInMonth?: number
}
export class allottedAssets {
    assetId?: number;
    assetName?: string;
    description?: string;
    modelNumber?: string;
    serialNumber?: string;
    thumbnail?: string;
}
export class workingProjects {
    projectId?: number;
    projectName?: string;
    projectLogo?: string;
    projectDescription?: string;
    sinceFrom?: Date;
    endAt?: Date;
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
    savedActiveEmployeesInOffice?:absentEmployees[]
    savedemployeeBirthdays?: employeeBirthdays[];
    employeesOnLeave?: string;
    savedemployeesOnLeave?: employeesOnLeave[];
    absentEmployees?: string;
    savedabsentEmployees?: absentEmployees[];
    calculatedLeaveCount: number;
    totalprojectsCount: number;
    activeEmployeesInOffice?:string
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
    employeeCode?: string;
}
export class employeesOnLeave {
    employeeName?: string;
    leaveType?: string;
}
export class absentEmployees{
    employeeStatus?:string;
    employeesCount?:number;
}