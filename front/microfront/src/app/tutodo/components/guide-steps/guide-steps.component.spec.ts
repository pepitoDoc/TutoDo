import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideStepsComponent } from './guide-steps.component';

describe('GuideStepsComponent', () => {
  let component: GuideStepsComponent;
  let fixture: ComponentFixture<GuideStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideStepsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuideStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
