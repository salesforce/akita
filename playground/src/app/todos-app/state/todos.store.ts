import { Todo } from './todo.model';
import { VISIBILITY_FILTER } from '../filter/filter.model';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig, ActiveState } from '@datorama/akita';

export interface TodosState extends EntityState<Todo>, ActiveState {
  ui: {
    filter: VISIBILITY_FILTER;
  };
}

const initialState = {
  ui: { filter: VISIBILITY_FILTER.SHOW_ALL }
};

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'todos'
})
export class TodosStore extends EntityStore<TodosState, Todo> {
  constructor() {
    super(initialState);
  }
}
