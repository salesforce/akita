import { Injectable } from '@angular/core';
import { Story } from './story.model';
import { EntityState, EntityStore, StoreConfig } from '../../../../../akita/src';

export interface State extends EntityState<Story> {
  config: {
    time: string;
    isAdmin: boolean;
  };
}

const initialState: State = {
  loading: false,
  config: {
    time: '',
    isAdmin: false
  }
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'stories' })
export class StoriesStore extends EntityStore<State, Story> {
  constructor() {
    super(initialState);
  }
}
