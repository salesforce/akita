import { Injectable } from '@angular/core';
import { GenresStore, GenresState } from './genres.store';
import { Genre } from './genre.model';
import { QueryEntity } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class GenresQuery extends QueryEntity<GenresState, Genre> {
  constructor(protected store: GenresStore) {
    super(store);
  }
}
