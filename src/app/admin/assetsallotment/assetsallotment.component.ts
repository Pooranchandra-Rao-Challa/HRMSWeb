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

  assetsList = [
    { name: 'Mouse', code: 'MU' },
    { name: 'CPU', code: 'CP' },
    { name: 'Monitor', code: 'MO' },
    { name: 'Keyboard', code: 'KY' },
    { name: 'HeadSet', code: 'HS' },
];
assetsCategory = [
  { name: 'Gadgets', code: 'GD' },
  { name: 'Fixed Assets', code: 'FA' }
];

  assetsForm() {
    this.fbassets = this.formbuilder.group({
      empId: new FormControl('', [Validators.required]),
      assetCategory:new FormControl('', [Validators.required]),
      assetType:new FormControl('', [Validators.required]),
      assetName:new FormControl('', [Validators.required]),
      comment:new FormControl('', [Validators.required]),
      assignedOn:new FormControl('', [Validators.required]),
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
