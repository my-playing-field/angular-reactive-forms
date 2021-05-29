import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {forbiddenNameValidator} from './shared/username.validator';
import {passwordValidator} from './shared/password.validator';
import {RegistrationService} from './registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  registrationForm: FormGroup;

  ngOnInit() {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), forbiddenNameValidator(/admin/)]],
      email: [''],
      subscribe: [false],
      password: [''],
      confirmPassword: [''],
      address: this.fb.group({
        city: [''],
        state: [''],
        postalCode: ['']
      }),
      alternateEmails: this.fb.array([])
    }, {validator: passwordValidator});

    this.registrationForm.get('subscribe').valueChanges
      .subscribe(checkedValue => {
        const email = this.registrationForm.get('email');
        if (checkedValue) {
          email.setValidators(Validators.required);
        } else {
          email.clearValidators();
        }
        email.updateValueAndValidity();
      });
  }

  get username() {
    return this.registrationForm.get('username');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get alternateEmails() {
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  addAlternateEmails() {
    this.alternateEmails.push(this.fb.control(''));
  }

  constructor(private fb: FormBuilder, private registrationService: RegistrationService) {}


 /* registrationForm = new FormGroup({
    username: new FormControl('Uvin'),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    address: new FormGroup({
      city: new FormControl(''),
      state: new FormControl(''),
      postalCode: new FormControl(''),
    })
    }
  );*/

  loadApiData() {
    this.registrationForm.setValue({
      username: 'Uvin',
      password: 'test',
      confirmPassword: 'test',
      address: {
        city: 'Malabe',
        state: 'Western',
        postalCode: '10115'
      }
    });
  }

  onSubmit() {
    console.log(this.registrationForm.value);
    this.registrationService.register(this.registrationForm.value)
      .subscribe(
        response => console.log('Success', response),
        error => console.error('Error!', error)
      );
  }
}
