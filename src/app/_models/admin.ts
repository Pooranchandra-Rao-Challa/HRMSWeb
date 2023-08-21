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