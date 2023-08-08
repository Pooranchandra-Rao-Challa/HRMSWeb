import { Component } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { SecurityService } from 'src/app/demo/service/security.service';
import { Assets, Employee } from 'src/app/demo/api/security';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-assetsallotment',
  templateUrl: './assetsallotment.component.html',
  styles: [
  ]
})
export class AssetsallotmentComponent {
  date: Date | undefined;
  color1: string = 'Bluegray';
  sortField: string = '';
  sortOrder: number = 0;
  fbassets!: FormGroup;
  submitLabel!: string;
  dialog: boolean = false;
  visible: boolean = false;
  showDialog() {
    this.visible = true;

  }

  employees: Employee[] = [];


  constructor(private securityService: SecurityService, private formbuilder: FormBuilder) { }


  ngOnInit() {
    this.assetsForm();
    this.securityService.getEmployees().then((data) => (this.employees = data));

  }
  assetsForm() {
    this.fbassets = this.formbuilder.group({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      purchasedDate: new FormControl('', [Validators.required]),
      modelNumber: new FormControl('', [Validators.required]),
      manufacturer: new FormControl('', [Validators.required]),
      serialNumber: new FormControl('', [Validators.required]),
      warranty: new FormControl('', [Validators.required]),
      addValue: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      isActive: new FormControl('', [Validators.required]),
      createdAt: new FormControl('', [Validators.required]),
      updatedAt: new FormControl('', [Validators.required]),
      createdBy: new FormControl('', [Validators.required]),
      updatedBy: new FormControl('', [Validators.required]),
      assetsDetails: this.formbuilder.array([])
    });
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }
  onClose() {
    this.fbassets.reset();
  }
  addAssetsDialog() {
    this.dialog = true;
    this.onClose();
  }
  onSubmit() { }

}
