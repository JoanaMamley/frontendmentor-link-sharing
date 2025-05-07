import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { of, Subscription, throwError } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LinkService } from '../shared/services/link.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const userMock: User = {
    id: 1,
    email: "john.doe@test.com",
    firstname: 'Joe',
    lastname: 'Doe',
    links: []
  }
  let userServiceSpy: jasmine.SpyObj<UserService> = jasmine.createSpyObj<UserService>('UserService', ['getCurrentUser', 'setCurrentUser']);
  let linkServiceSpy = jasmine.createSpyObj('LinkService', ['loadSavedLinks'], {links$: of([])});
  linkServiceSpy.loadSavedLinks.and.returnValue(of([]));
  let subscriptionSpy: jasmine.SpyObj<Subscription> = jasmine.createSpyObj<Subscription>('Subscription', ['unsubscribe']);
  userServiceSpy.getCurrentUser.and.returnValue(of(userMock))


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {provide: UserService, useValue: userServiceSpy},
        provideHttpClient(),
        { provide: LinkService, useValue: linkServiceSpy },
        provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    userServiceSpy.currentUser$ = of(userMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call UserService for current user', () => {
      expect(userServiceSpy.getCurrentUser).toHaveBeenCalled();
    })

    it('should update current user', () => {
      expect(userServiceSpy.setCurrentUser).toHaveBeenCalled();
    })


    it('should navigate to login page if it encounters an error', () => {
      const router = TestBed.inject(Router);
      const routerSpy = spyOn(router, 'navigateByUrl');
      const consoleErrorSpy = spyOn(console, 'error');

      userServiceSpy.getCurrentUser.and.returnValue(throwError(() => new Error('User not found')));
      component.ngOnInit();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching current user:', jasmine.any(Error));
      expect(routerSpy).toHaveBeenCalledWith('/login');
    });
  })

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all observables', () => {
      component.subscriptions = [subscriptionSpy]
      component.ngOnDestroy();

      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    })
  })
});
