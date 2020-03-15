import { Todo } from './todo.model';
import { VISIBILITY_FILTER } from '../filter/filter.model';
import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface TodosState extends EntityState<Todo>, ActiveState {
  ui: {
    filter: VISIBILITY_FILTER;
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'todos' })
export class TodosStore extends EntityStore<TodosState> {
  constructor() {
    super({
      ui: { filter: VISIBILITY_FILTER.SHOW_ALL }
    });
  }
}
