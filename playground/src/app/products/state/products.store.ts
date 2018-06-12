import { Injectable } from '@angular/core';
import { Product } from './products.model';
import { EntityState, EntityStore } from '@datorama/akita';

export interface State extends EntityState<Product> {}

@Injectable({
  providedIn: 'root'
})
export class ProductsStore extends EntityStore<State, Product> {
  constructor() {
    super();
  }
}
