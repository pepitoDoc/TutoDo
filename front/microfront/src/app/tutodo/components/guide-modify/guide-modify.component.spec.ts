import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideModifyComponent } from './guide-modify.component';

describe('GuideStepsComponent', () => {
  let component: GuideModifyComponent;
  let fixture: ComponentFixture<GuideModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideModifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuideModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
