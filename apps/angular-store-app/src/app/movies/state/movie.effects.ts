import { Injectable } from '@angular/core';
import { Actions, Effect } from '@datorama/akita-ng-effects';
import { MoviesStore } from './movies.store';
import { tap } from 'rxjs/operators';

@Injectable()
export class MovieEffects {
  constructor(private actions$: Actions, private movieStore: MoviesStore) {}

  @Effect({ dispatch: false })
  allActions = this.actions$.pipe(tap((action) => console.log('movie effect', action)));
}
