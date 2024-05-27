import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideModifyInfoComponent } from './guide-modify-info.component';

describe('GuideModifyInfoComponent', () => {
  let component: GuideModifyInfoComponent;
  let fixture: ComponentFixture<GuideModifyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideModifyInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuideModifyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
