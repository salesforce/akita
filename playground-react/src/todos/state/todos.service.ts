import { TodosStore, todosStore } from './todos.store';
import { createTodo, VISIBILITY_FILTER } from './todo.model';
import { ID } from '../../../../akita/src';

export class TodosService {
  constructor(private todosStore: TodosStore) {}

  updateFilter(filter: VISIBILITY_FILTER) {
    this.todosStore.update({
      ui: {
        filter
      }
    });
  }

  complete(id: ID) {
    todosStore.update(id, entity => ({ completed: !entity.completed }));
  }

  add(text: string) {
    const todo = createTodo(text);
    this.todosStore.add(todo);
  }

  delete(id: ID) {
    this.todosStore.remove(id);
  }
}

export const todosService = new TodosService(todosStore);
