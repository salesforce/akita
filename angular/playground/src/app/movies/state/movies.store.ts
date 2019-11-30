import { Injectable } from '@angular/core';
import { Movie } from './movie.model';
import { EntityState, EntityStore, EntityUIStore, StoreConfig } from '@datorama/akita';

export interface MovieUI {
  isOpen: boolean;
}

export interface MoviesState extends EntityState<Movie> {}

export interface MoviesUIState extends EntityState<MovieUI> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'movies' })
export class MoviesStore extends EntityStore<MoviesState> {
  ui: EntityUIStore<MoviesUIState>;

  constructor() {
    super();
    this.createUIStore().setInitialEntityState<MovieUI>({ isOpen: true });
  }
}
