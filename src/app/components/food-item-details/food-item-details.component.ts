import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICartItem } from 'src/app/interfaces/cart-item';
import { IFoodItem } from 'src/app/interfaces/fooditem';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-food-item-details',
  templateUrl: './food-item-details.component.html',
  styleUrls: ['./food-item-details.component.scss'],
})
export class FoodItemDetailsComponent implements OnInit {
  currentFoodItemId = signal<number>(0);
  currentFoodItem = signal<IFoodItem | null>(null);
  currentCartItem = signal<ICartItem | undefined>(undefined);
  showQuantityButton = signal<boolean>(false);

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.initializeFoodItemId();
    this.updateCartItemState();
    this.fetchFoodItemDetails();
  }

  /**
   * Initializes the food item ID from the route parameters.
   */
  private initializeFoodItemId(): void {
    const foodItemId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.currentFoodItemId.set(foodItemId);
  }

  /**
   * Updates the state of the current cart item and sets whether the quantity button should be shown.
   */
  private updateCartItemState(): void {
    const cartItem = this.cartService.getCartItems().find((item: ICartItem) => item.id === this.currentFoodItemId());
    this.currentCartItem.set(cartItem);
    this.showQuantityButton.set(!!cartItem);
  }

  /**
   * Fetches the food item details based on the food item ID.
   */
  private fetchFoodItemDetails(): void {
    this.apiService.getFoodItemByID(this.currentFoodItemId()).subscribe(
      (foodItem: IFoodItem | undefined) => {
        if (foodItem) {
          this.setCurrentFoodItem(foodItem);
        } else {
          console.log('Food item not found');
        }
      },
      (error) => {
        console.error('Error fetching food item', error);
      }
    );
  }

  /**
   * Sets the current food item and updates the quantity and star rating.
   * @param foodItem The food item to set.
   */
  private setCurrentFoodItem(foodItem: IFoodItem): void {
    const quantity = this.currentCartItem()?.quantity || foodItem.quantity || 0;
    const stars = Array(5).fill(false).map((_, i) => i < foodItem.ratings);
    this.currentFoodItem.set({ ...foodItem, quantity, stars });
  }

  /**
   * Adds the current food item to the cart.
   */
  addToCart(): void {
    const foodItem = this.currentFoodItem();
    if (!foodItem) return;

    const cartItem: ICartItem = {
      id: foodItem.id,
      image: foodItem.image,
      name: foodItem.name,
      quantity: 1,
      price: foodItem.price,
    };

    this.cartService.addCartItem(cartItem);
    this.updateCartAndFoodItemState(1);
  }

  /**
   * Increments the quantity of the current food item in the cart.
   */
  incrementQuantity(): void {
    const foodItem = this.currentFoodItem();
    if (!foodItem) return;

    const updatedQuantity = (foodItem.quantity || 0) + 1;
    this.cartService.incrementQuantity(this.currentFoodItemId());
    this.updateCartAndFoodItemState(updatedQuantity);
  }

  /**
   * Decrements the quantity of the current food item in the cart.
   */
  decrementQuantity(): void {
    const foodItem = this.currentFoodItem();
    if (!foodItem) return;

    const updatedQuantity = (foodItem.quantity || 0) - 1;
    this.cartService.decrementQuantity(this.currentFoodItemId());
    this.updateCartAndFoodItemState(Math.max(0, updatedQuantity));
  }

  /**
   * Updates the state of the cart and the current food item's quantity.
   * @param newQuantity The updated quantity.
   */
  private updateCartAndFoodItemState(newQuantity: number): void {
    this.showQuantityButton.set(newQuantity > 0);
    const foodItem = this.currentFoodItem();
    if (foodItem) {
      this.currentFoodItem.set({ ...foodItem, quantity: newQuantity });
    }
  }
}
