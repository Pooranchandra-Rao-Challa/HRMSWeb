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
    usedCasualLeavesInMonth?:number;
    usedCasualLeavesInYear?: number;
    usedSickLeaves?: number;
    usedEarnedLeaves?: number;
    usedPrivilegeLeavesInMonth?:number;
    usedPrivilegeLeavesInYear?: number;
    allowableCasualLeaves?: number;
    allowablePrivilegeLeaves?: number;
    allottedAssets?: string;
    workingProjects?: string;
    projects?:workingProjects[];
}

export class workingProjects{
    projectId?:number;
    projectName?:string;
    projectLogo?:string;
    projectDescription?:string;
}