import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneMockupComponent } from './phone-mockup.component';
import { UserService } from '../../shared/services/user.service';
import { of } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { LinkService } from '../../shared/services/link.service';
import { DomSanitizer } from '@angular/platform-browser';

describe('PhoneMockupComponent', () => {
  let component: PhoneMockupComponent;
  let fixture: ComponentFixture<PhoneMockupComponent>;
  const userMock: User = {
      id: 1,
      email: "john.doe@test.com",
      firstname: 'Joe',
      lastname: 'Doe',
      links: []
  }
  let userServiceSpy: jasmine.SpyObj<UserService> = jasmine.createSpyObj<UserService>('UserService', ['getProfileImage'], {currentUser$: of(userMock)});
  userServiceSpy.getProfileImage.and.returnValue(of({ size: 13, type: 'text/plain' } as Blob));
  let linkServiceSpy: jasmine.SpyObj<LinkService>  = jasmine.createSpyObj<LinkService>('LinkService', [], {links$: of([])});
  let domSanitizerSpy: jasmine.SpyObj<DomSanitizer> = jasmine.createSpyObj<DomSanitizer>('DomSanitizer', ['bypassSecurityTrustUrl'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneMockupComponent],
      providers: [
        {provide: UserService, useValue: userServiceSpy},
        {provide: LinkService, useValue: linkServiceSpy},
        {provide: DomSanitizer, useValue: domSanitizerSpy},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneMockupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
