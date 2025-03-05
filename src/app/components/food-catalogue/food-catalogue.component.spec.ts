import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodCatalogueComponent } from './food-catalogue.component';
import { IFoodItem } from 'src/app/interfaces/fooditem';
import { ICartItem } from 'src/app/interfaces/cart-item';
import { ApiService } from 'src/app/services/api/api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('FoodCatalogueComponent', () => {
  let component: FoodCatalogueComponent;
  let fixture: ComponentFixture<FoodCatalogueComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let mockFoodItems: IFoodItem[];
  let mockCartItems: ICartItem[];

  beforeEach(() => {
    mockFoodItems = [
      { id: 1, name: 'Burger', price: 100, quantity: 2, image: 'assets/images/burger.jpg', ratings: 3, description: 'test' },
      { id: 2, name: 'Pizza', price: 200, quantity: 3, image: 'assets/images/pizza.jpg', ratings: 4, description: 'test' }
    ];

    mockCartItems = [
      { id: 1, name: 'Burger', price: 100, quantity: 2, image: 'assets/images/burger.jpg' },
      { id: 2, name: 'Pizza', price: 200, quantity: 3, image: 'assets/images/pizza.jpg' }
    ];

    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getFoodItems']);
    apiServiceSpy.getFoodItems.and.returnValue(of(mockFoodItems));

    TestBed.configureTestingModule({
      declarations: [FoodCatalogueComponent],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }],
      imports: [RouterTestingModule],
    });

    fixture = TestBed.createComponent(FoodCatalogueComponent);
    component = fixture.componentInstance;
    component.cart.set(mockCartItems);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Fetching and Displaying Food Items', () => {
    beforeEach(() => {
      spyOn(component, 'getQuantityFromCart').and.callFake(id => (id === 1 ? 2 : 3));
      spyOn(component, 'generateStars').and.callFake(rating => Array(5).fill(false).map((_, i) => i < rating));
    });

    it('should fetch and process food items correctly', () => {
      component.fetchFoodItems();
      fixture.detectChanges();

      expect(component.foodItems().length).toBe(2);
      expect(component.foodItems()).toEqual([
        { ...mockFoodItems[0], stars: [true, true, true, false, false] },
        { ...mockFoodItems[1], stars: [true, true, true, true, false] }
      ]);
    });

    it('should display food items correctly', () => {
      component.foodItems.set(mockFoodItems);
      fixture.detectChanges();

      const foodItems = fixture.debugElement.queryAll(By.css('.food-item-name'));
      expect(foodItems.length).toBe(2);
      expect(foodItems[0].nativeElement.textContent).toContain('Burger');
      expect(foodItems[1].nativeElement.textContent).toContain('Pizza');
    });

    it('should display the correct price', () => {
      component.foodItems.set([mockFoodItems[0]]);
      fixture.detectChanges();

      const priceElement = fixture.debugElement.query(By.css('.price-container'));
      expect(priceElement.nativeElement.textContent).toContain('₹100');
    });

    it('should display the correct image', () => {
      component.foodItems.set([mockFoodItems[0]]);
      fixture.detectChanges();

      const imageElement = fixture.debugElement.query(By.css('.food-item-image img'));
      expect(imageElement.nativeElement.src).toContain('burger.jpg');
      expect(imageElement.nativeElement.alt).toEqual('Burger');
    });
  });

  describe('Cart UI Interactions', () => {
    it('should show Add to Cart button when quantity is 0', () => {
      component.foodItems.set([{ ...mockFoodItems[0], quantity: 0 }]);
      fixture.detectChanges();

      const addToCartButton = fixture.debugElement.query(By.css('.add-to-cart'));
      expect(addToCartButton).toBeTruthy();
    });

    it('should hide Add to Cart button when quantity is greater than 0', () => {
      component.foodItems.set([mockFoodItems[0]]);
      fixture.detectChanges();

      const addToCartButton = fixture.debugElement.query(By.css('.add-to-cart'));
      expect(addToCartButton).toBeFalsy();
    });

    it('should display increment and decrement buttons when quantity is greater than 0', () => {
      component.foodItems.set([mockFoodItems[0]]);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.increment'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.decrement'))).toBeTruthy();
    });
  });

  describe('Cart Quantity Management', () => {
    beforeEach(() => {
      component.cart.set(mockCartItems);
    });

    it('should return correct quantity from the cart', () => {
      expect(component.getQuantityFromCart(1)).toBe(2);
      expect(component.getQuantityFromCart(2)).toBe(3);
    });

    it('should return 0 when item is not in the cart', () => {
      expect(component.getQuantityFromCart(3)).toBe(0);
    });

    it('should return 0 when cart is empty', () => {
      component.cart.set([]);
      expect(component.getQuantityFromCart(1)).toBe(0);
    });
  });

  describe('Cart Actions', () => {
    it('should add an item to the cart', () => {
      component.cart.set([mockCartItems[0]]);
      spyOn(component, 'addToCart').and.callThrough();
      expect(component.cart().length).toBe(1);

      component.addToCart(2);
      fixture.detectChanges();

      expect(component.addToCart).toHaveBeenCalledWith(2);
      expect(component.cart().length).toBe(2);
      expect(component.cart()).toContain(jasmine.objectContaining({ id: 2, quantity: 1 }));
      expect(component.cart()).toEqual([
        { id: 1, name: 'Burger', price: 100, quantity: 2, image: 'assets/images/burger.jpg' },
        { id: 2, name: 'Pizza', price: 200, quantity: 1, image: 'assets/images/pizza.jpg' }
      ]);
    });

    it('should increment food item quantity', () => {
      spyOn(component, 'incrementQuantity').and.callThrough();

      component.incrementQuantity(1);
      fixture.detectChanges();

      expect(component.cart()[0].quantity).toBe(3);
      expect(component.foodItems()[0].quantity).toBe(3);
      expect(component.incrementQuantity).toHaveBeenCalledWith(1);
    });

    it('should decrement food item quantity', () => {
      spyOn(component, 'decrementQuantity').and.callThrough();

      component.decrementQuantity(1);
      fixture.detectChanges();

      expect(component.cart()[0].quantity).toBe(1);
      expect(component.foodItems()[0].quantity).toBe(1);
      expect(component.decrementQuantity).toHaveBeenCalledWith(1);
    });

    it('should remove item from cart when quantity reaches 0', () => {
      component.decrementQuantity(1);
      component.decrementQuantity(1);
      fixture.detectChanges();

      expect(component.cart().some(item => item.id === 1)).toBeFalse();
    });
  });

  describe('Helper Functions', () => {
    it('should generate correct star ratings', () => {
      expect(component.generateStars(3)).toEqual([true, true, true, false, false]);
      expect(component.generateStars(2)).toEqual([true, true, false, false, false]);
      expect(component.generateStars(4)).toEqual([true, true, true, true, false]);
    });

    it('should call stopPropagation on event', () => {
      const event = jasmine.createSpyObj('event', ['stopPropagation']);
      component.stopPropagation(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });
});
