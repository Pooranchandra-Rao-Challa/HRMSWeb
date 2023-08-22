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

