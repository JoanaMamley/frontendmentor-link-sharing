import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinksComponent } from './links.component';
import { LinkService } from '../../shared/services/link.service';
import { of, Subscription, throwError } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Link } from '../../shared/models/link.model';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('LinksComponent', () => {
  let component: LinksComponent;
  let fixture: ComponentFixture<LinksComponent>;
  const link: Link = {
    id: 75,
    link_type: 'github',
    link_url: 'https://github.com/test_link_share_user'
  }
  let linkServiceSpy: jasmine.SpyObj<LinkService> ;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let linkMock: Link;


  beforeEach(async () => {
    linkMock = {
      id: 73,
      link_type: 'github',
      link_url: 'https://github.com/test_link_share_user'
    }
    linkServiceSpy = jasmine.createSpyObj<LinkService>('LinkService', ['addNewLink', 'saveLink', 'updateLink', 'removeNewLink', 'deleteLink'], {links$: of([link])})
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    snackBarSpy.open.and.stub();

    await TestBed.configureTestingModule({
      imports: [LinksComponent, MatSnackBarModule],
      providers: [
        {provide: LinkService, useValue: linkServiceSpy},
        {provide: MatSnackBar , useValue: snackBarSpy},
        provideAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it("should call linkService to get current user's links", () => {
      expect(component.links).toEqual([link]);
    })

    it('should add link observable subscription to collected list of subscriptions', () => {
      expect(component.subscriptions.length).toBeGreaterThan(0);
    })
  })

  describe('save link', () => {
    it('should call addNewLink from linkService to create new link when the CREATE NEW LINK button link', () => {
      component.addNewLink();
      expect(linkServiceSpy.addNewLink).toHaveBeenCalled();
    });

    it('should call linkService.saveLink with the correct parameter', () => {
      linkServiceSpy.saveLink.and.returnValue(of('Link saved successfully'));
      component.saveLink(linkMock);
      expect(linkServiceSpy.saveLink).toHaveBeenCalledWith(linkMock);
    });

    it('should save link and remove editing mode if user saves it', () => {
      linkServiceSpy.saveLink.and.returnValue(of('Link created successfully'));
      component.saveLink(linkMock);

      expect(linkServiceSpy.saveLink).toHaveBeenCalled();
    })


  it('should call component snackbar when opened directly', () => {
    linkServiceSpy.saveLink.and.returnValue(of('Link saved successfully'));
    spyOn(component.snackBar,"open").and.callThrough();
    component.saveLink(linkMock);
    expect(component.snackBar.open).toHaveBeenCalled();
  });

    it('should add the subscription to the subscriptions array', () => {
      linkServiceSpy.saveLink.and.returnValue(of('Link saved successfully'));
      component.saveLink(linkMock);
      expect(component.subscriptions[0] instanceof Subscription).toBe(true);
    });
  })

  describe('updateLink', () => {
    it('should call linkService.updateLink with correct parameters', () => {
      const updatedLink = { id: 73, link_type: 'github', link_url: 'https://github.com/updated_user' };
      linkServiceSpy.updateLink.and.returnValue(of('Link updated successfully'));

      component.updateLink(updatedLink, 73);

      expect(linkServiceSpy.updateLink).toHaveBeenCalledWith(73, updatedLink);
    });

    it('should show success snackbar when link update is successful', () => {
      linkServiceSpy.updateLink.and.returnValue(of('Link updated successfully'));
      spyOn(component.snackBar, 'open').and.callThrough();

      component.updateLink(linkMock, 73);

      expect(component.snackBar.open).toHaveBeenCalledWith(
        'Link updated successfully',
        'Close',
        jasmine.objectContaining({
          duration: 2000,
          panelClass: ['snackbar-success']
        })
      );
    });

    it('should show error snackbar when link update fails', () => {
      linkServiceSpy.updateLink.and.returnValue(throwError(() => new Error('Update failed')));
      spyOn(component.snackBar, 'open').and.callThrough();

      component.updateLink(linkMock, 73);

      expect(component.snackBar.open).toHaveBeenCalledWith(
        'Failed to update link',
        'Close',
        jasmine.objectContaining({
          duration: 2000,
          panelClass: ['snackbar-error']
        })
      );
    });

    it('should add the subscription to the subscriptions array', () => {
      linkServiceSpy.updateLink.and.returnValue(of('Link updated successfully'));
      const initialSubscriptionCount = component.subscriptions.length;

      component.updateLink(linkMock, 73);

      expect(component.subscriptions.length).toBe(initialSubscriptionCount + 1);
      expect(component.subscriptions[initialSubscriptionCount] instanceof Subscription).toBe(true);
    });
  })

  describe('deleteLink', () => {
    it('should call removeNewLink when id is -1', () => {
      linkServiceSpy.removeNewLink.and.returnValue();
      spyOn(component.snackBar, 'open').and.callThrough();

      component.deleteLink(-1);

      expect(linkServiceSpy.removeNewLink).toHaveBeenCalled();
      expect(component.snackBar.open).toHaveBeenCalledWith(
        'Link deleted successfully',
        'Close',
        jasmine.objectContaining({
          duration: 2000,
          panelClass: ['snackbar-success']
        })
      );
    });

    it('should call linkService.deleteLink with correct id when id is not -1', () => {
      linkServiceSpy.deleteLink.and.returnValue(of('Link deleted successfully'));

      component.deleteLink(73);

      expect(linkServiceSpy.deleteLink).toHaveBeenCalledWith(73);
    });

    it('should show success snackbar when link deletion is successful', () => {
      linkServiceSpy.deleteLink.and.returnValue(of('Link deleted successfully'));
      spyOn(component.snackBar, 'open').and.callThrough();

      component.deleteLink(73);

      expect(component.snackBar.open).toHaveBeenCalledWith(
        'Link deleted successfully',
        'Close',
        jasmine.objectContaining({
          duration: 2000,
          panelClass: ['snackbar-success']
        })
      );
    });

    it('should show error snackbar when link deletion fails', () => {
      linkServiceSpy.deleteLink.and.returnValue(throwError(() => new Error('Deletion failed')));
      spyOn(component.snackBar, 'open').and.callThrough();

      component.deleteLink(73);

      expect(component.snackBar.open).toHaveBeenCalledWith(
        'Failed to delete link',
        'Close',
        jasmine.objectContaining({
          duration: 2000,
          panelClass: ['snackbar-error']
        })
      );
    });

    it('should add the subscription to the subscriptions array when id is not -1', () => {
      linkServiceSpy.deleteLink.and.returnValue(of('Link deleted successfully'));
      const initialSubscriptionCount = component.subscriptions.length;

      component.deleteLink(73);

      expect(component.subscriptions.length).toBe(initialSubscriptionCount + 1);
      expect(component.subscriptions[initialSubscriptionCount] instanceof Subscription).toBe(true);
    });
  })

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all observables', () => {
      let subscriptionSpy: jasmine.SpyObj<Subscription> = jasmine.createSpyObj<Subscription>('Subscription', ['unsubscribe']);
      component.subscriptions = [subscriptionSpy]
      component.ngOnDestroy();

      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    })
  })
});
