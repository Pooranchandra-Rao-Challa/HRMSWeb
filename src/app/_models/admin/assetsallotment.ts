export class AssetAllotmentDto {
    employeeId?: string;
    employeeName?: string;
    assetCategoryId?: number;
    assetTypeId?: number;
    assetName?: string;
    assignedOn?: Date;
    comment?: string;
    isActive?: boolean;
}

export interface AssetAllotmentViewDto {
    assetTypeName: string;
    assignedOn: Date;
    comment: string;
    isActive: boolean;
}
