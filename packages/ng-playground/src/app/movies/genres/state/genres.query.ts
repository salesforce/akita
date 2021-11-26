import { Injectable } from '@angular/core';
import { GenresStore, GenresState } from './genres.store';
import { QueryEntity } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class GenresQuery extends QueryEntity<GenresState> {
  constructor(protected store: GenresStore) {
    super(store);
  }
}
