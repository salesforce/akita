import { TodosStore } from './todos.store';
import { createTodo, Todo } from './todo.model';
import { Injectable, Inject } from '@angular/core';
import { VISIBILITY_FILTER } from '../filter/filter.model';
import { ID, action } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class TodosService {
  constructor(private todosStore: TodosStore) {}

  @action('Update filter')
  updateFilter(filter: VISIBILITY_FILTER) {
    this.todosStore.update({
      ui: {
        filter
      }
    });
  }

  complete({ id, completed }: Todo) {
    this.todosStore.update(id, { completed });
  }

  add(title: string) {
    const todo = createTodo(title);
    this.todosStore.add(todo);
  }

  delete(id: ID) {
    this.todosStore.remove(id);
  }

  checkAll(completed: boolean) {
    this.todosStore.update(null, {
      completed
    });
  }

  move(index: number) {
    console.log('TCL: move -> index', index);
    this.todosStore.move(index, index - 1);
  }
}
