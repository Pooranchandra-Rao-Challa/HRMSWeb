import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
})
export class AdminSettingsComponent {

  fbAdminSettings!: FormGroup;
  settings:any;
  appSettingId:any;

  constructor(private formbuilder: FormBuilder,
    private alertMessage: AlertmessageService, public ref: DynamicDialogRef,
    private lookupService: LookupService,
    private dashBoardService: DashboardService,) { }


  ngOnInit(): void {
    this.initAdminSettings();
  }

  initAdminSettings() {
    this.dashBoardService.GetAdminSettings().subscribe(
      (resp) => {
        this.settings = resp;
        const { appSettingId, ...remainingFields } = this.settings;
        this.appSettingId=appSettingId;
        this.settings = remainingFields;
        this.createForm();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  createForm() {
    this.fbAdminSettings = this.formbuilder.group({});
    Object.keys(this.settings).forEach((key) => {
      this.fbAdminSettings.addControl(key, this.formbuilder.control(this.settings[key]));
    });
  }
  modifyLabel(key: string): string {
    console.log(this.settings);
    return key.replace(/^[a-z]*/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
  }


  addAdminSettings(){
    const defaultObject={...this.fbAdminSettings.value,appSettingId:this.appSettingId};
    this.dashBoardService.updateAdminSettings(defaultObject).subscribe(resp=>{
      if(resp){
        this.ref.close(true);
        this.alertMessage.displayAlertMessage(ALERT_CODES["ASS001"]);
      }
      else
        this.alertMessage.displayErrorMessage(ALERT_CODES["ASS002"]);
    });
  }

}
