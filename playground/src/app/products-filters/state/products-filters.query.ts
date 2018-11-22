import { Injectable } from '@angular/core';
import { ProductsFiltersStore, ProductPlantState } from './products-filters.store';
import { ProductPlant } from './products-filters.model';
import { QueryConfig, QueryEntity } from '../../../../../akita/src';

@Injectable({
  providedIn: 'root'
})
@QueryConfig({
  sortBy: 'price'
})
export class ProductsFiltersQuery extends QueryEntity<ProductPlantState, ProductPlant> {
  constructor(protected store: ProductsFiltersStore) {
    super(store);
  }

  /**
   *
   * @param {string} value
   * @returns {Observable<Observable<ProductPlant[]>}
   */
  getProducts(term: string, sortBy: keyof ProductPlant) {
    return this.selectAll({
      sortBy,
      filterBy: entity => entity.title.toLowerCase().includes(term)
    });
  }
}
