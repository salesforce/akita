import { Injectable } from '@angular/core';
import { Story } from './story.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface State extends EntityState<Story> {
  loading: boolean;
  someBoolean: boolean;
  skills: string[];
  config: {
    tankOwners: string[];
    time: string;
    isAdmin: boolean;
  };
}

const initialState: State = {
  loading: false,
  someBoolean: true,
  skills: ['JS'],
  config: {
    time: '',
    tankOwners: ['one', 'two '],
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
