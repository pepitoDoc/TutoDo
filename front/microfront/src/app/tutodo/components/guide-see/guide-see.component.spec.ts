import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideSeeComponent } from './guide-see.component';

describe('GuideSeeComponent', () => {
  let component: GuideSeeComponent;
  let fixture: ComponentFixture<GuideSeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideSeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuideSeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
