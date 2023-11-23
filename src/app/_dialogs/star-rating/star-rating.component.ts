import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styles: [
  ]
})
export class StarRatingComponent {
  @Input() control: FormControl;
  @Output() ratingChange = new EventEmitter<number>();
  rating: any;

  ngOnInit(): void {
    if (this.control) {
      this.rating = this.control.value;
    }
  } 
 handleClick(index: number): void {
  // Determine the actual rating value based on the clicked index
  const clickedValue = index + 1;

  // Toggle between different states based on the current rating
  if (this.rating === clickedValue - 0.5) {
    // 1st click on the half-filled star: fully fill the star
    this.rating = clickedValue;
  } else if (this.rating === clickedValue) {
    // 2nd click on the fully filled star: empty the star
    this.rating = 0;
  } else {
    // 3rd click (or more): half-fill the star
    this.rating = clickedValue - 0.5;
  }

  // Ensure the rating stays within the range of 0 to 5
  this.rating = Math.min(Math.max(this.rating, 0), 5);

  // Update the form control if provided
  if (this.control) {
    this.control.setValue(this.rating);
  }

  // Emit the updated rating
  this.ratingChange.emit(this.rating);
}

}
