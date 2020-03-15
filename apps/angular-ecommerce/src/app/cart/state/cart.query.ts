import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CartState, CartStore } from './cart.store';
import { CartItem } from './cart.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CartQuery extends QueryEntity<CartState, CartItem> {
  selectTotal$ = this.selectAll().pipe(map(items => items.reduce((acc, item) => acc + item.total, 0)));

  constructor(protected store: CartStore) {
    super(store);
  }
}
