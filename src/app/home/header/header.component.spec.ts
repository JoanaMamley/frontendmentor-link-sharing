import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../shared/services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService> = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
  authServiceSpy.logout.and.returnValue(of({
    message: 'logoout successful'
  }))

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        provideRouter(routes),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    it('should navigate to login page when logout has been clicked', fakeAsync(() => {
      const router = TestBed.inject(Router);
      const routerSpy = spyOn(router, 'navigateByUrl');

      component.logout();
      tick();

      expect(routerSpy).toHaveBeenCalledWith('/login');
    }))

    it('should call authAervice to logout', fakeAsync(() => {
      component.logout();
      tick();

      expect(authServiceSpy.logout).toHaveBeenCalled();
    }))
  })
});
