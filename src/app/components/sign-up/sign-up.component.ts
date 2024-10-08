import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signupForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(eventData: Form) {
    console.log("onsubmit data", eventData);
  }
}
