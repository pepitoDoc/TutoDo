import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGuidesComponent } from './my-guides.component';

describe('MyGuidesComponent', () => {
  let component: MyGuidesComponent;
  let fixture: ComponentFixture<MyGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyGuidesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
