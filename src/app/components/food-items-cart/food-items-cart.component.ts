import { Component, computed, OnInit } from '@angular/core';
import { ICartItem } from 'src/app/interfaces/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-food-items-cart',
  templateUrl: './food-items-cart.component.html',
  styleUrls: ['./food-items-cart.component.scss']
})
export class FoodItemsCartComponent implements OnInit {
  // cartItems = computed(() => this.cartService.getCartItems());  // Use computed signal for cart items
  cart = this.cartService.cart;
  constructor(public cartService: CartService) {}

  ngOnInit(): void {
  }

  /**
   * Decrement the quantity of a cart item
   * @param foodItemId - ID of the cart item
   */
  incrementQuantity(cartItemId: number): void {
    this.cartService.incrementQuantity(cartItemId);
  }

  /**
   * Decrement the quantity of a cart item
   * @param cartItemId - ID of the cart item
   */
  decrementQuantity(cartItemId: number): void {
    this.cartService.decrementQuantity(cartItemId);
  }

  /**
   * Returns the total price of a cart item based on its price and quantity.
   * If quantity is undefined, it defaults to 0.
   *
   * @param cartItem - The cart item with price and quantity.
   * @returns The calculated total price.
   */
  getTotalPrice(cartItem: ICartItem): number {
    return cartItem.price * (cartItem.quantity || 0);
  }

  /**
   * Calculates the subtotal of all items in the cart.
   * Iterates over the cart items and sums their total prices using the cart service.
   *
   * @returns {number} The subtotal of all items in the cart.
   */
  getCartSubtotal(): number {
    return this.cart().reduce(
      (total, item) => total + this.getTotalPrice(item),
      0
    );
  }

  /**
   * Removes an item from the cart based on the provided item ID.
   *
   * @param itemID - The unique ID of the item to be removed from the cart.
   */
  removeItem(itemID: number): void {
    this.cartService.removeCartItem(itemID);
  }
}
