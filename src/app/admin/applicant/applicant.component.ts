import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ITableHeader } from 'src/app/_models/common';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { Applicant } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';

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
  globalFilterFields: string[] = ['name', 'mobileNumber', 'email']
  @ViewChild('filter') filter!: ElementRef;
  applicant: Applicant[] = [];
  status: Status[] | undefined;

  constructor(private securityService: SecurityService,
    private globalFilterService: GlobalFilterService,
  ) {

  }
  headers: ITableHeader[] = [
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'mobileNumber', header: 'mobileNumber', label: 'Mobile Number' },
    { field: 'email', header: 'email', label: 'Email' },
    { field: 'status', header: 'status', label: 'Status' },
    { field: 'resume', header: 'resume', label: 'Resume' }
  ];

  ngOnInit() {
    this.securityService.getApplicantData().then((resp) => {
      this.applicant = resp as unknown as Applicant[];
    })
    this.status = [
      { name: 'Open', code: 'OP' },
      { name: 'Close', code: 'CL' }
    ]
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
