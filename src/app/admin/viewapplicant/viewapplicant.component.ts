import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ViewapplicantDialogComponent } from 'src/app/_dialogs/viewapplicant.dialog/viewapplicant.dialog.component';
import { Actions, DialogRequest, ViewApplicationScreen } from 'src/app/_models/common';
import { RecruitmentService } from 'src/app/_services/recruitment.service';

@Component({
  selector: 'app-viewapplicant',
  templateUrl: './viewapplicant.component.html',
  styles: [
  ]
})
export class ViewapplicantComponent {
  applicantId: any;
  viewApplicantDetails: any;
  selectedExperience: any;
  ActionTypes = Actions;
  isCursorPointer: boolean = false;
  dialogRequest: DialogRequest = new DialogRequest();

  viewApplicantDialogDetails = ViewapplicantDialogComponent
  constructor(private RecruitmentService: RecruitmentService,
    private activatedRoute: ActivatedRoute,
    public ref: DynamicDialogRef,
    private dialogService: DialogService,) {
      this.applicantId = this.activatedRoute.snapshot.queryParams['applicantId'];
     }

  ngOnInit() {
    // this.initviewapplicantdetails();
    this.initViewApplicantDetails();
  }

  initViewApplicantDetails(){
       this.RecruitmentService.GetviewapplicantDtls(this.applicantId).subscribe((resp) => {
        this.viewApplicantDetails = resp as unknown as any[];
        console.log( this.viewApplicantDetails);
        
       })
  }

  // initViewApplicantDetails() {
  //   // Sample data similar to the structure expected from your API
  //   this.viewApplicantDetails = {
  //     name: 'John Doe',
  //     Male: 'Male',
  //     gmail: 'john.doe@example.com',
  //     phonenumber: '123-456-7890',
  //     dob: '1990-01-01',
      
  //     Address: '123 Main St, City, Country',
  //     Country: 'Country Name',
  //     technicalSkills: [
  //       { name: 'Skill 1', expertise: 4 },
  //       { name: 'Skill 2', expertise: 3 },
  //       // Add more skills as needed
  //     ],
  //     languageSkills: [
  //       { name: 'English', read: true, write: true, speak: true },
  //       { name: 'Spanish', read: false, write: true, speak: false },
  //       // Add more languages as needed
  //     ],
  //     educationDetails: [
  //       { institution: 'University 1', degree: 'Degree 1', duration: '2010-2014' },
  //       { institution: 'University 2', degree: 'Degree 2', duration: '2015-2018' },
  //       { institution: 'University 3', degree: 'Degree 3', duration: '2010-2014' },
  //       { institution: 'University 4', degree: 'Degree 4', duration: '2015-2018' },
  //     ],
  //     experienceDetails: [
  //       { company: 'Company 1', position: 'Position 1', duration: '2018-2020' },
  //       { company: 'Company 2', position: 'Position 2', duration: '2021-Present' },
  //       { company: 'Company 3', position: 'Position 3', duration: '2018-2020' },
  //       { company: 'Company 4', position: 'Position 4', duration: '2021-Present' },
  //     ],
  //     certificationDetails: [
  //       { name: 'Certification 1', institute: 'Institute 1', yearOfCompletion: '2019', result: 'A' },
  //       { name: 'Certification 2', institute: 'Institute 2', yearOfCompletion: '2022', result: 'B' },
  //       { name: 'Certification 3', institute: 'Institute 3', yearOfCompletion: '2019', result: 'A++' },
  //       { name: 'Certification 4', institute: 'Institute 4', yearOfCompletion: '2022', result: 'O' },
  //     ]
  //   };
  // }

  // openEditDialog(data: any): void {
  //   const ref = this.ref.open(ViewapplicantDialogComponent, {
  //     data: { ...data },
  //   });

  //   ref.onClose.subscribe((updatedData: any) => {
  //     if (updatedData) {
  //       // Handle the updated data
  //       console.log('Updated Data:', updatedData);
  //       // You can update the data in your parent component or perform other actions
  //     }
  //   });
  // };

  openEditDialog(content: any,
    dialogData, action: Actions = this.ActionTypes.edit) {
    if (action == Actions.edit && content === this.viewApplicantDialogDetails) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "education details";
      this.dialogRequest.width = "40%";
    }
    this.ref = this.dialogService.open(content, {
      data: this.dialogRequest.dialogData,
      header: this.dialogRequest.header,
      width: this.dialogRequest.width
    });
    this.ref.onClose.subscribe((res: any) => {
      if (res) {
        if (res.UpdatedModal == ViewApplicationScreen.educationdetails) {
          this.initViewApplicantDetails();
        }
      }
    });
  };
}
