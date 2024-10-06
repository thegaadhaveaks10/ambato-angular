import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodItemsCartComponent } from './food-items-cart.component';

describe('FoodItemsCartComponent', () => {
  let component: FoodItemsCartComponent;
  let fixture: ComponentFixture<FoodItemsCartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodItemsCartComponent]
    });
    fixture = TestBed.createComponent(FoodItemsCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
