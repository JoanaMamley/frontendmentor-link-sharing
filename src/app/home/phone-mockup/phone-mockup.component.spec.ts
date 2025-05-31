import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhoneMockupComponent } from './phone-mockup.component';
import { UserService } from '../../shared/services/user.service';
import { LinkService } from '../../shared/services/link.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { Link, LINKDETAILS, LinkOptionDetail } from '../../shared/models/link.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PhoneMockupComponent', () => {
  let component: PhoneMockupComponent;
  let fixture: ComponentFixture<PhoneMockupComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let linkServiceSpy: jasmine.SpyObj<LinkService>;
  let domSanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  const userMock: User = {
    id: 1,
    email: "john.doe@test.com",
    firstname: 'Joe',
    lastname: 'Doe',
    links: []
  };

  const linkMock: Link[] = [
    { id: 1, link_type: 'github', link_url: 'https://github.com/user', isEditing: false },
    { id: 2, link_type: 'linkedin', link_url: 'https://linkedin.com/in/user', isEditing: true }
  ];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['getProfileImage'], { 
      currentUser$: of(userMock) 
    });
    userServiceSpy.getProfileImage.and.returnValue(of(new Blob(['profile image'], { type: 'image/png' })));
    
    linkServiceSpy = jasmine.createSpyObj<LinkService>('LinkService', [], { 
      links$: of(linkMock) 
    });
    
    domSanitizerSpy = jasmine.createSpyObj<DomSanitizer>('DomSanitizer', ['bypassSecurityTrustUrl']);
    domSanitizerSpy.bypassSecurityTrustUrl.and.returnValue('safe-url' as SafeUrl);
    
    await TestBed.configureTestingModule({
      imports: [PhoneMockupComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: LinkService, useValue: linkServiceSpy },
        { provide: DomSanitizer, useValue: domSanitizerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneMockupComponent);
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

    it('should subscribe to linkService.links$ and filter out editing links', () => {
      expect(component.userLinks).toEqual([linkMock[0]]);
    });

    it('should call loadProfileImage when user is set', () => {
      spyOn(component, 'loadProfileImage');
      component.ngOnInit();
      expect(component.loadProfileImage).toHaveBeenCalled();
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

  describe('fetchLinkDetails', () => {
    it('should return link details for given link type', () => {
      const linkType = 'github';
      const details = component.fetchLinkDetails(linkType);
      expect(details).toEqual(LINKDETAILS[linkType]);
    });
  });

  describe('ngOnDestroy', () => {
    // it('should unsubscribe from all subscriptions', () => {
    //   component.subscriptions.forEach(sub => spyOn(sub, 'unsubscribe'));
    //   component.ngOnDestroy();
    //   component.subscriptions.forEach(sub => expect(sub.unsubscribefication).toHaveBeenCalled());
    // });

    it('should handle empty subscriptions array', () => {
      component.subscriptions = [];
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});