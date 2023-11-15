import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PhotoFileProperties } from 'src/app/_models/common';
import { ValidateFileThenUpload } from 'src/app/_validators/upload.validators';

@Component({
  selector: 'app-applicant.dialog',
  templateUrl: './applicant.dialog.component.html',
  styles: [
  ]
})
export class ApplicantDialogComponent {
  fbApplicant!: FormGroup;
  @ViewChild("fileUpload", { static: true }) fileUpload: ElementRef;
  messageDisplayed: boolean = false;
  empUploadDetails: { fileBlob: Blob, title: string, fileName: string }[] = [];
  @Output() ImageValidator = new EventEmitter<PhotoFileProperties>();
  fileTypes: string = ".pdf, .jpg, .jpeg, .png, .gif"

  constructor(private formbuilder: FormBuilder,) { }

  ngOnInit() {
    this.applicantForm();
  }

  applicantForm() {
    this.fbApplicant = this.formbuilder.group({
      applicantId: [null],
      name: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      resume: new FormControl('', [Validators.required])
    });
  }

  onClick() {
    this.messageDisplayed = false;
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      if (this.empUploadDetails.length <= 4) {
        if (this.fbApplicant.valid) {
          for (let index = 0; index < fileUpload.files.length; index++) {
            const file = fileUpload.files[index];
            ValidateFileThenUpload(file, this.ImageValidator);
          }
        }
        else
          this.fbApplicant.markAllAsTouched();
      }
    }
    this.fileUpload.nativeElement.value = '';
  }
}
