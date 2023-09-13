import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-final-submit',
  templateUrl: './final-submit.component.html',
  // styleUrls: ['./final-submit.component.scss']
})
export class FinalSubmitComponent {
  constructor(private router: Router, private route: ActivatedRoute){}
  employeeId:any;
ngOnInit(){
  
  
  this.route.params.subscribe(params => {
    this.employeeId = params['employeeId'];
  });
console.log(this.employeeId)
}
 
}
