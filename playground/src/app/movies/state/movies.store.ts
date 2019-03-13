import { Injectable } from '@angular/core';
import { Movie } from './movie.model';
import { EntityState, EntityStore, EntityUIStore, StoreConfig } from '@datorama/akita';

export interface MovieUI {
  isOpen: boolean;
}

export interface MoviesState extends EntityState<Movie> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'movies' })
export class MoviesStore extends EntityStore<MoviesState, Movie> {
  ui: EntityUIStore<MovieUI>;

  constructor() {
    super();
    this.createUIStore();
  }
}
