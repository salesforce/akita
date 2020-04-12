import { ID } from '@datorama/akita';
import { Product } from '../../products/state/product.model';

export interface CartItem {
  productId: ID;
  quantity: number;
  title: Product['title'];
  price: Product['additionalData']['price'];
  total: number;
}
