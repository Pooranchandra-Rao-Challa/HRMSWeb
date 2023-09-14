export class MaxLength {
  code: number = 20;
  title:number = 50;
  name: number = 50;
  seasonName: number = 9;
  address: number = 256;
  cinNo:number=50;
  pinCode: number = 6;
  phoneNo: number = 10;
  panNo:number=10;
  accountNo: number = 18;
  aadhaarNo:number =12;
  Seasonname:number=9;
  ifscCode:number=11;
  Code:number=20;
  listingorder:number=2;
  description:number = 256;
}
export interface ITableHeader {
    field: string;
    header: string;
    label: string;
  }

export class ConfirmationRequest {
    message: string = 'Are you sure want to delete ?';
    header: string = 'Confirmation';
    icon: string = 'pi pi-exclamation-triangle';
}
