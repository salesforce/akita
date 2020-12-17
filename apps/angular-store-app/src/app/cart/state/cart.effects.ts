import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { CartActions } from './cart.actions';
import { map, switchMap, tap } from 'rxjs/operators';
import { CartStore } from './cart.store';
import { of, timer } from 'rxjs';

@Injectable()
export class CartEffects {
  constructor(private actions$: Actions, private cartStore: CartStore) {
    console.log(this);
  }

  @Effect()
  removeItem$ = this.actions$.pipe(
    ofType(CartActions.removeItem),
    tap((val) => console.log('[Cart Effects] removeItem$', val)),
    switchMap((test) => {
      // do async operations
      this.cartStore.remove(test.productId);
      return of(this.actions$.dispatch(CartActions.removeItemSuccess()));
    })
  );

  @Effect()
  removeItemSuccess$ = this.actions$.pipe(
    ofType(CartActions.removeItemSuccess),
    tap((val) => console.log('[Cart Effects] removeItemSuccess$', val)),
    map((_) => this.cartStore.notify(true)),
    switchMap((state) => timer(3000).pipe(tap((_) => this.cartStore.notify(false))))
  );
}
