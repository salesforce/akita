import { Injectable } from '@angular/core';
import { Genre } from './genre.model';
import { EntityState, EntityStore, StoreConfig } from '../../../../../../akita/src';

export interface State extends EntityState<Genre> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'genres' })
export class GenresStore extends EntityStore<State, Genre> {
  constructor() {
    super();
  }
}
