import { Injectable } from '@angular/core';
import { Product } from './products.model';
import { EntityState, EntityStore, MultiActiveState, StoreConfig } from '@datorama/akita';

export interface ProductsState extends EntityState<Product>, MultiActiveState {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'products' })
export class ProductsStore extends EntityStore<ProductsState> {
  constructor() {
    super({ active: [] });
  }
}
