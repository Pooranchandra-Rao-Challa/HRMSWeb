import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { ITableHeader } from 'src/app/_models/common';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { RecruitmentAttributesDTO } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';

@Component({
  selector: 'app-recruitmentattributes',
  templateUrl: './recruitmentattributes.component.html',
  styles: [
  ]
})
export class RecruitmentAttributesComponent {
  globalFilterFields: string[] = ['employeeName', 'leaveType', 'fromDate', 'toDate', 'note', 'acceptedBy', 'acceptedAt', 'approvedBy']
  @ViewChild('filter') filter!: ElementRef;
  mediumDate: string = MEDIUM_DATE
  recruitmentAttributes:RecruitmentAttributesDTO[]=[];

  headers: ITableHeader[] = [
    { field: 'assesmentTitle', header: 'assesmentTitle', label: 'Assesment Title' },
    { field: 'minExpertise', header: 'minExpertise', label: 'Min Expertise' },
    { field: 'maxExpertise', header: 'maxExpertise', label: 'Max Expertise' },
    { field: 'attributeTypes', header: 'attributeTypes', label: 'Attribute Types' },
    { field: 'recruitmentStages', header: 'recruitmentStages', label: 'Recruitment Stages' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' }
  ];
  
  constructor(
    private globalFilterService: GlobalFilterService,
    private securityService:SecurityService) {}

   ngOnInit(){
    this.getAttributes();
   }

   getAttributes() {
      this.securityService.getRecruitmentAttributes().then((resp) => {
        this.recruitmentAttributes = resp as unknown as RecruitmentAttributesDTO[];
        console.log(this.recruitmentAttributes);
        
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

}
