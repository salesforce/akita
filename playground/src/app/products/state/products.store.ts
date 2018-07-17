import { Injectable } from '@angular/core';
import { Product } from './products.model';
import { StoreConfig } from '../../../../../akita/src/api/store-config';
import { EntityState, EntityStore } from '../../../../../akita/src';

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
