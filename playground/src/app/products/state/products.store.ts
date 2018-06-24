import { Injectable } from '@angular/core';
import { Product } from './products.model';
import { EntityState, EntityStore } from '@datorama/akita';
import { StoreConfig } from '../../../../../akita/src/api/store-config';

export interface State extends EntityState<Product> {}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({
  name: 'products'
})
export class ProductsStore extends EntityStore<State, Product> {
  constructor() {
    super();
  }
}
