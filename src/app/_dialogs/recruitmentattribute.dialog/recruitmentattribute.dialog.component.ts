import { Component } from '@angular/core';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-recruitmentattribute.dialog',
  templateUrl: './recruitmentattribute.dialog.component.html',
  styles: [
  ]
})
export class RecruitmentattributeDialogComponent {
  technicalskills: LookupDetailsDto[] = [];
  attributeTypes:LookupDetailsDto[]=[];
  softskills: LookupDetailsDto[] = [];

  constructor(
    private lookupService: LookupService) { }

  ngOnInit() {
    this.getAttributeTypes();
    this.getSoftSkills();
    this.getTechnicalSkills();
  }

  getAttributeTypes() {
    this.lookupService.AttributeTypes().subscribe((resp) => {
      this.attributeTypes = resp as unknown as LookupViewDto[];
      console.log(resp);
    })
  }
  getSoftSkills() {
    this.lookupService.SoftSkills().subscribe((resp) => {
      this.softskills = resp as unknown as LookupViewDto[];
    })
  }
  getTechnicalSkills() {
    this.lookupService.SkillAreas().subscribe((resp) => {
      this.technicalskills = resp as unknown as LookupViewDto[];
    })
  }



}
