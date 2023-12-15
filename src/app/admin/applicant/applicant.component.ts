import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApplicantDialogComponent } from 'src/app/_dialogs/applicant.dialog/applicant.dialog.component';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { DataView } from 'primeng/dataview';
import { ApplicantViewDto } from 'src/app/_models/recruitment';
import { RecruitmentService } from 'src/app/_services/recruitment.service';
import { Table } from 'primeng/table';
import { JwtService } from 'src/app/_services/jwt.service';


@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styles: [
  ]
})
export class ApplicantComponent {
  @ViewChild('filter') filter!: ElementRef;
  globalFilterFields: string[] = ['name', 'gender', 'experienceStatus', 'emailId', 'mobileNo','skills'];
  value: number = 40;
  applicants: ApplicantViewDto[] = [];
  ActionTypes = Actions;
  dialogRequest: DialogRequest = new DialogRequest();
  applicantdialogComponent = ApplicantDialogComponent;
  sortOrder: number = 0;
  sortField: string = '';
  checked: boolean = false;
  permissions: any;
  globalFilterValue: string = ''; // Track the value of the global search field


  headers: ITableHeader[] = [
    { field: 'name', header: 'name', label: 'Applicant Name' },
    { field: 'gender', header: 'gender', label: 'Gender' },
    { field: 'experienceStatus', header: 'experienceStatus', label: 'Work Experience' },
    { field: 'skills', header: 'skills', label: 'Skills' },
    { field: 'emailId', header: 'emailId', label: 'Email' },
    { field: 'mobileNo', header: 'mobileNo', label: 'Phone No' },
  ]

  constructor(private recruitmentService: RecruitmentService,
    public ref: DynamicDialogRef,
    private router: Router,
    private jwtService: JwtService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.getApplicant();
    this.permissions = this.jwtService.Permissions;

  }

  getApplicant() {
    this.recruitmentService.GetApplicantDetail().subscribe((resp) => {
      this.applicants = resp as unknown as ApplicantViewDto[];
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onFilter(dv: DataView, event: Event) {
    if (this.checked === false) {
      dv.filter((event.target as HTMLInputElement).value)
    }
    else {
      this.globalFilterValue = (event.target as HTMLInputElement).value; // Update the global search value
      this.filterData();
    }
  }

  filterData() {
    if (this.checked) {
      // Filter based on skills when the switch is true
      this.applicants = this.applicants.filter(applicant =>
        applicant.skills && applicant.skills.toLowerCase().includes(this.globalFilterValue.toLowerCase()));
      if (this.globalFilterValue.trim() === '') {
        this.getApplicant();
      }
    }
  }

  viewApplicantDtls(applicantId: number) {
    this.router.navigate(['admin/viewapplicant'], { queryParams: { applicantId: applicantId } });
  }

  openComponentDialog(content: any,
    dialogData, action: Actions = this.ActionTypes.add) {
    if (action == Actions.add && content === this.applicantdialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Applicant";
      this.dialogRequest.width = "60%";
    }
    this.ref = this.dialogService.open(content, {
      data: this.dialogRequest.dialogData,
      header: this.dialogRequest.header,
      width: this.dialogRequest.width
    });
    this.ref.onClose.subscribe((res: any) => {
      if (res) { this.getApplicant() };
      event.preventDefault(); // Prevent the default form submission
    });
  }
}
