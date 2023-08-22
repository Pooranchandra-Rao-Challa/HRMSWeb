export class LookUpHeaderDto {
  lookUpId!: number;
  lookupDetailId?: number;
  code?: string;
  name?: string;
  isActive?: boolean;
  lookUpDetails?: LookupDetailsDto[];
}

export class LookupViewDto {
  lookupId?: number;
  code?: string;
  name?: string;
  isActive?: boolean;
  lookupDetails?: string;
  expandLookupDetails?: LookupDetailsDto[];
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}

export class LookupDetailsDto {
  lookupDetailId?: number;
  code?: string;
  name?: string;
  lookupId?: number;
  description?: string;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}
export class LookupDetailViewDto {
  lookupId?: number;
  lookupDetailId?: number;
  code?: string;
  name?: string;
  description?: string;
  lookupName?: string;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}
export class HolidaysViewDto {
  holidayId?: number
  title?: string
  description?: string
  fromDate?: string
  toDate?: string
  isActive?: boolean
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
}
export class HolidayDto {
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  holidayId?: number
  title?: string
  description?: string
  fromDate?: string
  toDate?: string
  isActive?: boolean
}