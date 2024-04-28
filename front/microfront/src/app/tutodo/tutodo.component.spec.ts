import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutodoComponent } from './tutodo.component';

describe('TutodoComponent', () => {
  let component: TutodoComponent;
  let fixture: ComponentFixture<TutodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutodoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TutodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
