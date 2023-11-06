export class LookupViewDto {
    lookupId?: number;
    code?: string;
    name?: string;
    isActive?: boolean;
    fKeySelfId?: number;
    lookupDetails?: string;
    expandLookupDetails?: LookupDetailsDto[];
    updatedAt?: Date;
    createdAt?: Date;
    updatedBy?: string;
    createdBy?: string;
}

export class LookupDetailsDto {
    lookupId?: number;
    lookupDetailId?: number;
    code?: string;
    name?: string;
    description?: string;
    isActive?: boolean;
    fkeySelfId?: number;
    updatedAt?: Date;
    createdAt?: Date;
    updatedBy?: string;
    createdBy?: string;
}
export class AssetsViewDto {
    assetTypeId?: number;
    assetType?: string;
    assetCategoryId?: number;
    assetCategory?: string;
    assets?: string;
    expandassets?: AssetsDetailsViewDto[]
}

export class AssetsDetailsViewDto {
    assetId?: number;
    code?: string;
    name?: string;
    assetTypeId?: number;
    assetType?: string;
    assetCategoryId?: number;
    assetCategory?: string;
    purchasedDate?: Date;
    modelNumber?: string;
    manufacturer?: string;
    serialNumber?: string;
    warranty?: string;
    addValue?: number;
    description?: string;
    statusId?: number;
    status?: string;
    isActive?: boolean;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
}

export class AssetsDto {
    assetId?: number;
    code?: string;
    name?: string;
    assetTypeId?: number;
    assetCategoryId?: number;
    purchasedDate?: Date;
    modelNumber?: string;
    manufacturer?: string;
    serialNumber?: string;
    warranty?: string;
    addValue?: number;
    description?: string;
    statusId?: number;
    isActive?: boolean;
}

export class HolidaysViewDto {
    holidayId?: number
    title?: string
    description?: string
    fromDate?: any
    toDate?: any
    years: any[]
    year: any
    isActive?: boolean
    createdAt?: string
    createdBy?: string
    updatedAt?: string
    updatedBy?: string
}
export class HolidayDto {
    holidayId: any
    title?: string
    description?: string
    fromDate?: any
    toDate?: any
    isActive?: boolean
}
export class ProjectViewDto {
    projectId: number;
    code: string;
    name: string;
    startDate: string;
    description: string;
    clientId: number;
    clientName: string;
    companyName: string;
    email: string;
    mobileNumber: string;
    cinno: string;
    pocName: string;
    pocMobileNumber: string;
    address: string;
    logo: string;
    teamMembers: string
    expandEmployees: EmployeesList[];
    isActive: boolean
    createdBy?: string
    createdAt?: string
    updatedBy?: string
    updatedAt?: string
}
export class EmployeesList {
    employeeId: number
    employeeName: string
    employeeCode: string;
    date: string;
}
export class ProjectAllotments {
    employeeId: number
    projectAllotmentId: number
    projectId: number
    isActive: boolean
}
export class ProjectDetailsDto {
    clientId: number
    projectId: number;
    code: string;
    name: string;
    InceptionAt: string;
    logo: string;
    description: string;
    isActive?: boolean;
    projectAllotments?: []
    clients?: ClientDetailsDto[];
    createdBy?: string
    createdAt?: string
    updatedBy?: string
    updatedAt?: string
}
export class ClientDetailsDto {
    clientId: number
    clientName: string
    companyName: string
    email: string
    mobileNumber: string
    cinno: string
    pocName: string
    pocMobileNumber: string
    address: string;
    isActive?: boolean;
}
export class ClientNamesDto {
    clientId: number;
    companyName: string;
}

export interface EmployeesForAllottedAssetsViewDto {
    employeeId: number;
    employeeName: string;
    code: string;
    officeEmailId: string;
    employeeRoleName: string;
    mobileNumber: string;
    photo: string;
    certificateDOB?: Date;
    gender?: string;
    designationId?: number;
    designation?: string;
    dateofJoin?: Date;
}

export class EmployeeRolesDto {
    eroleId?: number;
    name?: string;
}

export class EmployeeHierarchyDto {
    employeeId?: number;
    employeeName?: string;
    designationId?: number;
    designation?: string;
    roleId?: number;
    roleName?: string;
    eRoleId?: number;
    eRoleName?: string;
    projectId?: number;
    projectName?: string;
    chartId?: number;
    hierarchyLevel?: string;
    selfId?: number;
    reportingToId?: number;
    photo?: string;
}

export class JobDesignDto {
    jobDesignId?: number;
    projectId?: number;
    designationId?: number;
    description?: string;
    natureOfJobId?: number;
    compensationPackage?: string;
    toBeFilled?: Date;
    isActive?: boolean;
    JobDesignTechnicalSkillsXrefs: TechnicalSkills[];
    JobDesignSoftSkillsXrefs: SoftSkills[];
}

export class TechnicalSkills {
    JobDesignTechnicalSkillsXrefId?: number;
    JobDesignId?: number;
    TechnicalSkillId?: number;
}

export class SoftSkills {
    JobDesignSoftSkillsXrefId?: number;
    JobDesignId?: number;
    SoftSkillId?: number;
}



export class JobDesignDetailsViewDto {
    id?: number;
    projectId?: number;
    projectName?: string;
    designationId?: number;
    designation?: number;
    natureOfJobId?: number;
    natureOfJob?: number;
    description?: string;
    toBeFilled?: Date;
    compensationPackage?: string;
    softSkillIds?: string;
    softSkills?: string;
    technicalSkillIds?: string;
    technicalSkills?: string;
    isActive?: boolean;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
}