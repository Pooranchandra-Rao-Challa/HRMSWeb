import { Component } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { SecurityService } from 'src/app/demo/service/security.service';
import { Employee } from 'src/app/demo/api/security';

@Component({
  selector: 'app-assetsallotment',
  templateUrl: './assetsallotment.component.html',
  styles: [
  ]
})
export class AssetsallotmentComponent {
  color1: string = 'Bluegray';
  sortField: string = '';
  sortOrder: number = 0;

  visible: boolean = false;
  showDialog() {
    this.visible = true;
  }

  employees: Employee[] = [];


  constructor(private securityService: SecurityService) { }


  ngOnInit() {
    this.securityService.getEmployees().then((data) => (this.employees = data));

  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

}
