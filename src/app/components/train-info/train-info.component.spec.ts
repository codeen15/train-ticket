import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainInfoComponent } from './train-info.component';

describe('TrainInfoComponent', () => {
  let component: TrainInfoComponent;
  let fixture: ComponentFixture<TrainInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
