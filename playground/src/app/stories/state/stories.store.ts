import { Injectable } from '@angular/core';
import { Story } from './story.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface StoriesState extends EntityState<Story> {
  loading: boolean;
  someBoolean: boolean;
  skills: string[];
  config: {
    tankOwners: string[];
    time: string;
    isAdmin: boolean;
  };
}

const initialState: StoriesState = {
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
export class StoriesStore extends EntityStore<StoriesState> {
  constructor() {
    super(initialState);
  }
}
