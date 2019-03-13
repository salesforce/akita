import { Injectable } from '@angular/core';
import { CartItem } from './cart.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Product } from '../../products/state/products.model';

export interface State extends EntityState<CartItem> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'cart',
  idKey: 'productId'
})
export class CartStore extends EntityStore<State, CartItem> {
  constructor() {
    super();
  }

  updateQuantity(productId: Product['id'], operand = 1) {
    this.update(productId, entity => {
      const newQuantity = entity.quantity + operand;
      return {
        ...entity,
        quantity: newQuantity
      };
    });
  }
}
