export class AssetAllotmentDto {
    assetAllotmentId?: number;
    employeeId?: number;
    // employeeName?: string;
    assetCategoryId?: number;
    assetTypeId?: number;
    AssetId?: number;
    // assetName?: string;
    assignedOn?: Date;
    revokedOn?: Date;
    reasonForRevoke?: string;
    isActive?: boolean;
}

export interface AssetAllotmentViewDto {
    assetTypeName: string;
    assignedOn: Date;
    reasonForRevoke: string;
    isActive: boolean;
}

export interface AssetsByAssetTypeIdViewDto {
    assetId: number;
    name: string;
}
