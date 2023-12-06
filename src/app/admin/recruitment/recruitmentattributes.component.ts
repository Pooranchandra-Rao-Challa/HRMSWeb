import { Component, ElementRef, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { RecruitmentattributeDialogComponent } from 'src/app/_dialogs/recruitmentattribute.dialog/recruitmentattribute.dialog.component';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { RecruitmentAttributesDTO, RecruitmentStageDetailsDto, SkillDetailsDto, TechnicalDetailsDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { AdminService } from 'src/app/_services/admin.service';
import { LookupDetailsDto } from 'src/app/_models/admin';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-recruitmentattributes',
  templateUrl: './recruitmentattributes.component.html',
  styles: [
  ]
})
export class RecruitmentAttributesComponent {
  globalFilterFields: string[] = ['assessmentTitle', 'attributeType', 'recruitmentStages']
  @ViewChild('filter') filter!: ElementRef;
  mediumDate: string = MEDIUM_DATE
  recruitmentAttributes: RecruitmentAttributesDTO[] = [];
  ActionTypes = Actions;
  recruitmentattributeDialogComponent = RecruitmentattributeDialogComponent;
  dialogRequest: DialogRequest = new DialogRequest();
  technicalskills: TechnicalDetailsDto[] = [];
  softskills: SkillDetailsDto[] = [];
  attributeStages: RecruitmentStageDetailsDto[];

  headers: ITableHeader[] = [
    { field: 'assessmentTitle', header: 'assesmentTitle', label: 'Assesment Title' },
    { field: 'minExpertise', header: 'minExpertise', label: 'Min Expertise' },
    { field: 'maxExpertise', header: 'maxExpertise', label: 'Max Expertise' },
    { field: 'attributeType', header: 'attributeTypes', label: 'Attribute Types' },
    { field: 'recruitmentStages', header: 'recruitmentStages', label: 'Recruitment Stages' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' }
  ];

  constructor(
    private globalFilterService: GlobalFilterService, private lookupService: LookupService,
    private securityService: SecurityService, private adminService: AdminService,
    private dialogService: DialogService,
    public ref: DynamicDialogRef) { }

  ngOnInit() {
    this.getAttributes();
    this.getSoftSkills();
    this.getTechnicalSkills();
    this.getAttributeStages();
  }

  getAttributes() {
    this.adminService.GetRecruitmentDetails(false).subscribe((resp) => {
      this.recruitmentAttributes = resp as unknown as RecruitmentAttributesDTO[];
      this.recruitmentAttributes.forEach(element => {
        element.SkillDetails = JSON.parse(element.strSoftSkills);
        element.TechnicalDetails = JSON.parse(element.strTechnicalSkills);
        element.RecruitmentStageDetails = JSON.parse(element.strRecruitmentStages);
      });
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.globalFilterService.filterTableByDate(table, searchTerm);
  }


  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  getSoftSkills(): SkillDetailsDto[] {
    this.lookupService.SoftSkills().subscribe((resp) => {
      let softskills = resp as unknown as LookupDetailsDto[];
      this.softskills = [];
      if (softskills)
        softskills.forEach(item => {
          this.softskills.push({
            rASSXrefId: null,
            softSkillId: item.lookupDetailId,
            softSkill: item.name,
            assigned: false
          })
        });
    })
    return this.softskills
  }
  getTechnicalSkills(): TechnicalDetailsDto[] {
    this.lookupService.SkillAreas().subscribe((resp) => {
      let technicalskills = resp as unknown as LookupDetailsDto[];
      this.technicalskills = [];
      if (technicalskills)
        technicalskills.forEach(item => {
          this.technicalskills.push({
            rATSXrefId: null,
            technicalSkillId: item.lookupDetailId,
            technicalSkill: item.name,
            assigned: false
          });
        })
    })
    return this.technicalskills
  }
  getAttributeStages():RecruitmentStageDetailsDto[] {
    this.lookupService.attributestages().subscribe((resp) => {
      let attributeStages = resp as unknown as LookupDetailsDto[];
      this.attributeStages = [];
      if (attributeStages)
      attributeStages.forEach(item => {
          this.attributeStages.push({
            rAWSXrefId: null,
            recruitmentStageId: item.lookupDetailId,
            recruitmentStage: item.name,
            assigned: false
          });
        })
    })
    return this.attributeStages
 
  }

  openComponentDialog(content: any, dialogData, action: Actions = this.ActionTypes.add) {
    if (action === Actions.save && content === this.recruitmentattributeDialogComponent) {
      this.dialogRequest.dialogData = dialogData || {
        SkillDetails: this.getSoftSkills(),
        TechnicalDetails: this.getTechnicalSkills(),
        RecruitmentStageDetails:this.getAttributeStages()
      };
      this.dialogRequest.header = "Attributes";
      this.dialogRequest.width = "60%";
    }
    this.ref = this.dialogService.open(content, {
      data: this.dialogRequest.dialogData,
      header: this.dialogRequest.header,
      width: this.dialogRequest.width
    });
    this.ref.onClose.subscribe((res: any) => {
      if (res) {
        this.getAttributes();
        this.getSoftSkills();
        this.getTechnicalSkills();
        this.getAttributeStages();
      }
      event.preventDefault(); // Prevent the default form submission
    });
  }

}
