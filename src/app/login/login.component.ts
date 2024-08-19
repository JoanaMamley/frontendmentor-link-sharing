import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm?: FormGroup;

  constructor(private router: Router){}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl<null | string>(null, [Validators.required, Validators.email]),
      'password': new FormControl<null | string>(null, [Validators.required, Validators.minLength(8)]),
    })
  }

  onSubmit() {
    this.router.navigateByUrl('/home');
   }
 
   get email(): AbstractControl<any, any> | null | undefined {
     return this.loginForm?.get('email');
   }
 
   get password(): AbstractControl<any, any> | null | undefined {
     return this.loginForm?.get('password');
   }
}
