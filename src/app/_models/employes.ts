export class EmployeesViewDto {
	employeeId?: number
	code?: string
	employeeName?: string
	gender?: string
	certificateDOB?: string
	dateofJoin?: any
	officeEmailId?: any
	employeeRoleName?: any
	mobileNumber?: string
	photo?: any
}
export class EmployeeBasicDetailDto {
	employeeId?: number;
	code?: string;
	firstName?: string;
	middleName?: string;
	lastName?: string;
	userId?: string;
	gender?: string;
	bloodGroupId?: number;
	mobileNumber?: number;
	alternateMobileNumber?: number;
	originalDob?: Date;
	certificateDob?: Date;
	maritalStatus?: string;
	emailId?: string;
	photo?: string;
	signDate?: Date;
	isActive?: boolean;
}

export class FamilyDetailsDto {
	familyInformationId?: number;
	employeeId?: number;
	name?: string;
	relationshipId?: number;
	addressId?: number;
	dob?: Date;
	adhaarNo?: number;
	panno?: number;
	mobileNumber?: number;
	isNominee?: boolean;
}
export class BankDetailViewDto {
	bankId?: number;
	employeeId?: number;
	bankName?: string;
	branchName?: string;
	ifsc?: string;
	accountNumber?: number;
	isActive?: boolean;
	bankDetailId?: number;
	employeeName?: string;
}
export class BankDetailsDto {
	bankId?: number;
	employeeId?: number;
	name?: string;
	branchName?: string;
	ifsc?: string;
	accountNumber?: number;
	isActive?: boolean;
}
export class UploadDocuments{
	uploadDocumentId?:number;
	employeeId?:number;
	title?:string;
	fileName?:string;
}
export class AddressDetailsDto{
	employeeId:number
	addressId: number
	AddressLine1: string
	AddressLine2: string
	Landmark:string
	ZIPCode:number
	City:string
	stateId:number
	countryId: number
	addressType: string
	IsActive:boolean
}

export class EmployeeBasicDetailViewDto {
	employeeId?: number;
	code?: string;
	employeeName?: string;
	firstName?: string;
	middleName?: string;
	lastName?: string;
	gender?: string;
	bloodGroupId?: number;
	bloodGroup?: string;
	mobileNumber?: number;
	alternateMobileNumber?: number;
	originalDOB?: Date;
	certificateDOB?: Date;
	maritalStatus?: string;
	emailId?: string;
	photo?: string;
	signDate?: Date;
	isActive?: boolean;
	createdAt?: Date;
	createdBy?: string;
	updatedAt?: Date;
	updatedBy?: string;
}
export class States{
	lookupDetailId:number
	code: string
    name: string
}
export class Countries{
	lookupDetailId:number
	code: string
    name: string
}
export class EmployeeOfficedetailsviewDto {
	employeeId?: number;
	employeeName?: string;
	code?: string;
	employeeInceptionDetailId?: number;
	timeIn?: string;
	timeOut?: string;
	officeEmailId?: string;
	dateofJoin?: Date;
	isPFEligible?: boolean;
	isESIEligible?: boolean;
	reportingToId?: number;
	reportingTo?: string;
	projectName?: string;
	isActive?: boolean;
	createdAt?: Date;
	createdBy?: string;
	updatedAt?: Date;
	updatedBy?: string;
}


export class EmployeeOfficedetailsDto {
	createdAt?: Date;
	updatedAt?: Date;
	createdBy?: string;
	updatedBy?: string;
	employeeInceptionId?: number;
	employeeId?: number;
	timeIn?: string;
	timeOut?: string;
	officeEmailId?: string;
	dateofJoin?: Date;
	isPfeligible?: boolean;
	isEsieligible?: boolean;
	reportingToId?: number;
	isActive?: boolean;
	strTimeIn?: any;
	strTimeOut?: any;
}

export class TimeIn {
	ticks?: number;
	days?: number;
	hours?: number;
	milliseconds?: number;
	minutes?: number;
	seconds?: number;
}

export class TimeOut {
	ticks?: number;
	days?: number;
	hours?: number;
	milliseconds?: number;
	minutes?: number;
	seconds?: number;
}

export class EmployeAdressViewDto {
	employeeId?: number
	employeeName?: string
	code?: string
	addressId?: number
	addressLine1?: string
	addressLine2?: string
	addressType?: string
	city?: string
	landmark?: string
	zipCode?: string
	stateId?: number
	state?: string
	countryId?: number
	country?: string
	isActive?: boolean
	createdAt?: string
	createdBy?: string
	updatedAt?: string
	updatedBy?: string
}

export class FamilyDetailsViewDto {
	employeeId?: number
	employeeName?: string
	code?: string
	familyInformationId?: number
	name?: string
	relationshipId?: number
	relationship?: string
	addressId?: number
	addressLine1?: string
	city?: string
	stateId?: number
	state?: string
	mobileNumber?: string
	isNominee?: boolean
	createdAt?: string
	createdBy?: string
	updatedAt?: string
	updatedBy?: string
}

