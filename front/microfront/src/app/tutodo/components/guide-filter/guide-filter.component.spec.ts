import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideFilterComponent } from './guide-filter.component';

describe('GuideFilterComponent', () => {
  let component: GuideFilterComponent;
  let fixture: ComponentFixture<GuideFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuideFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
