import { TodosState, todosStore, TodosStore } from './todos.store';
import { Todo } from './todo.model';
import { combineLatest } from 'rxjs';
import { QueryEntity } from '@datorama/akita';

export class TodosQuery extends QueryEntity<TodosState, Todo> {
  selectVisibilityFilter$ = this.select(state => state.ui.filter);

  selectVisibleTodos$ = combineLatest(this.selectVisibilityFilter$, this.selectAll(), this.getVisibleTodos);

  constructor(protected store: TodosStore) {
    super(store);
  }

  private getVisibleTodos(filter: string, todos: Todo[]): Todo[] {
    switch (filter) {
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed);
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed);
      default:
        return todos;
    }
  }
}

export const todosQuery = new TodosQuery(todosStore);
