import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductsStore } from './products.store';
import { BaseProduct, Product } from './product.model';
import { tap } from 'rxjs/operators';
import { API } from '../../api';
import { ID } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private productsStore: ProductsStore, private http: HttpClient) {}

  getAll(term: string, filters) {
    return this.http
      .get<BaseProduct[]>(`${API}/products`, { params: { term, ...filters } })
      .pipe(tap(products => this.productsStore.set(products)));
  }

  getProduct(id: ID) {
    return this.http.get<Product>(`${API}/product/${id}`).pipe(tap(product => this.productsStore.upsert(id, product)));
  }

  updateFilters(filters) {
    this.productsStore.update({ filters });
  }

  invalidateCache() {
    this.productsStore.setHasCache(false);
  }

  updateSearchTerm(searchTerm: string) {
    this.productsStore.update({ searchTerm });
    this.invalidateCache();
  }
}
