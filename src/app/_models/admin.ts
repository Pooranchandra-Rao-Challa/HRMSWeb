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
  code?: string;
  name?: string;
  description?: string;
  lookupName?: string;
  isActive?: boolean;
  lookupDetails:string;
  expandLookupDetails?: LookupDetailsDto[];
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
  AssetId?: number;
  Code?: string;
  Name?: string;
  AssetTypeId?: number;
  AssetType?: string;
  AssetCategoryId?: number;
  AssetCategory?: string;
  PurchasedDate?: Date;
  ModelNumber?: string;
  Manufacturer?: string;
  SerialNumber?: string;
  Warranty?: string;
  AddValue?: number;
  Description?: string;
  StatusId?: number;
  Status?: string;
  IsActive?: boolean;
  CreatedAt?: Date;
  CreatedBy?: string;
  UpdatedAt?: Date;
  UpdatedBy?: string;
}

export class AssetsDto {
  AssetId?: number;
  Code?: string;
  Name?: string;
  AssetTypeId?: number;
  AssetCategoryId?: number;
  PurchasedDate?:  Date;
  ModelNumber?: string;
  Manufacturer?: string;
  SerialNumber?: string;
  Warranty?: string;
  AddValue?: number;
  Description?: string;
  StatusId?: number;
  IsActive?: boolean;
}

export class HolidaysViewDto {
  holidayId?: number
  title?: string
  description?: string
  fromDate?: any
  toDate?: any
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
  holidayId: any
  title?: string
  description?: string
  fromDate?: string
  toDate?: string
  isActive?: boolean
}
