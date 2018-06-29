import { Injectable } from '@angular/core';
import { CartStore } from './cart.store';
import { Product } from '../../products/state';
import { CartQuery } from './cart.query';
import { createCartItem } from './cart.model';
import { ID, toBoolean } from '../../../../../akita/src';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private cartStore: CartStore, private cartQuery: CartQuery) {}

  /**
   *
   * @param {Product["id"]} productId
   */
  addProductToCart(productId: Product['id']) {
    const findItem = this.cartQuery.getEntity(productId);
    if (toBoolean(findItem)) {
      return this.cartStore.updateQuantity(productId);
    }

    const item = createCartItem({
      productId
    });

    return this.cartStore.add(item);
  }

  /**
   *
   * @param {Product["id"]} productId
   */
  subtract(productId: Product['id']) {
    const findItem = this.cartQuery.getEntity(productId);
    if (toBoolean(findItem)) {
      if (findItem.quantity === 1) {
        return this.cartStore.remove(productId);
      }

      return this.cartStore.updateQuantity(findItem.productId, -1);
    }
  }

  /**
   *
   * @param {ID} productId
   */
  remove(productId: ID) {
    this.cartStore.remove(productId);
  }
}
