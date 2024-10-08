import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, find, map, Observable } from 'rxjs';
import { IFoodItem } from '../../interfaces/fooditem';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private jsonUrl = 'assets/json-data/food-items.json'; 

  constructor(private http: HttpClient) { }

  getFoodItems(): Observable<IFoodItem[]>  {
    return this.http.get<IFoodItem[]>(this.jsonUrl);
  }

  getFoodItemByID(foodItemId: number): Observable<IFoodItem | undefined>  {
    return this.http.get<IFoodItem[]>(this.jsonUrl).pipe(
      map(foodItems => foodItems.find(item => item.id === foodItemId)));
  }
}
