import { Injectable } from '@angular/core';
import { CartStore } from './cart.store';
import { CartQuery } from './cart.query';
import { createCartItem } from './cart.model';
import { ID } from '@datorama/akita';
import { Product } from '../../products/state/products.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private cartStore: CartStore, private cartQuery: CartQuery) {}

  addProductToCart(productId: Product['id']) {
    const findItem = this.cartQuery.getEntity(productId);
    if (!!findItem) {
      return this.cartStore.updateQuantity(productId);
    }

    const item = createCartItem({
      productId
    });

    return this.cartStore.add(item);
  }

  subtract(productId: Product['id']) {
    const findItem = this.cartQuery.getEntity(productId);
    if (!!findItem) {
      if (findItem.quantity === 1) {
        return this.cartStore.remove(productId);
      }

      return this.cartStore.updateQuantity(findItem.productId, -1);
    }
  }

  remove(productId: ID) {
    this.cartStore.remove(productId);
  }
}
