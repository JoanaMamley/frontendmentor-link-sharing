import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileEditComponent } from './profile-edit.component';
import { UserService } from '../../shared/services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorResponse } from '@angular/common/http';

describe('ProfileEditComponent', () => {
  let component: ProfileEditComponent;
  let fixture: ComponentFixture<ProfileEditComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let domSanitizerSpy: jasmine.SpyObj<DomSanitizer>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const userMock: User = {
    id: 1,
    email: "john.doe@test.com",
    firstname: 'Joe',
    lastname: 'Doe',
    links: []
  };

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', [
      'getProfileImage',
      'updateUser',
      'uploadProfileImage',
      'setCurrentUser'
    ], {
      currentUser$: of(userMock)
    });
    userServiceSpy.getProfileImage.and.returnValue(of(new Blob(['profile image'], { type: 'image/png' })));
    userServiceSpy.updateUser.and.returnValue(of(userMock));
    userServiceSpy.uploadProfileImage.and.returnValue(of({}));

    domSanitizerSpy = jasmine.createSpyObj<DomSanitizer>('DomSanitizer', ['bypassSecurityTrustUrl']);
    domSanitizerSpy.bypassSecurityTrustUrl.and.returnValue('safe-url' as SafeUrl);

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ProfileEditComponent,
        MatSnackBarModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: DomSanitizer, useValue: domSanitizerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to userService.currentUser$ and set user', () => {
      expect(component.user).toEqual(userMock);
    });

    it('should initialize profileForm with user data', () => {
      expect(component.profileForm).toBeDefined();
      expect(component.profileForm?.get('firstname')?.value).toBe(userMock.firstname);
      expect(component.profileForm?.get('lastname')?.value).toBe(userMock.lastname);
      expect(component.profileForm?.get('email')?.value).toBe(userMock.email);
    });

    it('should call loadProfileImage when user is set', () => {
      spyOn(component, 'loadProfileImage');
      component.ngOnInit();
      expect(component.loadProfileImage).toHaveBeenCalled();
    });

    it('should add subscription to subscriptions array', () => {
      expect(component.subscriptions.length).toBe(2);
    });
  });

  describe('updateProfile', () => {
    it('should call userService.updateUser with updated user data', () => {
      component.profileForm?.setValue({
        firstname: 'Updated',
        lastname: 'User',
        email: 'updated@example.com'
      });
      component.updateProfile();
      expect(userServiceSpy.updateUser).toHaveBeenCalledWith({
        email: 'updated@example.com',
        firstname: 'Updated',
        lastname: 'User'
      }, userMock.id);
    });

    it('should set current user on successful update', () => {
      component.updateProfile();
      expect(userServiceSpy.setCurrentUser).toHaveBeenCalledWith(userMock);
    });

    it('should navigate to login on HttpErrorResponse', () => {
      userServiceSpy.updateUser.and.returnValue(throwError(() => new HttpErrorResponse({})));
      component.updateProfile();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
    });

    it('should not call updateUser if form is invalid', () => {
      component.profileForm?.setErrors({ invalid: true });
      component.updateProfile();
      expect(userServiceSpy.updateUser).not.toHaveBeenCalled();
    });

    it('should add subscription to subscriptions array', () => {
      const initialLength = component.subscriptions.length;
      component.updateProfile();
      expect(component.subscriptions.length).toBe(initialLength + 1);
    });
  });

  describe('onFileSelected', () => {
    it('should call userService.uploadProfileImage with selected file', () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      const event = { target: { files: [file] } } as unknown as Event;
      component.onFileSelected(event);
      expect(userServiceSpy.uploadProfileImage).toHaveBeenCalledWith(file);
    });

    it('should call loadProfileImage on successful upload', () => {
      spyOn(component, 'loadProfileImage');
      const file = new File([''], 'test.png', { type: 'image/png' });
      const event = { target: { files: [file] } } as unknown as Event;
      component.onFileSelected(event);
      expect(component.loadProfileImage).toHaveBeenCalled();
    });

    it('should set errorMessage on upload failure', () => {
      userServiceSpy.uploadProfileImage.and.returnValue(throwError(() => new Error('Upload failed')));
      const file = new File([''], 'test.png', { type: 'image/png' });
      const event = { target: { files: [file] } } as unknown as Event;
      component.onFileSelected(event);
      expect(component.errorMessage).toBe('Upload failed: Upload failed');
    });
  });

  describe('loadProfileImage', () => {
    it('should set profileImageUrl to safe URL when image is loaded successfully', () => {
      component.loadProfileImage();
      expect(userServiceSpy.getProfileImage).toHaveBeenCalledWith(userMock.id);
      expect(domSanitizerSpy.bypassSecurityTrustUrl).toHaveBeenCalled();
      expect(component.profileImageUrl).toBe('safe-url');
    });

    it('should set profileImageUrl to default image when 404 error occurs', () => {
      userServiceSpy.getProfileImage.and.returnValue(throwError(() => ({ status: 404 })));
      component.loadProfileImage();
      expect(component.profileImageUrl).toBe('images/empty_profile_image.png');
    });

    it('should set errorMessage when other errors occur', () => {
      userServiceSpy.getProfileImage.and.returnValue(throwError(() => ({ status: 500 })));
      component.loadProfileImage();
      expect(component.errorMessage).toBe('Failed to load profile image');
    });

    it('should add subscription to subscriptions array', () => {
      const initialLength = component.subscriptions.length;
      component.loadProfileImage();
      expect(component.subscriptions.length).toBe(initialLength + 1);
    });
  });

  describe('getters', () => {
    it('should return email form control', () => {
      expect(component.email).toBe(component.profileForm?.get('email'));
    });

    it('should return firstname form control', () => {
      expect(component.firstname).toBe(component.profileForm?.get('firstname'));
    });

    it('should return lastname form control', () => {
      expect(component.lastname).toBe(component.profileForm?.get('lastname'));
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      component.subscriptions.forEach(sub => spyOn(sub, 'unsubscribe'));
      component.ngOnDestroy();
      component.subscriptions.forEach(sub => expect(sub.unsubscribe).toHaveBeenCalled());
    });

    it('should revoke object URL if it exists', () => {
      spyOn(URL, 'revokeObjectURL');
      component['profileObjectUrl'] = 'blob:http://example.com';
      component.ngOnDestroy();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://example.com');
    });
  });
});