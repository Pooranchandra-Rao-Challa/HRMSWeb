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
    workingProjects?: string;
    projects?: workingProjects[];
}
export class selfEmployeeMonthlyLeaves {
    usedCLsInMonth?: number
    usedPLsInMonth?: number
}
export class workingProjects {
    projectId?: number;
    projectName?: string;
    projectLogo?: string;
    projectDescription?: string;
}