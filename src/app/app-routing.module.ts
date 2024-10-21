import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FoodCatalogueComponent } from './components/food-catalogue/food-catalogue.component';
import { FoodItemDetailsComponent } from './components/food-item-details/food-item-details.component';
import { FoodItemsCartComponent } from './components/food-items-cart/food-items-cart.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: SignInComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'food-catalogue', component: FoodCatalogueComponent },
  { path: 'food-item-details/:id', component: FoodItemDetailsComponent },
  { path: 'food-items-cart', component: FoodItemsCartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
