import { Component } from '@angular/core';
import { Employee } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';

@Component({
  selector: 'app-viewemployees',
  templateUrl: './viewemployees.component.html',
  styles: [
  ]
})
export class ViewemployeesComponent {
  color: string = 'bluegray';

  size: string = 'M';

  liked: boolean = false;

  images: string[] = [];

  selectedImageIndex: number = 0;

  quantity: number = 1;

  employees: Employee[] = [];

  constructor(private securityService: SecurityService) { }
  ngOnInit(): void {
    this.securityService.getEmployees().then((data) => (this.employees = data));

    this.images = ['product-overview-3-1.png', 'product-overview-3-2.png', 'product-overview-3-3.png', 'product-overview-3-4.png'];
  }
}
