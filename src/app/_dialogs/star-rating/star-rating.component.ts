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
  @Output() hover = new EventEmitter<number>();

  stars: any[] = [5];
  rating: number = 0; // or any default value that makes sense for your use case
  hoveredStarIndex: number | null = null;
  starStates: number[] = [];

  ngOnInit(): void {
    this.stars.forEach(() => {
      this.starStates.push(0);
    });

    if (this.control) {
      this.rating = this.control.value;
      this.control.valueChanges.subscribe((value) => {
        this.rating = value;
      });
    }
  }
  onStarHover(index: number): void {
    console.log('Hovered Index:', index);
    this.hover.emit(index);
  }
  
  handleClick(): void {
    console.log('Clicked. Rating:', this.rating, 'Hovered Index:', this.hoveredStarIndex);
  
    if (this.hoveredStarIndex !== null) {
      console.log('Star Clicked:', this.hoveredStarIndex);
      
      // Increment the click count for the specific star
      this.starStates[this.hoveredStarIndex]++;
  
      // Determine the fill level based on the click count for the specific star
      let fillLevel: number;
  
      if (this.starStates[this.hoveredStarIndex] === 1) {
        fillLevel = 0.5; // 1st click: half-filled
      } else if (this.starStates[this.hoveredStarIndex] === 2) {
        fillLevel = 1;   // 2nd click: fully-filled
      } else {
        this.starStates[this.hoveredStarIndex] = 0; // Reset the click count on the 3rd click
        fillLevel = 0;       // 3rd click: empty
      }
  
      // Update the rating based on the fill level and ensure it stays within the range of 0 to 5
      this.rating = Math.min(Math.max(fillLevel, 0), 5);
    } else {
      // No star is clicked: empty all stars
      this.rating = 0;
    }
  
    // Emit the updated rating
    this.ratingChange.emit(this.rating);
  
    // Update the form control value
    if (this.control) {
      this.control.setValue(this.rating);
    }
  
    console.log('Updated Rating:', this.rating);
    console.log('Star States:', this.starStates);
  
    console.log('Clicked. Rating:', this.rating, 'Hovered Index:', this.hoveredStarIndex);
  }
  
  
  
}
