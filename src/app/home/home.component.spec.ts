import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { of } from 'rxjs';
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
  userServiceSpy.getCurrentUser.and.returnValue(of(userMock))
  let routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl'])
  let linkServiceSpy = jasmine.createSpyObj('LinkService', ['loadSavedLinks'], {links$: of([])});
  linkServiceSpy.loadSavedLinks.and.returnValue(of([]));


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
});
