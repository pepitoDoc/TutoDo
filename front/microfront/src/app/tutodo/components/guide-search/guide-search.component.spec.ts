import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideSearchComponent } from './guide-search.component';

describe('GuideSearchComponent', () => {
  let component: GuideSearchComponent;
  let fixture: ComponentFixture<GuideSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuideSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
