import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodItemDetailsComponent } from './food-item-details.component';

describe('FoodItemDetailsComponent', () => {
  let component: FoodItemDetailsComponent;
  let fixture: ComponentFixture<FoodItemDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodItemDetailsComponent]
    });
    fixture = TestBed.createComponent(FoodItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
