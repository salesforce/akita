import { Injectable } from '@angular/core';
import { TodosState, TodosStore } from './todos.store';
import { Todo } from './todo.model';
import { combineLatest } from 'rxjs';
import { VISIBILITY_FILTER } from '../filter/filter.model';
import { QueryEntity } from '@datorama/akita';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TodosQuery extends QueryEntity<TodosState> {
  selectVisibilityFilter$ = this.select(state => state.ui.filter);

  selectVisibleTodos$ = combineLatest(this.selectVisibilityFilter$, this.selectAll()).pipe(
    map(([filter, todos]) => {
      return this.getVisibleTodos(filter, todos);
    })
  );

  checkAll$ = this.selectCount(entity => entity.completed);

  constructor(protected store: TodosStore) {
    super(store);
  }

  private getVisibleTodos(filter, todos): Todo[] {
    switch (filter) {
      case VISIBILITY_FILTER.SHOW_COMPLETED:
        return todos.filter(t => t.completed);
      case VISIBILITY_FILTER.SHOW_ACTIVE:
        return todos.filter(t => !t.completed);
      default:
        return todos;
    }
  }
}
