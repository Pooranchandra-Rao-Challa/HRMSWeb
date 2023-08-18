export class LookUpHeaderDto {
    lookUpId!: number;
    lookupDetailId?: number;
    code?: string;
    name?: string;
    isActive?: boolean;
    lookUpDetails?: LookupDetailDto[];
  }
  
  export class LookupViewDto {
    id!: number;
    lookupDetailId?: number;
    code?: string;
    name?: string;
    isActive?: boolean;
    lookupDetails?: LookupDetailDto[];
    updatedAt?: Date;
    createdAt?: Date;
    updatedBy?: string;
    createdBy?: string;
  }
  
  export class LookupDetailDto {
    lookupDetailId?: number;
    code?: string;
    name?: string;
    aliasName?: string;
    lookupId?: number;
    remarks?: string;
    lookupName?: string;
    listingorder?: number;
    isActive?: boolean;
    updatedAt?: Date;
    createdAt?: Date;
    updatedBy?: string;
    createdBy?: string;
    // billParams: BillParameterViewDto[] = [];
  }
  export class LookupDetailViewDto {
    lookupId?: number;
    lookupDetailId?: number;
    code?: string;
    name?: string;
    remarks?: string;
    isActive?: boolean;
    listingorder?: number;
    lookupDetails?: LookupDetailDto[];
    updatedAt?: Date;
    createdAt?: Date;
    updatedBy?: string;
    createdBy?: string;
    // lookupName?: string;
  
  }