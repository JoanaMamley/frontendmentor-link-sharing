import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  signUpForm?: FormGroup;
  subscription?: Subscription;

  constructor(private router: Router){}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      'email': new FormControl<null | string>(null, [Validators.required, Validators.email]),
      'password': new FormControl<null | string>(null, [Validators.required, Validators.min(8)]),
      'confirmPassword': new FormControl<null | string>(null, [Validators.required, Validators.min(8)])
    }, this.passwordMatchValidator())
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

  onSubmit() {
   this.router.navigateByUrl('/login');
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
