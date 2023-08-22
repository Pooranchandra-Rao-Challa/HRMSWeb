export class LookUpHeaderDto {
  lookupId?: number;
  lookupDetailId?: number;
  code?: string;
  name?: string;
  isActive?: boolean;
  lookupDetails?:LookupDetailsDto[];
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
  LookupDetailId?: number;
  Code?: string;
  Name?: string;
  LookupId?: number;
  Description?: string;
  IsActive?: boolean;
  UpdatedAt?: Date;
  CreatedAt?: Date;
  UpdatedBy?: string;
  CreatedBy?: string;
}
export class LookupDetailViewDto {
  lookupId?: number;
  lookupDetailId?: number;
  code?: string;
  name?: string;
  description?: string;
  lookupName?: string;
  isActive?: boolean;
  lookupDetails?: LookupDetailsDto[];
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
  serialNumber?: number;
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
  purchasedDate?: number;
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