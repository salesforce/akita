import { Component } from '@angular/core';
import { CartQuery } from '../state/cart.query';
import { ID } from '@datorama/akita';
import { CartService } from '../state/cart.service';
import { AuthQuery } from '../../auth/state/auth.query';
import { Router } from '@angular/router';

@Component({
  templateUrl: './cart-page.component.html'
})
export class CartPageComponent {
  items$ = this.cartQuery.selectAll();
  count$ = this.cartQuery.selectCount();
  total$ = this.cartQuery.selectTotal$;

  constructor(private cartQuery: CartQuery, private authQuery: AuthQuery, private router: Router, private cartService: CartService) {}

  remove(productId: ID) {
    this.cartService.remove(productId);
  }

  checkout() {
    if (this.authQuery.isLoggedIn()) {
      // checkout
    } else {
      this.router.navigateByUrl('login');
    }
  }
}
