import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators'

import { CustomerModel } from './customer.model';
import { numberRange, matchValue } from '../shared/custom-validators';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerForm: FormGroup;
  customer = new CustomerModel();
  validationMsg: string;
  a: any;
  b: any;

  validationMessages = {
    email: 'Please enter a valid email. fromTS',
    mismatch: 'value mismatch.',
    rangeError: 'has to be in range',
    required: 'field is required.'
  };

  private formControlTrack(controlKey: string, formGrpName: FormGroup ) {
    const control = formGrpName.get(controlKey);
    control.valueChanges.pipe( debounceTime(1000) ).subscribe( (val) => {
      this.validationMsg = this.setValidationMsg(control);
    });
  }

  private setValidationMsg(control: AbstractControl): string {
    // this.validationMsg = '';
    if ( (control.touched || control.dirty) && control.errors ) {
      return Object.keys(control.errors).map( (key): string => {
        return this.validationMessages[key];
      }).join(' ');
    }
    return '';
  }

  private createCustomerForm() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(55)]],
      lastName: [
        { value: '', disabled: false },
        [Validators.required, Validators.maxLength(55)]
      ],
      sendCatalog: [true],
      mobileNumber: [''],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required]]
      },
      {
        validators: [ matchValue(['email', 'confirmEmail'])]
      }),
      notification: ['email'],
      rating: [null, [numberRange(1, 5)]],
      addresses: this.fb.array([ this.addressFormBuilder() ])
    });
  }

  private addressFormBuilder(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      streetAddress1: '',
      streetAddress2: '',
      city: '',
      state: '',
      zipCode: ''
    });
  }

  get addresses(): FormArray {
    return this.customerForm.get('addresses') as FormArray;
  }

  addAddress(): void {
    this.addresses.push(this.addressFormBuilder());
  }

  private trackSendCatalog() {
    this.customerForm.get('notification').valueChanges.subscribe( (val) => {
      this.setNotificationMode(val);
    });
  }


  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createCustomerForm();
    this.trackSendCatalog();
    this.formControlTrack('emailGroup.email', this.customerForm);
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  testData(): void {
    this.customerForm.patchValue({
      firstName: 'Jack',
      lastName: 'Rayn',
      email: 'jackrayn@amazonoriginal.com',
      sendCatalog: false
    });
  }

  setNotificationMode(notifyVia: string): void {
    const mobileNumber = this.customerForm.get('mobileNumber');
    if (notifyVia === 'text') {
      mobileNumber.setValidators([Validators.required]);
    } else {
      mobileNumber.clearValidators();
    }
    mobileNumber.updateValueAndValidity();
  }

}
