import { Injectable } from '@angular/core';
import { Movie } from './movie.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface State extends EntityState<Movie> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'movies' })
export class MoviesStore extends EntityStore<State, Movie> {
  constructor() {
    super();
  }
}
