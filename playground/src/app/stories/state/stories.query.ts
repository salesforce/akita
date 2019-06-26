import { Injectable } from '@angular/core';
import { StoriesStore, StoriesState } from './stories.store';
import { QueryEntity } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class StoriesQuery extends QueryEntity<StoriesState> {
  constructor(protected store: StoriesStore) {
    super(store);
  }
}
