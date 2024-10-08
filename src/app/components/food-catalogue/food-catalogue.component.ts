import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICartItem } from 'src/app/interfaces/cart-item';
import { IFoodItem } from 'src/app/interfaces/fooditem';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-food-catalogue',
  templateUrl: './food-catalogue.component.html',
  styleUrls: ['./food-catalogue.component.scss']
})
export class FoodCatalogueComponent implements OnInit {
  foodItems = this.cartService.foodItems;  // Using signals from CartService
  cart = this.cartService.cart;            // Signal for cart items

  constructor(
    private apiService: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.fetchFoodItems();
  }

  /**
   * Fetch food items from API and map them with additional property stars
   * and modify the existing quanity property based on criteria
   */
  fetchFoodItems(): void {
    this.apiService.getFoodItems().subscribe(
      (result: IFoodItem[]) => {
        const updatedFoodItems = result.map(item => ({
          ...item,
          quantity: this.getQuantityFromCart(item.id),
          stars: this.generateStars(item.ratings)
        }));
        this.foodItems.set(updatedFoodItems);
      },
      (error: Error) => {
        console.error("Failed to fetch food items", error);
      }
    );
  }

  /**
   * Generates star ratings for a food item
   * @param rating - the rating out of 5
   * @returns array of booleans representing filled/unfilled stars
   */
  generateStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  /**
   * Get the quantity of a food item from the cart
   * @param foodItemId - ID of the food item
   * @returns the quantity if found, otherwise 0
   */
  getQuantityFromCart(foodItemId: number): number {
    const cartItem = this.cart().find(cartItem => cartItem.id === foodItemId);
    return cartItem ? cartItem.quantity : 0;
  }

  /**
   * Add a food item to the cart
   * @param event - click event to stop propagation
   * @param foodItemId - ID of the food item
   */
  addToCart(event: Event, foodItemId: number): void {
    event.stopPropagation();

    const currentFoodItem = this.foodItems().find(item => item.id === foodItemId);
    if (!currentFoodItem) return;

    const cartItem: ICartItem = {
      id: currentFoodItem.id,
      image: currentFoodItem.image,
      name: currentFoodItem.name,
      quantity: 1,
      price: currentFoodItem.price
    };

    currentFoodItem.quantity = 1;
    this.cartService.addCartItem(cartItem);
  }

  /**
   * Increment the quantity of a cart item
   * @param foodItemId - ID of the cart item
   */
  incrementQuantity(foodItemId: number): void {
    this.cartService.incrementQuantity(foodItemId);
  }

  /**
   * Decrement the quantity of a cart item
   * @param foodItemId - ID of the cart item
   */
  decrementQuantity(foodItemId: number): void {
    this.cartService.decrementQuantity(foodItemId);
  }

  /**
   * Prevent event propagation to parent elements
   * @param event - the DOM event
   */
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
