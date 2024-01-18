import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { LookupViewDto } from 'src/app/_models/admin';
import { NotificationsDto } from 'src/app/_models/dashboard';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MIN_LENGTH_2 } from 'src/app/_shared/regex';

@Component({
  selector: 'app-hr-notifications',
  templateUrl: './hr-notifications.component.html'
})
export class HrNotificationsComponent {
  fbHrNotification!: FormGroup;
  messageTypes: LookupViewDto[] = [];
  minDate: Date = new Date(new Date());
  notifications: NotificationsDto[] = [];

  constructor(private formbuilder: FormBuilder,
    private alertMessage: AlertmessageService,
    private lookupService: LookupService,
    private dashBoardService: DashboardService,) { }

  ngOnInit(): void {
    this.initHRForm();
    this.getMessageTypes();
    this.initNotifications();
  }

  initHRForm() {
    this.fbHrNotification = this.formbuilder.group({
      employeeId: [null],
      messageTypeId: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
      notifyTill: new FormControl('', [Validators.required]),
    });
  }
  addNotification() {

  }
  get FormControls() {
    return this.fbHrNotification.controls;
  }
  restrictSpaces(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    // Prevent the first key from being a space
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0)
      event.preventDefault();

    // Restrict multiple spaces
    if (event.key === ' ' && target.selectionStart > 0 && target.value.charAt(target.selectionStart - 1) === ' ') {
      event.preventDefault();
    }
  }
  getMessageTypes() {
    this.lookupService.MessageTypes().subscribe(resp => {
      this.messageTypes = resp as unknown as LookupViewDto[];
      console.log(resp);

    })
  }
  initNotifications() {
    this.dashBoardService.GetNotifications().subscribe(resp => {
      this.notifications = resp as unknown as NotificationsDto[];
    })
  }
  editLeaveDetails(notification){
    
  }
  onSubmit() {

  }
}
