
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
export class BankDetailDto{
    bankId?:number;
	employeeId?:number;
	name?:string;
	branchName?:string;
	ifsc?:string;
	accountNumber?:number;
	isActive?:boolean;
}