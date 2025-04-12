import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy{
  signUpForm?: FormGroup;
  registrationError: string | null = null;
  subscriptions: Subscription[] = [];

  constructor(private router: Router, private userService: UserService){}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      'email': new FormControl<null | string>(null, [Validators.required, Validators.email]),
      'password': new FormControl<null | string>(null, [Validators.required, Validators.minLength(8)]),
      'confirmPassword': new FormControl<null | string>(null, [Validators.required, Validators.minLength(8)])
    }, this.passwordMatchValidator())
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const passwordControl = formGroup.get('password');
      const confirmPasswordControl = formGroup.get('confirmPassword');

      if (passwordControl && confirmPasswordControl && passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  async onSubmit() {
    if (this.signUpForm?.valid) {
       await this.userService.register({
        email: this.signUpForm?.get('email')?.value,
        password: this.signUpForm?.get('password')?.value
      }).catch((error) => {
        this.registrationError = error.error.message;
      });
      this.router.navigate(['/login']);
    }
  }

  get email(): AbstractControl<any, any> | null | undefined {
    return this.signUpForm?.get('email');
  }

  get password(): AbstractControl<any, any> | null | undefined {
    return this.signUpForm?.get('password');
  }

  get confirmPassword(): AbstractControl<any, any> | null | undefined {
    return this.signUpForm?.get('confirmPassword');
  }

  get hasPasswordMismatchError(): boolean | undefined {
    return this.signUpForm?.invalid && this.signUpForm.hasError('passwordMismatch') && (this.confirmPassword?.touched || this.confirmPassword?.dirty) && (this.password?.touched || this.password?.dirty);
  }

}
