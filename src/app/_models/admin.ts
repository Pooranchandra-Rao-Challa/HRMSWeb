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