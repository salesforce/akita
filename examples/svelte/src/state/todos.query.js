import {
  createEntityQuery
} from '@datorama/akita';
import {
  todosStore
} from './todos.store';
import {
  combineLatest
} from "rxjs";

export const todosQuery = createEntityQuery(todosStore);

export const selectFilter = todosQuery.select('filter');

export const visibleTodos = combineLatest(
  selectFilter,
  todosQuery.selectAll(),
  function getVisibleTodos(filter, todos) {
    switch (filter) {
      case "SHOW_COMPLETED":
        return todos.filter(t => t.completed);
      case "SHOW_ACTIVE":
        return todos.filter(t => !t.completed);
      default:
        return todos;
    }
  }
);
