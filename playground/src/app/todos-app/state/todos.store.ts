import { Todo } from './todo.model';
import { EntityState, EntityStore } from '@datorama/akita';
import { StoreConfig } from '../../../../../akita/src/api/store-config';
import { VISIBILITY_FILTER } from '../filter/filter.model';
import { Injectable } from '@angular/core';

export interface State extends EntityState<Todo> {
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
