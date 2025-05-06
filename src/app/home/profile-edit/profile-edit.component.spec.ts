import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditComponent } from './profile-edit.component';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../shared/models/user.model';
import { of } from 'rxjs';

describe('ProfileEditComponent', () => {
  let component: ProfileEditComponent;
  let fixture: ComponentFixture<ProfileEditComponent>;
  let RouterSpy: jasmine.SpyObj<Router> = jasmine.createSpyObj<Router>('Router', ['navigateByUrl'])
  let userServiceSpy: jasmine.SpyObj<UserService> = jasmine.createSpyObj<UserService>('UserService', ['getUser', 'getProfileImage'])
  let domSanitizerSpy: jasmine.SpyObj<DomSanitizer> = jasmine.createSpyObj<DomSanitizer>('DomSanitizer', ['bypassSecurityTrustUrl'])
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar> = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open'])


  beforeEach(async () => {
    const userMock: User = {
      id: 1,
      email: "john.doe@test.com",
      firstname: 'Joe',
      lastname: 'Doe',
      links: []
    }

    await TestBed.configureTestingModule({
      imports: [ProfileEditComponent, MatSnackBarModule],
      providers: [
        {provide: Router, useValue: RouterSpy},
        {provide: UserService, useValue: userServiceSpy},
        {provide: DomSanitizer, useValue: domSanitizerSpy},
        {provide: MatSnackBar, useValue: matSnackBarSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileEditComponent);
    component = fixture.componentInstance;
    userServiceSpy.currentUser$ = of(userMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
