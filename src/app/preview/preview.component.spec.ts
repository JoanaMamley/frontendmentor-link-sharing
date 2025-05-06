import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewComponent } from './preview.component';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { User } from '../shared/models/user.model';

describe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;
  let RouterSpy: jasmine.SpyObj<Router> = jasmine.createSpyObj<Router>('Router', ['navigateByUrl'])
  let userServiceSpy: jasmine.SpyObj<UserService> = jasmine.createSpyObj<UserService>('UserService', ['getUser', 'getProfileImage'])
  const activatedRouteMock = {
    snapshot: {
      paramMap: convertToParamMap({ id: '123' }), // Simulates real paramMap
    },
  };
  let domSanitizerSpy: jasmine.SpyObj<DomSanitizer> = jasmine.createSpyObj<DomSanitizer>('DomSanitizer', ['bypassSecurityTrustUrl'])
  userServiceSpy.getProfileImage.and.returnValue(of({ size: 13, type: 'text/plain' } as Blob));
  const userMock: User = {
    id: 1,
    email: "john.doe@test.com",
    firstname: 'Joe',
    lastname: 'Doe',
    links: []
  }
  userServiceSpy.getUser.and.returnValue(of(userMock));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewComponent],
      providers: [
        {provide: Router, useValue: RouterSpy},
        {provide: UserService, useValue: userServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteMock },
        {provide: DomSanitizer, useValue: domSanitizerSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
