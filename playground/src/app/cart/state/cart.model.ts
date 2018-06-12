import { Product } from '../../products/state';

export type CartItem = {
  productId: Product['id'];
  quantity: number;
  total: number;
};

/**
 * Factory function that creates cart items
 * @param {Partial<CartItem>} params
 * @returns {CartItem}
 */
export function createCartItem(params: Partial<CartItem>) {
  return {
    total: 0,
    quantity: 1,
    ...params
  } as CartItem;
}
