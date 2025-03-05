import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { ApiService } from '../api/api.service';
import { ICartItem } from '../../interfaces/cart-item';
import { IFoodItem } from '../../interfaces/fooditem';
import { of } from 'rxjs';

describe('CartService', () => {
  let service: CartService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let mockCartItems: ICartItem[];
  let mockFoodItems: IFoodItem[];

  beforeEach(() => {
    mockCartItems = [
      {
        id: 1,
        name: 'Burger',
        price: 100,
        quantity: 2,
        image: 'assets/images/burger.jpg',
      },
      {
        id: 2,
        name: 'Pizza',
        price: 200,
        quantity: 1,
        image: 'assets/images/pizza.jpg',
      },
    ];

    mockFoodItems = [
      {
        id: 1,
        name: 'Burger',
        price: 100,
        quantity: 1,
        image: 'assets/images/burger.jpg',
        ratings: 1,
        description: 'test',
      },
      {
        id: 2,
        name: 'Pizza',
        price: 200,
        quantity: 1,
        image: 'assets/images/pizza.jpg',
        ratings: 1,
        description: 'test',
      },
    ];

    const apiSpy = jasmine.createSpyObj('ApiService', ['getFoodItems']);
    apiSpy.getFoodItems.and.returnValue(of(mockFoodItems));

    TestBed.configureTestingModule({
      providers: [CartService, { provide: ApiService, useValue: apiSpy }],
    });

    service = TestBed.inject(CartService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  afterEach(() => {
    localStorage.removeItem('cartItems');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with food items from API', () => {
    expect(service.foodItems()).toEqual(mockFoodItems);
  });

  it('should save cart to localStorage when cart changes', () => {
    const testCart = [
      {
        id: 1,
        name: 'Burger',
        price: 100,
        quantity: 2,
        image: 'assets/images/burger.jpg',
      },
      {
        id: 2,
        name: 'Pizza',
        price: 200,
        quantity: 1,
        image: 'assets/images/pizza.jpg',
      },
    ];

    spyOn(localStorage, 'setItem'); // Spy on localStorage.setItem

    service.cart.set(testCart); // Manually update the cart signal
    service['saveCart'](); // Call saveCart manually to ensure storage update

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cartItems',
      JSON.stringify(testCart)
    );
  });

  it('should load cart from loca  lStorage on initialization', () => {
    localStorage.setItem('cartItems', JSON.stringify(mockCartItems));
    service['loadCartFromStorage']();
    expect(service.cart()).toEqual(mockCartItems);
  });

  it('should remove an item from the cart', () => {
    service.cart.set(mockCartItems);
    service.removeCartItem(1);
    expect(service.cart().length).toBe(1);
    expect(service.cart()).not.toContain(mockCartItems[0]);
  });

  it('should increment item quantity in the cart', () => {
    service.cart.set(mockCartItems);
    service.incrementQuantity(1);
    expect(service.cart()[0].quantity).toBe(3);
  });

  it('should decrement item quantity and remove if zero', () => {
    service.cart.set(mockCartItems);
    service.decrementQuantity(2);
    expect(service.cart().length).toBe(1);
    expect(service.cart()).not.toContain(mockCartItems[1]);
  });

  it('should calculate total cart items correctly', () => {
    service.cart.set(mockCartItems);
    expect(service.getTotalCartItems()).toBe(3);
  });

  it('should unsubscribe on destroy', () => {
    spyOn(service.foodItemsSubscription, 'unsubscribe');
    service.ngOnDestroy();
    expect(service.foodItemsSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should override getFoodItems for a single test', () => {
    apiServiceSpy.getFoodItems.and.returnValue(
      of([
        {
          id: 3,
          name: 'Pasta',
          price: 150,
          quantity: 1,
          image: 'assets/images/pasta.jpg',
          ratings: 1,
          description: 'test',
        },
      ])
    );
    service = new CartService(apiServiceSpy);
    expect(service.foodItems()).toEqual([
      {
        id: 3,
        name: 'Pasta',
        price: 150,
        quantity: 1,
        image: 'assets/images/pasta.jpg',
        ratings: 1,
        description: 'test',
      },
    ]);
  });
});
