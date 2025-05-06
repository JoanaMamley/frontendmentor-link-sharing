import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['post', 'put', 'get']);

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [
      {provide: HttpClient, useValue: httpSpy}]});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
