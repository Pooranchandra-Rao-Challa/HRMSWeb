import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-viewapplicant.dialog',
  templateUrl: './viewapplicant.dialog.component.html',
})
export class ViewapplicantDialogComponent {
  @Input() rowData: any;
  @Output() saveClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancelClicked: EventEmitter<void> = new EventEmitter<void>();

  onSave() {
    this.saveClicked.emit(this.rowData);
    this.ref.close();
  }

  onCancel() {
    this.cancelClicked.emit();
    this.ref.close();
  }

  constructor(public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,) {
  
      this.rowData = this.config.data;
      console.log( this.rowData );
      
  }

  
}
