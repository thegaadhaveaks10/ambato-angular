import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUserInfo } from 'src/app/interfaces/user-info';
import { FormService } from 'src/app/services/form/form.service';
import { UsersService } from 'src/app/services/users/users.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
    private formsService: FormService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  // Separate method for initializing the form
  private initializeForm(): void {
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
    );
  }

  // Form submission logic
  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched(); // Show errors if invalid
      return;
    }

    const { email, username, password } = this.signupForm.value;

    const newUser: IUserInfo = { email, username, password };

    this.usersService
      .addNewUser(newUser)
      .pipe(
        catchError((error) => {
          console.error('Error occurred while adding a new user.', error);
          alert('Error occurred. Please try again.');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          alert('New user has been added successfully!');
          console.log('User added successfully:', response);
        }
      });
  }
}
