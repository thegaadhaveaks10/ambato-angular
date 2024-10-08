import { Injectable, OnDestroy, signal } from '@angular/core';
import { ICartItem } from '../../interfaces/cart-item';
import { IFoodItem } from '../../interfaces/fooditem';
import { ApiService } from '../api/api.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnDestroy {
  private cartKey = 'cartItems';
  private foodItemsSubscription: Subscription;

  // Create a signal to hold the cart array
  public cart = signal<ICartItem[]>([]);

  // Create a signal to hold the foodItems array
  public foodItems = signal<IFoodItem[]>([]);

  constructor(private apiService: ApiService) {
    const storedCart = localStorage.getItem(this.cartKey);
    if (storedCart) {
      // Initialize the signal with stored cart data
      this.cart.set(JSON.parse(storedCart));
    }

    (this.foodItemsSubscription = this.apiService
      .getFoodItems()
      .subscribe((foodItems: IFoodItem[]) => {
        this.foodItems.set(foodItems);
      })),
      (error: Error) => {
        console.error('FoodItems are not accessible', error);
      };
  }

  // Getter to retrieve the current value of the cart signal
  getCartItems(): ICartItem[] {
    return this.cart(); // Access the current signal's value
  }

  // Getter to retrieve the current value of the foodItem signal
  getFoodItems(): IFoodItem[] {
    return this.foodItems(); // Access the current signal's value
  }

  // Add an item to the cart and update the signal
  addCartItem(item: ICartItem): void {
    const updatedCart = [...this.cart(), item]; // Create a new cart array with the added item
    this.cart.set(updatedCart); // Set the new cart value to the signal
    this.saveCart();
  }

  // Remove an item from the cart and update the signal
  removeCartItem(cartItemId: number): void {
    const updatedCart = this.cart().filter(
      (cartItem) => cartItem.id !== cartItemId
    );
    this.cart.set(updatedCart); // Update the signal
    this.saveCart();
  }

  // Increment the quantity of a specific cart item and update the signal
  incrementQuantity(cartItemId: number): void {
    const updatedCart = this.cart().map((cartItem: ICartItem) => {
      if (cartItem.id === cartItemId) {
        return { ...cartItem, quantity: (cartItem.quantity || 0) + 1 };
      }
      return cartItem;
    });

    const updatedFoodItems = this.foodItems().map((foodItem: IFoodItem) => {
      if (foodItem.id === cartItemId) {
        return { ...foodItem, quantity: (foodItem.quantity || 0) + 1 };
      }
      return foodItem;
    });

    this.cart.set(updatedCart); // Update the signal
    this.foodItems.set(updatedFoodItems); // Update the signal
    this.saveCart();
  }

  // Decrement the quantity of a specific cart item and remove if quantity reaches 0
  decrementQuantity(cartItemId: number): void {
    const updatedCart = this.cart()
      .map((cartItem: ICartItem) => {
        if (cartItem.id === cartItemId) {
          if (cartItem.quantity && cartItem.quantity > 1) {
            return { ...cartItem, quantity: cartItem.quantity - 1 };
          } else {
            return null; // Return null to indicate item removal
          }
        }
        return cartItem;
      })
      .filter((item): item is ICartItem => item !== null); // Remove any null entries (filtered out removed items)

    const updatedFoodItems = this.foodItems()
      .map((foodItem: IFoodItem) => {
        if (foodItem.id === cartItemId) {
          if (foodItem.quantity && foodItem.quantity > 0) {
            return { ...foodItem, quantity: foodItem.quantity - 1 };
          } else {
            return null; // Return null to indicate item removal
          }
        }
        return foodItem;
      })
      .filter((item): item is IFoodItem => item !== null); // Remove any null entries (filtered out removed items)

    this.cart.set(updatedCart); // Update the signal
    this.foodItems.set(updatedFoodItems); // Update the signal

    this.saveCart();
  }

  // Save the cart to localStorage
  private saveCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart()));
  }

  /**
   * Calculates the total number of items in the cart by summing up the quantities of each item.
   *
   * @returns The total quantity of all items in the cart.
   */
  getTotalCartItems(): number {
    return this.cart().reduce((total, item) => total + (item.quantity || 0), 0);
  }

  ngOnDestroy(): void {
    this.foodItemsSubscription.unsubscribe();
  }
}
