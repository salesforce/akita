import { Injectable } from '@angular/core';
import { StoriesStore, State } from './stories.store';
import { Story } from './story.model';
import { QueryEntity } from '../../../../../akita/src';

@Injectable({
  providedIn: 'root'
})
export class StoriesQuery extends QueryEntity<State, Story> {
  constructor(protected store: StoriesStore) {
    super(store);
  }
}
