import { Injectable } from '@angular/core';
import { CartStore, State } from './cart.store';
import { CartItem } from './cart.model';
import { ProductsQuery } from '../../products/state';
import { combineLatest } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { QueryEntity } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class CartQuery extends QueryEntity<State, CartItem> {
  constructor(protected store: CartStore, private productsQuery: ProductsQuery) {
    super(store);
  }

  selectItems$ = combineLatest(this.selectAll(), this.productsQuery.selectAll({ asObject: true })).pipe(
    map(joinItems),
    publishReplay(),
    refCount()
  );

  selectTotal$ = this.selectItems$.pipe(map(items => items.reduce((acc, item) => acc + item.total, 0)));
}

/**
 *
 * @param {any} cartItems
 * @param {any} products
 * @returns {any}
 */
function joinItems([cartItems, products]) {
  return cartItems.map(cartItem => {
    const product = products[cartItem.productId];
    return {
      ...cartItem,
      ...product,
      total: cartItem.quantity * product.price
    };
  });
}
