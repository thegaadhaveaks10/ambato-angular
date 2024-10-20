import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form/form.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  formFields = [
    {
      id: 'emailInput',
      label: 'Email address',
      name: 'email',
      type: 'email',
      requiredMessage: 'Email address is required.',
    },
    {
      id: 'usernameInput',
      label: 'Username',
      name: 'username',
      type: 'text',
      requiredMessage: 'Username is required.',
    },
    {
      id: 'passwordInput',
      label: 'Password',
      name: 'password',
      type: 'password',
      requiredMessage: 'Password is required.',
    },
    {
      id: 'confirmPasswordInput',
      label: 'Confirm password',
      name: 'confirmPassword',
      type: 'password',
      requiredMessage: 'Confirm password is required.',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private formsService: FormService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]{3,15}$/)],
        ],
        password: [
          '',
          [Validators.required, this.formsService.passwordStrengthValidator],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.formsService.passwordMismatchValidator }
    ); // Correct placement for group-level validator
  }

  onSubmit(eventData: Form) {
    if (this.signupForm.valid) {
      // Form is valid, proceed with submission logic
      console.log('Form Submitted:', eventData);
    } else {
      // Form is invalid, handle error logic
      console.log('Form is invalid');
      this.signupForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
}
