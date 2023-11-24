import { Component } from '@angular/core';

@Component({
  selector: 'app-recruitmentprocess',
  templateUrl: './recruitmentprocess.component.html',
  styles: [
  ]
})
export class RecruitmentProcessComponent {
  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
];
}
