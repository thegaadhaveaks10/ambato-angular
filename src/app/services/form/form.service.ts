import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

  /**
   * Validates the strength of the password.
   * Checks for at least one uppercase letter, one lowercase letter,
   * one numeric digit, one special character, and a minimum length of 8.
   * @param control - The form control to validate.
   * @returns Validation error object if the password is weak; otherwise null.
   */
  public passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const controlValue = control.value || '';
    const upperCaseValidator = /[A-Z]+/.test(controlValue);
    const lowerCaseValidator = /[a-z]+/.test(controlValue);
    const numericValidator = /[0-9]+/.test(controlValue);
    const specialCharacterValidator = /[!@#$%^&*(),.?":{}|<>]+/.test(
      controlValue
    );
    const passwordLengthValidator = controlValue.length >= 8;

    const passwordValid =
      upperCaseValidator &&
      lowerCaseValidator &&
      numericValidator &&
      specialCharacterValidator &&
      passwordLengthValidator;

    return !passwordValid ? { passwordStrength: true } : null;
  }

  /**
   * Validates that the password and confirm password fields match.
   * @param formGroup - The form group containing password fields.
   * @returns Validation error object if passwords do not match; otherwise null.
   */
  public passwordMismatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password !== confirmPassword ? { passwordsMismatch: true } : null;
  }
}
