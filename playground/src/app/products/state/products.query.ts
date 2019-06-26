import { Injectable } from '@angular/core';
import { ProductsState, ProductsStore } from './products.store';
import { Product } from './products.model';
import { QueryConfig, QueryEntity } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
@QueryConfig({ sortBy: 'price' })
export class ProductsQuery extends QueryEntity<ProductsState> {
  constructor(protected store: ProductsStore) {
    super(store);
  }

  getProducts(term: string, sortBy: keyof Product) {
    return this.selectAll({
      sortBy,
      filterBy: entity => entity.title.toLowerCase().includes(term)
    });
  }
}
