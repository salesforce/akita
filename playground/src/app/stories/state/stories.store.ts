import { Injectable } from '@angular/core';
import { Story } from './story.model';
import { EntityState, EntityStore, StoreConfig } from '../../../../../akita/src';

export type FormStory = {
  title: string;
  story: string;
  draft: boolean;
  category: string;
};

export interface State extends EntityState<Story> {
  ui: {
    form: FormStory;
  };
}

export const formStoryInitialState = {
  title: '',
  story: '',
  draft: false,
  category: 'js'
};

const initialState: State = {
  ui: {
    form: formStoryInitialState
  }
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'stories' })
export class StoriesStore extends EntityStore<State, Story> {
  constructor() {
    super(initialState);
    this.setLoading(false);
  }
}
