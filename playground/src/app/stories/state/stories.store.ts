import { Injectable } from '@angular/core';
import { Story } from './story.model';
import { EntityState, EntityStore, StoreConfig } from '../../../../../akita/src';

export interface State extends EntityState<Story> {}

const initialState: State = {
  loading: false
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'stories' })
export class StoriesStore extends EntityStore<State, Story> {
  constructor() {
    super(initialState);
  }
}
