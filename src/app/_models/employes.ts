export class EmployeesViewDto {
	employeeId?: number
	code?: string
	employeeName?: string
	gender?: string
	bloodGroupId?: number
	bloodGroup?: string
	mobileNumber?: string
	alternateMobileNumber?: string
	originalDOB?: string
	certificateDOB?: string
	maritalStatus?: string
	emailId?: string
	photo?: any
	signDate?: string
	addresses?: any
	bankDetails?: any
	uploadedDocuments?: any
	employeeInceptionDetailId?: number
	timeIn?: string
	timeOut?: string
	officeEmailId?: any
	dateofJoin?: string
	isPFEligible?: boolean
	isESIEligible?: boolean
	reportingToId?: number
	reportingTo?: any
	roleName?: any
	isActive?: boolean
	createdAt?: string
	createdBy?: string
	updatedAt?: string
	updatedBy?: string
}
export class EmployeeBasicDetailDto{
	employeeId?:number;
	code?:string;
	firstName?:string;
	middleName?:string;
	lastName?:string;
    userId?:string;
	gender?:string;
	bloodGroupId?:string;
	mobileNumber?:number;
	alternateMobileNumber?:number;
	originalDob?:Date;
	certificateDob?:Date;
	maritalStatus?:string;
	emailId?:string;
	photo?:string;
	signDate?:Date;
	isActive?:boolean;
}