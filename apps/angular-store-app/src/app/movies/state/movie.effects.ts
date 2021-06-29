import { Injectable } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { MoviesStore } from './movies.store';

@Injectable()
export class MovieEffects {
  constructor(private actions$: Actions, private movieStore: MoviesStore) {}
}
