import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedGuidesComponent } from './saved-guides.component';

describe('SavedGuidesComponent', () => {
  let component: SavedGuidesComponent;
  let fixture: ComponentFixture<SavedGuidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedGuidesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavedGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
