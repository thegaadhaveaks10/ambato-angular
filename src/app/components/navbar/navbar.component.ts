import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  showNavbar: boolean = true;

  constructor(public cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.initializeRouterEventListener(); // Initialize the router event listener on component initialization
  }

  /**
   * Sets up a listener for router events to update navbar visibility.
   */
  private initializeRouterEventListener(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateNavbarVisibility(); // Check route and update navbar visibility
      });
  }

  /**
   * Updates the visibility of the navbar based on the current route.
   * The navbar will be hidden on the sign-in and sign-up routes,
   * as well as on the root path ('/').
   */
  private updateNavbarVisibility(): void {
    const currentRoute = this.router.url;

    // Set showNavbar to false for sign-in, sign-up, or root routes
    this.showNavbar = !(
      currentRoute.includes('sign-in') ||
      currentRoute.includes('sign-up') ||
      currentRoute === '/'
    );
  }
}
