import { Injectable } from '@angular/core';
import { ActorsStore, State } from './actors.store';
import { Actor } from './actor.model';
import { QueryEntity } from '../../../../../../akita/src';

@Injectable({
  providedIn: 'root'
})
export class ActorsQuery extends QueryEntity<State, Actor> {
  constructor(protected store: ActorsStore) {
    super(store);
  }
}
