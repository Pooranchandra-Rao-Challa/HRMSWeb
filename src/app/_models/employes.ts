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
	mobileNumber?: string;
	alternateMobileNumber?: string;
	originalDob?: Date;
	certificateDob?: Date;
	maritalStatus?: string;
	emailId?: string;
	photo?: string;
	signDate?: Date;
	isActive?: boolean;
	isAFresher?: boolean;
}

export class EducationDetailsDto {
	educationDetailId?: number;
	employeeId?: number;
	streamId?: number;
	curriculumId?: number;
	curriculum?: string;
	countryId?: number;
	country?: string;
	stateId?: number;
	state?: string;
	institutionName?: string;
	authorityName?: string;
	passedOutyear?: Date;
	gradingMethodId?: number;
	gradingValue?: number;
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
export class UploadDocuments {
	uploadDocumentId?: number;
	employeeId?: number;
	title?: string;
	fileName?: string;
}
export class AddressDetailsDto {
	employeeId: number
	addressId: number
	addressLine1: string
	addressLine2: string
	landmark: string
	zipCode: number
	city: string
	stateId: number
	addressType: string
	isActive: boolean
}

export class Employee {
	id?: number;
	empname?: string;
	image?: string;
	empcode?: string;
	dob?: Date;
	designation?: string;
	gender?: string;
	maritalStatus?: string;
	doj?: Date;
	email?: string;
	currentAddress?: string;
	permanentAddress?: string;
	phoneno?: number;
	skillSets?: string;
	shift?: string;
	officeEmailID?: string;
	reportedTo?: string;
	pfEligible?: string;
	esiEligible?: string;
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
	mobileNumber?: string;
	alternateMobileNumber?: string;
	originalDOB?: Date;
	certificateDOB?: Date;
	maritalStatus?: string;
	emailId?: string;
	photo?: string;
	signDate?: Date;
	isActive?: boolean;
	isAFresher?: boolean;
	createdAt?: Date;
	createdBy?: string;
	updatedAt?: Date;
	updatedBy?: string;
}
export class States {
	lookupDetailId: number
	code: string
	name: string
}

export class SkillArea {
	lookupDetailId: number
	code: string
	name: string
}
export class Countries {
	lookupDetailId: number
	code: string
	name: string
}
export class ExperienceDetailsDto {
	workExperienceId: number
	employeeId: number
	isAfresher: boolean
	companyName: string
	companyLocation: string
	companyEmployeeId: string
	designationId: number
	dateOfJoining: Date
	dateOfReliving: Date
	countryId: number;
	stateId: number;
	workExperienceXrefs: SkillAreas[]
	skillAreaId: any
}
export class SkillAreas {
	workExperienceXrefId?: number;
	workExperienceId?: number;
	skillAreaId?: number;
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
	designation?: string;
	designationId?: number;
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
	employeeId: number;
	employeeName: string;
	code: string;
	familyInformationId: number;
	name: string;
	adhaarNo: string;
	panNo: string | null;
	dob: Date;
	zipCode: any
	relationshipId: number;
	relationship: string;
	addressId: number;
	addressLine1: string;
	city: string;
	stateId: number;
	state: string;
	mobileNumber: string;
	isNominee: boolean;
	createdAt: Date;
	createdBy: string;
	updatedAt: Date;
	updatedBy: string;
}

export class employeeEducDtlsViewDto {
	employeeId?: number;
	employeeName?: string;
	code?: string;
	educationDetailId?: number;
	curriculumId?: number;
	curriculum?: string;
	streamId?: number;
	stream?: string;
	countryId?: number;
	country?: string;
	stateId?: number;
	state?: string;
	institutionName?: string;
	authorityName?: string;
	passedOutyear?: Date;
	gradingMethodId?: number;
	gradingMethod?: string;
	gradingValue?: number;
	createdAt?: Date;
	createdBy?: string
	updatedAt?: Date;
	updatedBy?: string
}
export class employeeExperienceDtlsViewDto {
	workExperienceId?: number;
	employeeId?: number;
	isAFresher?: boolean;
	companyName?: string;
	companyLocation?: string;
	companyEmployeeId?: String;
	designationId?: number;
	designation?: string;
	dateOfJoining?: Date;
	dateOfReliving?: Date;
	stateId?: number;
	state?: string;
	countryId?: number;
	country?: string;
	skillAreaIds?: number;
	skillAreaNames?: string;
	createdAt?: Date;
	createdBy?: string;
	updatedAt?: Date;
	updatedBy?: string;
}

export class employeeAttendanceDto {
	employeeId: number;
	employeeName: string;
	dates: { [date: string]: string | {} };
}

export class EmployeeLeaveDto {
	employeeLeaveId?: number;
	employeeId?: number;
	employeeName?: string;
	code?: string;
	fromDate?: Date;
	toDate?: Date;
	leaveTypeId?: number;
	leaveType?: string;
	note?: string;
	acceptedBy?: string;
	acceptedAt?: Date;
	approvedBy?: string;
	approvedAt?: Date;
	rejected?: boolean;
	comments?:String;
	status?: string;
	isApprovalEscalated?: boolean;
	url?: String;
	createdAt?: Date;
	createdBy?: string;
}

export class EmployeeAttendanceList {
	attendanceId?: number;
	employeeId?: number;
	date: Date
	DayWorkStatusId?: number;
	NotReported: boolean
}

export class CompanyHierarchyViewDto {
	chartId?: number;
	chartTitle?: string;
	selfId?: number;
	roleId?: number;
	roleName?: string;
	hierarchyLevel?: number;
}

export class EmployeeLeaveDetailsViewDto {
	employeeId?: number;
	employeeName?: string;
	leaveId?: number;
	leaveType?: string;
	fromDate?: Date;
	toDate?: Date;
	note?: string;
	status?: string;
}

export class EmployeeLeaveDetailsDto {
	employeeId?: number;
	leaveId?: number;
	comment?: string;
	protectedData?: string;
	protectedWith?: string;
	status?: string;
}