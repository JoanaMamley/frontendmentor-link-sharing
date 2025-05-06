import { TestBed } from '@angular/core/testing';

import { LinkService } from './link.service';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { of } from 'rxjs';

describe('LinkService', () => {
  let service: LinkService;
  const userMock: User = {
    id: 1,
    email: "john.doe@test.com",
    firstname: 'Joe',
    lastname: 'Doe',
    links: []
  }
  let userServiceSpy = jasmine.createSpyObj<UserService>('UserService', [], {currentUser$: of(userMock)})
  let httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['post', 'put', 'delete']);

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [
      {provide: UserService, useValue: userServiceSpy},
      {provide: HttpClient, useValue: httpSpy}]});
    service = TestBed.inject(LinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
