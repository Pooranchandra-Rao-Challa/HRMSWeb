

export const LOGIN_URI = "Security/Login";
export const REFRESH_TOKEN_URI = "Security/Refresh";
export const REVOKE_TOKEN_URI = "Security/Revoke";
export const GET_USERS_URI = "Security/GetUsers";
export const CREATE_ROLE_URI = "Security/CreateRole";
export const UPDATE_ROLE_URI = "Security/UpdateRole";
export const GET_ALL_USER_QUESTIONS_URI = "Security/GetAllUserQuestions";
export const VALIDATE_USER_QUESTIONS_URI = "Security/ValidateUserQuestions";
export const FORGOT_PASSWORD_URI = "Security/ForgotPassword";
export const GET_SECURITY_QUESTIONS_URI = "Security/SecureQuestions"
export const CREATE_SECURITY_QUESTIONS_URI = "Security/CreateUserQuestion"
export const CHANGE_PASSWORD_URI = "Security/ChangePassword";
export const GET_ROLES_URI = "Security/GetRoles";
export const UPDATE_USER_QUESTIONS_URI = "Security/UpdateUserQuestion";
export const UPDATE_USER_URI = "Security/UpdateUser";
export const GET_PERMISSIONS_URI = "Security/GetPermissions"
export const GET_ROLE_PERMISSIONS_URI = "Security/GetRolePermissions"
export const Delete_USER_URI = "Security/DeleteUser";
export const GET_LOOKUP_URI = "Admin/GetLookups";
export const CREATE_LOOKUP_URI = "Admin/CreateLookup";
export const UPDATE_LOOKUP_URI = "Admin/UpdateLookup";
export const GET_HOLIDAY_URI = "Admin/GetHolidays/";
export const CREATE_HOLIDAY_URI = "Admin/CreateHoliday";
export const GET_ASSETS_URI = "Admin/GetAssetsDetails";
export const CREATE_ASSETS_URI = "Admin/CreateAsset";
export const UPDATE_ASSETS_URI = "Admin/UpdateAsset";
export const GET_ASSETS_BY_ASSETTYPE_URI = "Admin/GetAssetsBasedonType";
export const CREATE_ASSET_ALLOTMENT_URI = "Admin/CreateAssetAllotment";
export const GET_YEARS_FROM_HOLIDAYS_URI = "Admin/GetYearsFromHolidays";
export const GET_ASSET_ALLOTMENTS_URI = "Admin/GetAssetAllotmentDetails";
export const UNASSIGNED_ASSET_ALLOTMENT_URI = "Admin/InactiveAssetAllotment";
export const DELETE_USER_QUESTIONS_URI = "Security/DeleteUserQuestions";

//Leave Configuration
export const GET_LEAVE_CONFIGURATION = "Security/GetLeaveConfigurationData";
export const CREATE_LEAVE_CONFIGURATION = "Security/UpdateLeaveConfiguration";

// BEGIN LOOKUPS

export const LOOKUP_ASSET_TYPE_URI = "Lookup/AssetTypes";
export const LOOKUP_ASSET_CATEGORIES_URI = "Lookup/AssetCategories";
export const LOOKUP_ASSET_STATUS_URI = "Lookup/Status";
export const LOOKUP_CURRICULUM_URI = "Lookup/Curriculums";
export const LOOKUP_STREAM_URI = "Lookup/Streams";
export const LOOKUP_GRADING_SYSTEM_URI = "Lookup/GradingMethods";
export const LOOKUP_COUNTRY_URI = "Lookup/Countries";
export const LOOKUP_DAYWORKSTATUS_URI = "Lookup/DayWorkStatus"
export const LOOKUP_STATES_URI = "Lookup/States";
export const LOOKUP_BLOOD_GROUPS_URI = "Lookup/BloodGroups";
export const LOOKUP_RELATIONSHIP_URI = "Lookup/Relations";

