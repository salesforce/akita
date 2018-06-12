import { Injectable } from '@angular/core';
import { CartItem } from './cart.model';
import { EntityState, EntityStore } from '@datorama/akita';
import { Product } from '../../products/state';

export interface State extends EntityState<CartItem> {}

@Injectable({
  providedIn: 'root'
})
export class CartStore extends EntityStore<State, CartItem> {
  constructor() {
    super({}, { idKey: 'productId' });
  }

  /**
   *
   * @param {Product["id"]} productId
   * @param {number} operand
   */
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
