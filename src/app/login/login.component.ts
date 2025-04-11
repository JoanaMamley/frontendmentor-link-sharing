import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm?: FormGroup;
  loginError: string | null = null;
  subscriptions: Subscription[] = [];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl<null | string>(null, [Validators.required, Validators.email]),
      'password': new FormControl<null | string>(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSubmit() {
    if (this.loginForm?.valid) {
      const sub: Subscription = this.authService.login({
        email: this.loginForm?.value.email,
        password: this.loginForm?.value.password
      }).subscribe({
        next: () => {
          this.loginError = null;
          this.router.navigateByUrl('/home');
        },
        error: (err) => {
          this.loginError = err.error.message;
        }
      });

      this.subscriptions.push(sub);
    }
  }

  get email(): AbstractControl<any, any> | null | undefined {
    return this.loginForm?.get('email');
  }

  get password(): AbstractControl<any, any> | null | undefined {
    return this.loginForm?.get('password');
  }
}
