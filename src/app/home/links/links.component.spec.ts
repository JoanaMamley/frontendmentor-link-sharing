import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksComponent } from './links.component';
import { LinkService } from '../../shared/services/link.service';
import { of } from 'rxjs';

describe('LinksComponent', () => {
  let component: LinksComponent;
  let fixture: ComponentFixture<LinksComponent>;
  let linkServiceSpy: jasmine.SpyObj<LinkService>  = jasmine.createSpyObj<LinkService>('LinkService', ['addNewLink', 'saveLink', 'updateLink', 'removeNewLink', 'deleteLink'], {links$: of([])})

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinksComponent],
      providers: [
        {provide: LinkService, useValue: linkServiceSpy}
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
});
