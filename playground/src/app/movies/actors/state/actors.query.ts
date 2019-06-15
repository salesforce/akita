import { Injectable } from '@angular/core';
import { ActorsStore, ActorsState } from './actors.store';
import { Actor } from './actor.model';
import { QueryEntity } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class ActorsQuery extends QueryEntity<ActorsState, Actor> {
  constructor(protected store: ActorsStore) {
    super(store);
  }
}
