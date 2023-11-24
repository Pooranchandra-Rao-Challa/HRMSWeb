import { Component  } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApplicantDialogComponent } from 'src/app/_dialogs/applicant.dialog/applicant.dialog.component';
import { Actions, DialogRequest } from 'src/app/_models/common';
import { DataView } from 'primeng/dataview';
import { ApplicantDto } from 'src/app/_models/recruitment';
import { RecruitmentService } from 'src/app/_services/recruitment.service';

export interface Status {
  name: string;
  code: string;
}

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styles: [
  ]
})
export class ApplicantComponent {
  value: number = 40;
  applicant: ApplicantDto[] = [];
  ActionTypes = Actions;
  dialogRequest: DialogRequest = new DialogRequest();
  applicantdialogComponent = ApplicantDialogComponent;
  sortOrder: number = 0;
  sortField: string = '';
  
  constructor(private recruitmentService: RecruitmentService,
    public ref: DynamicDialogRef,
    private router: Router,
    private dialogService: DialogService) {}

  ngOnInit() {
    this.getApplicant();
  }

  getApplicant(){
    this.recruitmentService.GetApplicantDetail().subscribe((resp) => {
      this.applicant = resp as unknown as ApplicantDto[];
      console.log(this.applicant);
    })
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  viewApplicantDtls(applicantId:number) {
    this.router.navigate(['admin/viewapplicant'], { queryParams: { applicantId: applicantId }});
  }
  
  openComponentDialog(content: any,
    dialogData, action: Actions = this.ActionTypes.add) {
    if (action == Actions.add && content === this.applicantdialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Applicants";
      this.dialogRequest.width = "60%";
    }
    this.ref = this.dialogService.open(content, {
      data: this.dialogRequest.dialogData,
      header: this.dialogRequest.header,
      width: this.dialogRequest.width
    });
    this.ref.onClose.subscribe((res: any) => {
      event.preventDefault(); // Prevent the default form submission
    });
  }
}