export const LOOKUP_LOOKUPS_URI = "Lookup/Lookups";
export const LOOKUP_LOOKUP_KEYS_URI = "Lookup/LookupKeys";
export const LOOKUP_DETAILS_URI = "Lookup/LookupDetails";
export const LOOKUP_NAMES_URI = "Lookup/LookupNames";
export const LOOKUP_NAMES_NOT_CONFIGURE_URI = "Lookup/LookupNamesNotConfigured";
export const LOOKUP_NAMES_CONFIGURE_URI = "Lookup/LookupNamesConfigured";

// END LOOKUPS

export const GET_PROJECTS_URI = "Admin/GetProjectDetails";
export const GET_PROJECT_WITH_ID = "Admin/GetProjectDetails";
export const CREATE_PROJECT_URI = "Admin/CreateProjectWithDetails";
export const UPDATE_PROJECT_URI = "Admin/UpdateProjectWithDetails";
export const GET_CLIENTNAMES_URI = "Admin/GetClientNames";
export const GET_PROJECT_STATUSES = "Admin/GetEProjectStatuses"
export const GET_CLIENT_DETAILS = "Admin/GetClientDetails";
export const GET_EMPLOYEES = "Employee/GetEmployeeDropdown";
export const GET_EMPLOYEESLIST = "Employee/GetEmployeesForProject";
export const UNASSIGNED_EMPLOYEE_URI = "Admin/InactiveProjectAllotment";
export const GET_EMPLOYEE_HIERARCHY_BASED_ON_PROJECTS = "Admin/GetEmployeeHierarchy";
export const GET_EMPLOYEE_ROLES_INFO = "Admin/GetERoles";

//EMPLOYEE
export const GET_EMPLOYEES_URI = "Employee/GetEmployeeDetails";
export const CREATE_BASIC_DETAILS_URI = "Employee/CreateEmployeeBasicDetails";
export const CREATE_EDUCATION_DETAILS_URI = "Employee/UpdateEducationDetails";
export const EMPLOYEES_FOR_ALLOTTED_ASSETS_URI = "Admin/GetAssetsForEmployees";
export const GET_EMPLOYEE_BASED_ON_ID_URI = "Employee/GetEmployeeBasedOnId";
export const CREATE_BANK_DETAILS_URI = "Employee/UpateBankDetails";
export const CREATE_DOCUMENTS_URI = "UploadDocument/UploadDocuments";
export const CREATE_FAMILY_DETAILS_URI = "Employee/UpdateFamilyInformation";
export const CREATE_ADDRESS_URI = "Employee/UpdateAddress";
export const CREATE_EXPERIENCE_URI = "Employee/UpdateWorkExperience";
export const GET_ADDRESS_BASED_ON_ID_URI = "Employee/GetAddressesForEmployee";
export const GET_EDUCATION_DETAILS_URI = "Employee/GetEducationDetailsForEmployee";
export const GET_WORKEXPERIENCE_URI = "Employee/GetWorkExperienceForEmployee";
export const GET_GETFAMILYDETAILS_URI = "Employee/GetFamilyDetailsForEmployee";
export const GET_GETUPLOADEDDOCUMENTS_URI = "UploadDocument/GetUploadedDocumentsForEmployee";
export const GET_BANKDETAILS_URI = "Employee/GetBankDetailsForEmployee"
export const GET_OFFICE_DETAILS_URI = "Employee/GetInceptionDetailsForEmployee";
export const UPDATE_OFFICE_DETAILS_URI = "Employee/UpdateEmployeeInceptionDetails";
export const UPDATE_EMPLOYEE_BASED_ON_ID_URI = "Employee/UpdateEmployeeBasicDetails";
export const GET_STATES_URI = "Lookup/States";
export const GET_COUNTRIES_URI = "Lookup/Countries";
export const GET_DESIGNATION_URI = "Lookup/Designations";
export const GET_SKILL_AREA_URI = "Lookup/SkillAreas";
export const ENROLL_URI = "Employee/EnrollUser";
export const UPDATE_EDUCATION_DETAILS = "Employee/UpdateEducationDetails";
export const UPDATE_EXPERIENCE_DETAILS = "Employee/UpdateWorkExperience";
export const DELETE_DOCUMENT = "UploadDocument/DeleteUploadDocument";
export const GET_PATH = "UploadDocument/DownloadFile";

