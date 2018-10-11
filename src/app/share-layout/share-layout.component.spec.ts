import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareLayoutComponent } from './share-layout.component';

describe('ShareLayoutComponent', () => {
  let component: ShareLayoutComponent;
  let fixture: ComponentFixture<ShareLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
