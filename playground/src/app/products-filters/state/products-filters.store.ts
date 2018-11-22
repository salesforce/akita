import { Injectable } from '@angular/core';
import { ProductPlant } from './products-filters.model';
import { StoreConfig } from '../../../../../akita/src/api/store-config';
import { EntityState, EntityStore } from '../../../../../akita/src';

export interface ProductPlantState extends EntityState<ProductPlant> {}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({
  name: 'productsFilters'
})
export class ProductsFiltersStore extends EntityStore<ProductPlantState, ProductPlant> {
  constructor() {
    super();
  }
}
