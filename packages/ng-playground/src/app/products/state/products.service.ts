import { Injectable } from '@angular/core';
import { cacheable, ID } from '@datorama/akita';
import { map, mapTo, Observable, timer } from 'rxjs';
import { products } from '../products.mocks';
import { ProductsStore } from './products.store';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private productsStore: ProductsStore) {}

  get(): Observable<void> {
    const request = timer(500).pipe(
      mapTo(products),
      map((response) => this.productsStore.set(response))
    );

    return cacheable(this.productsStore, request);
  }

  getProduct(id: ID) {
    const product = products.find((current) => current.id === +id);

    return timer(500).pipe(
      mapTo(product),
      map(() => this.productsStore.add(product))
    );
  }
}
