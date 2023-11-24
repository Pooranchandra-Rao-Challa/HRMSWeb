import { dateSelectionJoinTransformer } from "@fullcalendar/core/internal";

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
    count?:number;
    expandassets?: AssetsDetailsViewDto[]
}

export class AssetsDetailsViewDto {
    employeeName: string;
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
export class ProjectStatus {
    eProjectStatusesId?:number;
    name?:string;
    date?:Date;
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
    Initial:Date;
    working:Date;
    completed:Date;
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
export class projectStatuses{
    eProjectStatusesId?:number;
    date?:Date;
}
export class EmployeesList {
    employeeId: number
    reportingToId: number;
    photo: string;
    fullName: string
    code: string;
    designation: string;
    dateofJoin: Date;
    reportingTo: string;
    eRoleName:string;
    eRoleId:number;
    date: string;
}
export class ProjectAllotments {
    employeeId?: number
    projectAllotmentId?: number
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
    projectStatuses?:[]
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
    assetCount?: number;
    noOfWorkingDays?: number;
    noOfAbsents?: number;
    noOfLeaves?: number;
    projectDescription?: string;
    clientName?: string;
    clientCompanyName?: string;
    chartId?: number;
    hierarchyLevel?: string;
    selfId?: number;
    reportingToId?: number;
    photo?: string;
}

export class JobOpeningsDetailsViewDto {
    id?: number;
    JobOpeningId?: number;
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
    JobOpeningTechnicalSkillsXrefs: TechnicalSkills[];
    JobOpeningSoftSkillsXrefs: SoftSkills[];
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    InitiatedAt ?:Date
}

export class TechnicalSkills {
    JobOpeningsTechnicalSkillsXrefId?: number;
    JobOpeningId?: number;
    TechnicalSkillId?: number;
    Expertise?: number;
}

export class SoftSkills {
    JobOpeningsSoftSkillsXrefId?: number;
    JobOpeningId?: number;
    SoftSkillId?: number;
}

export class NodeProps {
    name: string;
    roleName: string;
    designation: string;
    imageUrl: string;
    area: string;
    profileUrl: string;
    office: string;
    tags: string;
    isLoggedUser: boolean;
    positionName: string;
    id: string;
    parentId: string;
    projectName: string;
    projectDescription: string;
    assetCount?: number;
    noOfWorkingDays?: number;
    noOfAbsents?: number;
    noOfLeaves?: number;
    clientName?: string;
    clientCompanyName?: string;
    progress: number[];
    _directSubordinates: number;
    _totalSubordinates: number;
    _upToTheRootHighlighted: boolean;
}

export class ChartParams{
    nodes?:NodeProps[];
}

export class NodeDropParams{
    DropNode:NodeProps
}


export class ApplicantCertificationDto{
    certificationId?:number;
    applicantId?:number;
    certificateId?:number;
    institutionName?:string;
    yearOfCompletion?:Date;
    results?:string;
}

export class ApplicantExperienceDto{
    experienceId?:number;
    applicantId?:number;
    companyName?:string;
    companyLocation?:string;
    stateId?:number;
    companyEmployeeId?:number;
    designationId?:number;
    natureOfWork?:string;
    workedOnProjects?:string;
    dateOfJoining?:Date;
    dateOfReliving?:Date;
}

export class ApplicantSkillsDto{
    applicationskillId?:number;
    applicantId?:number;
    skillId?:number;
    expertise?:string;
}

export class ApplicantLanguageSkills{
    applicaitonLanguageSkillId?:number;
    applicantId?:number;
    languageId?:number;
    canRead?:boolean;
    canWrite?:boolean;
    canSpeak?:boolean;
}
