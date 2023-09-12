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
	bloodGroupId?: string;
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

export class EmployeeBasicDetailViewDto {
	employeeId?: number;
	code?: string;
	employeeName?: string;
	gender?: string;
	bloodGroupId?: number;
	bloodGroup?: string;
	mobileNumber?: number;
	alternateMobileNumber?: number;
	originalDOB?: Date;
	certificateDOB?: Date;
	maritalStatus?: string;
	emailId?: string;
	photo?: any;
	signDate?: Date;
	isActive?: boolean;
	createdAt?: Date;
	createdBy?: string;
	updatedAt?: Date;
	updatedBy?: string;
}

export class EmployeeOfficedetailsviewDto {
	employeeId?: number;
	employeeName?: string;
	code?: string;
	employeeInceptionDetailId?: number;
	timeIn?: any;
	timeOut?: any;
	officeEmailId?: string;
	dateofJoin?: Date;
	isPFEligible?: boolean;
	isESIEligible?: boolean;
	reportingToId?: number;
	reportingTo?: string;
	isActive?: boolean;
	createdAt?: Date;
	createdBy?: string;
	updatedAt?: Date;
	updatedBy?: string;
}