//Attendence

export const GET_ATTENDENCE = "Attendance/GetMonthlyAttendanceReport";
export const POST_LISTOF_ATTENDANCES = "Attendance/CreateAttendanceForEmployees";
export const GET_EMPLOYEE_LEAVE_DETAILS = "Attendance/GetEmployeeLeaves";
export const CREATE_EMPLOYEE_LEAVE_DETAILS = "Attendance/CreateEmployeeLeave";
export const UPDATE_EMPLOYEE_LEAVE_DETAILS = "Attendance/UpdateEmployeeLeave";
export const GET_NOTUPDATED_EMPLOYEES = "Attendance/GetNotUpdatedEmployeesInAttendance";
export const GET_COMPANY_HIERARCHY = "Employee/GetCompanyHierarchy";

//Job Details

export const GET_JOB_DETAILS = "JobOpening/GetJobOpening";
export const CREATE_JOB_OPENINGS_DETAILS = "JobOpening/CreateJobOpening";
export const UPDATE_JOB = "JobOpening/UpdateJobOpeningById";
//RecruitmentAttributes
export const CREATE_RECRUITMENT_ATTRIBUTE="Recruitment/CreateRecruitmentAttribute";
export const UPDATE_RECRUITMENT_ATTRIBUTE="Recruitment/UpdateRecruitmentAttribute";
export const GET_RECRUITMENT_DETAILS="Recruitment/GetRecruitmentAttributes"
// leave confirmation
export const GET_EMPLOYEE_MAIL_DETAILS = "Attendance/UpdateLeaveStatus";
export const UPDATE_EMPLOYEE_MAIL_DETAILS = "Attendance/UpdateLeaveStatus";

// viewapplicant
export const GET_VIEW_APPLICANT_DETAILS = "Recruitment/GetApplicantBasedOnId";
export const CREATE_VIEW_APPLICANT_EDUCATION_DETAILS = "Recruitment/CreateApplicantEducationDetails";
export const UPDATE_VIEW_APPLICANT_EDUCATION_DETAILS = "Recruitment/UpdateApplicantEducationDetails";
export const CREATE_VIEW_APPLICANT_EXPERIENCE_DETAILS = "Recruitment/CreateApplicantWorkExperience";
export const UPDATE_VIEW_APPLICANT_EXPERIENCE_DETAILS = "Recruitment/UpdateApplicantWorkExperience";
export const CREATE_VIEW_APPLICANT_CERTIFICATION_DETAILS = "Recruitment/CreateApplicantCertification";
export const UPDATE_VIEW_APPLICANT_CERTIFICATION_DETAILS = "Recruitment/UpdateApplicantCertification";
export const CREATE_VIEW_APPLICANT_LANGUAGE_SKILL = "Recruitment/CreateApplicantLanguageSkill";
export const UPDATE_VIEW_APPLICANT_LANGUAGE_SKILL = "Recruitment/UpdateApplicantLanguageSkill";
export const CREATE_VIEW_APPLICANT_TECHNICAL_SKILL = "Recruitment/CreateApplicantSkill";
export const UPDATE_VIEW_APPLICANT_TECHNICAL_SKILL = "Recruitment/UpdateApplicantSkill";
//Applicant
export const GET_APPLICANT_DETAILS = "Recruitment/GetApplicants";
export const CREATE_APPLICANT_DETAILS = "Recruitment/CreateApplicant";
export const UPDATE_APPLICANT_DETAILS = "Recruitment/UpdateApplicant";
export const GET_JOB_OPENINGS_DROPDOWN = "JobOpening/GetJobTitleWithInitiatedAt";
export const Get_Applicants_with_Id = "Recruitment/GetApplicantsForInitialQualification"
export const UPDATE_APPLICANT = "Recruitment/updateinitialqualification";
