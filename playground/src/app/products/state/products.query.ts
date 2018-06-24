import { Injectable } from '@angular/core';
import { ProductsStore, State } from './products.store';
import { Product } from './products.model';
import { QueryEntity } from '@datorama/akita';
import { QueryConfig } from '@datorama/akita/src/api/query-config';

@Injectable({
  providedIn: 'root'
})
@QueryConfig({
  sortBy: 'price'
})
export class ProductsQuery extends QueryEntity<State, Product> {
  constructor(protected store: ProductsStore) {
    super(store);
  }

  /**
   *
   * @param {string} value
   * @returns {Observable<Observable<Product[]>}
   */
  getProducts(term: string, sortBy: keyof Product) {
    return this.selectAll({
      sortBy,
      filterBy: entity => entity.title.toLowerCase().includes(term)
    });
  }
}
