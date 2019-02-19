import { Injectable } from '@angular/core';
import { ProductsStore } from './products.store';
import { ProductsDataService } from './products-data.service';
import { Product } from './products.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProductsQuery } from './products.query';
import { action, ID, transaction } from '@datorama/akita';
import { logAction } from '../../../../../akita/src/actions';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private productsStore: ProductsStore, private productsQuery: ProductsQuery, private productsDataService: ProductsDataService) {}

  /**
   *
   * @returns {Observable<Product[]>}
   */
  get(): Observable<void> {
    return this.productsDataService.get().pipe(
      map(response => {
        logAction('😘😘😘😘😘😘😘😘😘😘');
        this.productsStore.set(response);
        this.testTransaction();
      })
    );
    // add cache validation when implement
  }

  @transaction()
  testTransaction() {
    this.productsStore.setLoading(true);
    this.productsStore.update(1, { title: 'test' });
    this.productsStore.setLoading(false);
  }

  /**
   *
   * @param {ID} id
   */
  getProduct(id: ID) {
    this.productsDataService.getProduct(id).subscribe(product => {
      this.productsStore.add(product);
    });
  }
}
