import { Injectable } from '@angular/core';
import { State, TodosStore } from './todos.store';
import { Todo } from './todo.model';
import { combineLatest } from 'rxjs';
import { VISIBILITY_FILTER } from '../filter/filter.model';
import { QueryEntity } from '../../../../../akita/src';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodosQuery extends QueryEntity<State, Todo> {
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

  /**
   *
   * @param filter
   * @param todos
   * @returns {Todo[]}
   */
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
