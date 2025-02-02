import { TestBed } from '@angular/core/testing';
import { FormService } from './form.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

describe('FormService', () => {
  let service: FormService;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormService,
        FormBuilder
      ]
    });
    service = TestBed.inject(FormService);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Password Mismatch Validator Test Cases
   */
  describe('Password Mismatch Validator', () => {
    function createFormGroup(password: any, confirmPassword: any): FormGroup {
      return formBuilder.group({
        password: [password],
        confirmPassword: [confirmPassword]
      });
    }

    it('should return passwordsMismatch error when passwords do not match', () => {
      const formGroup = createFormGroup('Akash@12345', 'Akash@1234');
      expect(service.passwordMismatchValidator(formGroup)).toEqual({ passwordsMismatch: true });
    });

    it('should return null when passwords match', () => {
      const formGroup = createFormGroup('Akash@1234', 'Akash@1234');
      expect(service.passwordMismatchValidator(formGroup)).toBeNull();
    });

    it('should return passwordsMismatch error when confirmPassword is missing', () => {
      const formGroup = createFormGroup('Akash@1234', '');
      expect(service.passwordMismatchValidator(formGroup)).toEqual({ passwordsMismatch: true });
    });

    it('should return passwordsMismatch error when password is missing', () => {
      const formGroup = createFormGroup('', 'Akash@1234');
      expect(service.passwordMismatchValidator(formGroup)).toEqual({ passwordsMismatch: true });
    });

    it('should return null when both password and confirmPassword are empty', () => {
      const formGroup = createFormGroup('', '');
      expect(service.passwordMismatchValidator(formGroup)).toBeNull();
    });

    it('should return null when both password and confirmPassword are null', () => {
      const formGroup = createFormGroup(null, null);
      expect(service.passwordMismatchValidator(formGroup)).toBeNull();
    });

    it('should return null when both password and confirmPassword are undefined', () => {
      const formGroup = createFormGroup(undefined, undefined);
      expect(service.passwordMismatchValidator(formGroup)).toBeNull();
    });

    it('should return null if FormGroup does not contain password fields', () => {
      const formGroup = formBuilder.group({ email: ['test@example.com'] });
      expect(service.passwordMismatchValidator(formGroup)).toBeNull();
    });
  });

  /**
   * Password Strength Validator Test Cases
   */
  describe('Password Strength Validator', () => {
    it('should return passwordStrength error if password is too weak (only letters)', () => {
      const control = new FormControl('weakpassword');
      expect(service.passwordStrengthValidator(control)).toEqual({ passwordStrength: true });
    });

    it('should return passwordStrength error if password contains only numbers', () => {
      const control = new FormControl('1234567890');
      expect(service.passwordStrengthValidator(control)).toEqual({ passwordStrength: true });
    });

    it('should return passwordStrength error if password contains only lowercase letters', () => {
      const control = new FormControl('passwordonlylowercase');
      expect(service.passwordStrengthValidator(control)).toEqual({ passwordStrength: true });
    });

    it('should return passwordStrength error if password contains only uppercase letters', () => {
      const control = new FormControl('PASSWORDONLYUPPERCASE');
      expect(service.passwordStrengthValidator(control)).toEqual({ passwordStrength: true });
    });

    it('should return passwordStrength error if password contains no special characters', () => {
      const control = new FormControl('Password123');
      expect(service.passwordStrengthValidator(control)).toEqual({ passwordStrength: true });
    });

    it('should return passwordStrength error if password is shorter than 8 characters', () => {
      const control = new FormControl('A@12');
      expect(service.passwordStrengthValidator(control)).toEqual({ passwordStrength: true });
    });

    it('should return null if password meets all requirements', () => {
      const control = new FormControl('Akash@1234');
      expect(service.passwordStrengthValidator(control)).toBeNull();
    });

    it('should return passwordStrength error if password is an empty string', () => {
      const control = new FormControl('');
      expect(service.passwordStrengthValidator(control)).toEqual({ passwordStrength: true });
    });

    it('should return passwordStrength error if password is null', () => {
      const control = new FormControl(null);
      expect(service.passwordStrengthValidator(control)).toEqual({ passwordStrength: true });
    });

    it('should return passwordStrength error if password is undefined', () => {
      const control = new FormControl(undefined);
      expect(service.passwordStrengthValidator(control)).toEqual({ passwordStrength: true });
    });

    it('should return null for a very strong password', () => {
      const control = new FormControl('Str0ngP@ssw0rd!');
      expect(service.passwordStrengthValidator(control)).toBeNull();
    });

    it('should return passwordStrength error if password does not contain a special character from allowed set', () => {
      const control = new FormControl('Password123'); // No special character
      expect(service.passwordStrengthValidator(control)).toEqual({ passwordStrength: true });
    });

    it('should return null if password contains at least one allowed special character', () => {
      const control = new FormControl('SecureP@ssword1!');
      expect(service.passwordStrengthValidator(control)).toBeNull();
    });

    it('should return null if password contains multiple allowed special characters', () => {
      const control = new FormControl('My$ecureP@ssw0rd#2023!');
      expect(service.passwordStrengthValidator(control)).toBeNull();
    });
  });
});
