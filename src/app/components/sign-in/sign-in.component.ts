import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  signInForm!: FormGroup;
  isSubmitted = false;
  invalidCredentials = false;

  formFields = [
    {
      id: 'emailInput',
      label: 'Email address or username',
      name: 'usernameOrEmail',
      type: 'text',
      autocomplete: 'username',
      requiredMessage: 'Email address or username is required.',
    },
    {
      id: 'passwordInput',
      label: 'Password',
      name: 'password',
      type: 'password',
      autocomplete: 'current-password',
      requiredMessage: 'Password is required.',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm(); // Initialize the sign-in form
    this.resetInvalidCredentialsOnChange(); // Reset invalid credentials flag on form value change
  }

  /**
   * Initializes the sign-in form with validation rules.
   */
  private initializeForm(): void {
    this.signInForm = this.formBuilder.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * Resets the invalid credentials flag when the user types in either input field.
   */
  private resetInvalidCredentialsOnChange(): void {
    this.signInForm.valueChanges.subscribe(() => {
      this.invalidCredentials = false;
    });
  }

  /**
   * Handles the form submission.
   * Validates the form and proceeds to authenticate the user if valid.
   */
  onSubmit(): void {
    this.isSubmitted = true; // Mark form as submitted

    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched(); // Show validation errors for all fields
      console.log('Form is invalid');
      return; // Exit if the form is invalid
    }

    this.authenticateUser(); // Proceed with user authentication
  }

  /**
   * Authenticates the user by checking the provided username or email and password.
   */
  private authenticateUser(): void {
    const { usernameOrEmail, password } = this.signInForm.value;

    this.usersService.validateUser({ usernameOrEmail, password }).subscribe(
      (isUserExists: boolean) => this.handleAuthenticationResponse(isUserExists) // Handle response based on user existence
    ),
      (error: Error) => this.handleError(error); // Handle any errors during the authentication request;
  }

  /**
   * Handles the response from the authentication check.
   * Navigates to the food catalog if the user exists, otherwise shows an error.
   *
   * @param isUserExists - Indicates if the user credentials are valid.
   */
  private handleAuthenticationResponse(isUserExists: boolean): void {
    if (isUserExists) {
      alert('User logged in successfully...'); // Notify successful login
      this.router.navigateByUrl('food-catalogue'); // Navigate to the food catalogue
    } else {
      this.invalidCredentials = true; // Show invalid credentials error
      console.log('User does not exist in the system');
    }
  }

  /**
   * Handles errors that occur during the authentication process.
   *
   * @param error - The error object containing error details.
   */
  private handleError(error: Error): void {
    console.error('Error during authentication:', error.message); // Log the error for debugging
  }

  /**
   * Determines whether the login button should be disabled based on form validity
   * and whether the login attempt has been submitted with invalid credentials.
   *
   * @returns {boolean} - Returns true if the form is invalid or if the form was submitted with invalid credentials,
   *                      otherwise false.
   */
  disableLoginButton(): boolean {
    return (
      this.signInForm.invalid || (this.isSubmitted && this.invalidCredentials)
    );
  }
}
