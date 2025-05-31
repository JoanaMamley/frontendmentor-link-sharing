import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkItemComponent } from './link-item.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { NoopAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { Link, LINKDETAILS } from '../../../shared/models/link.model';

class MatSnackBarStub {
  open() {
    return {
      onAction: () => ({ subscribe: () => ({}) })
    };
  }
}

describe('LinkItemComponent', () => {
  let component: LinkItemComponent;
  let fixture: ComponentFixture<LinkItemComponent>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  const mockLink: Link = {
    id: 73,
    link_type: 'github',
    link_url: 'https://github.com/test_link_share_user'
  };

  beforeEach(async () => {
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    
    await TestBed.configureTestingModule({
      imports: [
        LinkItemComponent,
        MatSnackBarModule,
        ReactiveFormsModule,
        DropdownModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
      ],
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy },
         provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkItemComponent);
    component = fixture.componentInstance;
    component.link = mockLink;
    component.linkNumber = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize linkForm with link data', () => {
      component.ngOnInit();
      expect(component.linkForm).toBeDefined();
      expect(component.linkForm?.get('linkType')?.value).toBe(mockLink.link_type);
      expect(component.linkForm?.get('linkUrl')?.value).toBe(mockLink.link_url);
    });

    it('should set currentLinkType from input link', () => {
      component.ngOnInit();
      expect(component.currentLinkType).toBe(mockLink.link_type);
    });

    it('should set form validators', () => {
      component.ngOnInit();
      expect(component.linkForm?.get('linkType')?.hasValidator(Validators.required)).toBeTrue();
      expect(component.linkForm?.get('linkUrl')?.hasValidator(Validators.required)).toBeTrue();
    });
  });

  describe('saveLink', () => {
    it('should emit save event for new link (id = -1)', () => {
      const emitSpy = spyOn(component.save, 'emit');
      component.link.id = -1;
      component.linkForm?.setValue({
        linkType: 'github',
        linkUrl: 'https://github.com/test_user'
      });
      
      component.saveLink();
      
      expect(emitSpy).toHaveBeenCalledWith({
        link_type: 'github',
        link_url: 'https://github.com/test_user'
      });
      expect(component.linkForm?.pristine).toBeTrue();
    });
  });

  describe('deleteLink', () => {
    it('should emit delete event with link id', () => {
      const emitSpy = spyOn(component.delete, 'emit');
      
      component.deleteLink();
      
      expect(emitSpy).toHaveBeenCalledWith(mockLink.id);
    });
  });

  describe('getters', () => {
    describe('linkType', () => {
      it('should return linkType form control', () => {
        expect(component.linkType).toBe(component.linkForm?.get('linkType'));
      });
    });

    describe('linkUrl', () => {
      it('should return linkUrl form control', () => {
        expect(component.linkUrl).toBe(component.linkForm?.get('linkUrl'));
      });
    });

    describe('linkOptions', () => {
      it('should return array of link type keys', () => {
        const expectedKeys = Object.keys(LINKDETAILS);
        expect(component.linkOptions).toEqual(expectedKeys);
      });
    });
  });

  describe('fetchLinkDetails', () => {
    it('should return link details for given link type', () => {
      const linkType = 'github';
      const details = component.fetchLinkDetails(linkType);
      expect(details).toEqual(LINKDETAILS[linkType]);
    });
  });
});