import { Injectable } from '@angular/core';
import { ProductsStore, State } from './products.store';
import { Product } from './products.model';
import { QueryEntity } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
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
  getProducts(value: string) {
    return this.selectAll({
      filterBy: entity => entity.title.toLowerCase().includes(value)
    });
  }
}
