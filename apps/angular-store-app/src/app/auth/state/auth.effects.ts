import { Injectable } from '@angular/core';
import { Actions, Effect } from '@datorama/akita-ng-effects';
import { AuthStore } from './auth.store';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  constructor(private actions$: Actions, private authStore: AuthStore) {}

  @Effect({ dispatch: false })
  allActionsAuth = this.actions$.pipe(tap((action) => console.log('auth effect', action)));
}
