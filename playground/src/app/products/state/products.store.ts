import { Injectable } from '@angular/core';
import { Product } from './products.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

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
