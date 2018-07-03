import { Injectable } from '@angular/core';
import { GenresStore, State } from './genres.store';
import { Genre } from './genre.model';
import { QueryEntity } from '../../../../../../akita/src';

@Injectable({
  providedIn: 'root'
})
export class GenresQuery extends QueryEntity<State, Genre> {
  constructor(protected store: GenresStore) {
    super(store);
  }
}
