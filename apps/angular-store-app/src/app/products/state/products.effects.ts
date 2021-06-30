import { Injectable } from '@angular/core';
import { Actions, Effect } from '@datorama/akita-ng-effects';
import { ProductsStore } from './products.store';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductsEffects {
  constructor(private actions$: Actions, private productsStore: ProductsStore) {}

  @Effect()
  allActionsProducts = this.actions$.pipe(tap((action) => console.log('product effect', action)));
}
