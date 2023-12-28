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
    description?:string;
    modelNumber?:string;
    serialNumber?:string;
    thumbnail?:string;
}
export class workingProjects {
    projectId?: number;
    projectName?: string;
    projectLogo?: string;
    projectDescription?: string;
    sinceFrom?:Date;
    endAt?:Date;
}
export class addresses {
    addressId?: number;
    addressLine1?: string;
    addressLine2?: string;
    addressType?: string;
    city?: string;
}