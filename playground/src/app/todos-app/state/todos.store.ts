import { Todo } from './todo.model';
import { VISIBILITY_FILTER } from '../filter/filter.model';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig, ActiveState } from '@datorama/akita';

export interface State extends EntityState<Todo>, ActiveState {
  ui: {
    filter: VISIBILITY_FILTER;
  };
}

const initialState = {
  ui: { filter: VISIBILITY_FILTER.SHOW_ALL }
};

@Injectable({
  providedIn: 'root'
})
@StoreConfig({
  name: 'todos'
})
export class TodosStore extends EntityStore<State, Todo> {
  constructor() {
    super(initialState);
  }
}
