import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem, CartQuery, CartService } from './state';
import { Product } from '../products/state/products.model';

@Component({
  selector: 'app-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  items$: Observable<(CartItem & Product)[]>;
  total$: Observable<number>;

  constructor(private cartQuery: CartQuery, private cartService: CartService) {}

  ngOnInit() {
    this.items$ = this.cartQuery.selectItems$;
    this.total$ = this.cartQuery.selectTotal$;
  }

  /**
   *
   * @param {ID} productId
   */
  remove({ productId }: CartItem) {
    this.cartService.remove(productId);
  }
}
