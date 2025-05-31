import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../shared/services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { GenericResponse } from '../shared/models/generic.model';
import { Validators } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService> = jasmine.createSpyObj<AuthService>('AuthService', ['login']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
          {provide: AuthService, useValue: authServiceSpy},
          provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize loginForm with email and password controls', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm?.get('email')).toBeTruthy();
      expect(component.loginForm?.get('password')).toBeTruthy();
    });
  });

  describe('onSubmit', () => {
    it('should call authService.login with form values when form is valid', async () => {
      const loginResponse: GenericResponse = { message: 'Login successful' };
      authServiceSpy.login.and.returnValue(Promise.resolve(loginResponse));
      component.loginForm?.setValue({ email: 'test@example.com', password: 'password123' });
      await component.onSubmit();
      expect(authServiceSpy.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    });
  });
});
