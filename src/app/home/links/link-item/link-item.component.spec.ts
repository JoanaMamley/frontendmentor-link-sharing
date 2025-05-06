import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkItemComponent } from './link-item.component';

describe('LinkItemComponent', () => {
  let component: LinkItemComponent;
  let fixture: ComponentFixture<LinkItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkItemComponent);
    component = fixture.componentInstance;
    component.link = {
      id: 73,
      link_type: 'github',
      link_url: 'https://github.com/test_link_share_user'
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
