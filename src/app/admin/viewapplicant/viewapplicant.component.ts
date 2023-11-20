import { Component } from '@angular/core';

@Component({
  selector: 'app-viewapplicant',
  templateUrl: './viewapplicant.component.html',
  styles: [
  ]
})
export class ViewapplicantComponent {
  events = [
    { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
   
];
}
