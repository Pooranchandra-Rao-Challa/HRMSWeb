
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeAdressViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { MAX_LENGTH_256, MAX_LENGTH_50, MIN_LENGTH_2 } from 'src/app/_shared/regex';
import { ActivatedRoute } from '@angular/router';
import { MaxLength, ViewEmployeeScreen } from 'src/app/_models/common';
import { LookupDetailsDto } from 'src/app/_models/admin';

@Component({
    selector: 'app-address.dialog',
    templateUrl: './address.dialog.component.html'
})
export class AddressDialogComponent {
    fbAddressDetails: FormGroup;
    employeeId: number
    address: EmployeAdressViewDto[];
    countries: LookupDetailsDto[] = [];
    states: LookupDetailsDto[] = [];
    maxLength: MaxLength = new MaxLength();

    constructor(private formbuilder: FormBuilder,
        private alertMessage: AlertmessageService,
        public ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private employeeService: EmployeeService,
        private activatedRoute: ActivatedRoute,
        private lookupService: LookupService) { }

    ngOnInit(): void {
        this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
        this.initAddress();
        this.initGetAddress();
        this.initCountries();
        if (this.config.data) this.editAddress(this.config.data);
    }
    
    initAddress() {
        this.fbAddressDetails = this.formbuilder.group({
            employeeId: [this.employeeId],
            addressId: [null],
            addressLine1: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
            addressLine2: new FormControl('', [Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
            landmark: new FormControl('', [Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
            zipcode: new FormControl('', [Validators.required]),
            city: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
            stateId: new FormControl('', [Validators.required]),
            countryId: new FormControl('', [Validators.required]),
            addressType: new FormControl('', [Validators.required]),
            isActive: new FormControl(true, Validators.requiredTrue),
        })
    }
    
    initGetAddress() {
        this.employeeService.GetAddress(this.employeeId).subscribe((resp) => {
            this.address = resp as unknown as EmployeAdressViewDto[];
            console.log('this.address', this.address);
           
        });
    }
    
    initCountries() {
        this.lookupService.Country().subscribe((resp) => {
            this.countries = resp as unknown as LookupDetailsDto[];
            console.log('countries', this.countries);
            
        })
    }
    
    getStatesByCountryId(id: number) {
        this.lookupService.getStates(id).subscribe((resp) => {
            if (resp) {
                this.states = resp as unknown as LookupDetailsDto[];
            }
        })
    }

    get FormControls() {
        return this.fbAddressDetails.controls;
    }

    editAddress(address) {
        this.getStatesByCountryId(address.countryId)
        this.fbAddressDetails.patchValue({
            employeeId: address.employeeId,
            addressId: address.addressId,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            landmark: address.landmark,
            zipcode: address.zipCode,
            city: address.city,
            countryId: address.countryId,
            stateId: address.stateId,
            addressType: address.addressType,
            isActive: address.isActive,
        })
    }
   
    saveAddress() {
        // Get the employeeId from query parameters
        this.activatedRoute.queryParams.subscribe((queryParams) => {
            const employeeId = +queryParams['employeeId'];
            const isUpdate = this.fbAddressDetails.value.addressId !== null;

            // Call checkExistingAddressType and handle the result
            const validationResult = this.checkExistingAddressType();
            if (validationResult.isValid) {
                this.employeeService
                    .CreateAddress([{ ...this.fbAddressDetails.value, employeeId }])
                    .subscribe((resp) => {
                        if (resp) {
                            const alertCode = isUpdate ? 'SMAD004' : 'SAD001';
                            this.alertMessage.displayAlertMessage(ALERT_CODES[alertCode]);
                            this.ref.close({
                                "UpdatedModal": ViewEmployeeScreen.Address
                            });
                           
                        }
                    });
            } else {
                // Display an alert message if validation fails
                this.alertMessage.displayErrorMessage(validationResult.message);
            }
        });
    }
    

    checkExistingAddressType() {
        const addressType = this.fbAddressDetails.value.addressType;
        if (addressType === 'Permanent Address' && this.hasPermanentAddress()) {
            return { isValid: false, message: ALERT_CODES["SMAD005"] };
        }
        
        if (addressType === 'Current Address' && this.hasCurrentAddress()) {
            return { isValid: false, message: ALERT_CODES["SMAD006"] };
        }
        // Validation passed
        return { isValid: true, message: null };
    }

    hasPermanentAddress(): boolean {
        return this.address.some((addr) => addr.addressType === 'Permanent Address');
    }

    hasCurrentAddress(): boolean {
        return this.address.some((addr) => addr.addressType === 'Current Address');
    }
}