import { Injectable } from '@angular/core';
import { mapTo } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import { ProductPlant } from './products-filters.model';
import { productsPlant } from '../products-filters.mocks';
import { ID } from '../../../../../akita/src';

@Injectable({
  providedIn: 'root'
})
export class ProductsFiltersDataService {
  /**
   *
   * @returns {Observable<ProductPlant[]>}
   */
  get(): Observable<ProductPlant[]> {
    return timer(500).pipe(mapTo(productsPlant));
  }

  /**
   *
   * @param {ID} id
   * @returns {Observable<ProductPlant>}
   */
  getProduct(id: ID): Observable<ProductPlant> {
    const product = productsPlant.find(product => product.id === +id);
    return timer(500).pipe(mapTo(product));
  }
}
