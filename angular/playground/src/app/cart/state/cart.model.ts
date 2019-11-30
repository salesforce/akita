import { Product } from '../../products/state/products.model';

export type CartItem = {
  productId: Product['id'];
  quantity: number;
  total: number;
};

export function createCartItem(params: Partial<CartItem>) {
  return {
    total: 0,
    quantity: 1,
    ...params
  } as CartItem;
}
