import { Injectable } from '@angular/core';
import { CartStore, State } from './cart.store';
import { CartItem } from './cart.model';
import { ProductsQuery } from '../../products/state';
import { combineLatest } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { QueryEntity } from '../../../../../akita/src';
import { ProductsFiltersQuery } from '../../products-filters/state';

@Injectable({
  providedIn: 'root'
})
export class CartQuery extends QueryEntity<State, CartItem> {
  constructor(protected store: CartStore,
              private productsQuery: ProductsQuery,
              private productsFilterQuery: ProductsFiltersQuery) {
    super(store);
  }

  selectItems$ = combineLatest(this.selectAll(), this.productsQuery.selectAll({ asObject: true }), this.productsFilterQuery.selectAll({ asObject: true })).pipe(
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
function joinItems([cartItems, products, productPlant]) {
  return cartItems.map(cartItem => {
    const product = products[cartItem.productId]? products[cartItem.productId] : productPlant[cartItem.productId]? productPlant[cartItem.productId] : {};
    return {
      ...cartItem,
      ...product,
      total: cartItem.quantity * product.price
    };
  });
}
