import { Injectable } from '@angular/core';
import { ActorsStore, ActorsState } from './actors.store';
import { QueryEntity } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class ActorsQuery extends QueryEntity<ActorsState> {
  constructor(protected store: ActorsStore) {
    super(store);
  }
}
