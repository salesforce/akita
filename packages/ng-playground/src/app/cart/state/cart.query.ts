import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { combineLatest, map, shareReplay } from 'rxjs';
import { ProductsQuery } from '../../products/state/products.query';
import { CartState, CartStore } from './cart.store';

@Injectable({ providedIn: 'root' })
export class CartQuery extends QueryEntity<CartState> {
  constructor(protected store: CartStore, private productsQuery: ProductsQuery) {
    super(store);
  }

  selectItems$ = combineLatest([this.selectAll(), this.productsQuery.selectAll({ asObject: true })]).pipe(map(joinItems), shareReplay({ bufferSize: 1, refCount: true }));

  selectTotal$ = this.selectItems$.pipe(map((items) => items.reduce((acc, item) => acc + item.total, 0)));
}

function joinItems([cartItems, products]) {
  return cartItems.map((cartItem) => {
    const product = products[cartItem.productId];
    return {
      ...cartItem,
      ...product,
      total: cartItem.quantity * product.price,
    };
  });
}
