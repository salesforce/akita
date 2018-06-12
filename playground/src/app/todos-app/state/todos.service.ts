import { TodosStore } from './todos.store';
import { createTodo, Todo } from './todo.model';
import { Injectable } from '@angular/core';
import { VISIBILITY_FILTER } from '../filter/filter.model';
import { ID } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  constructor(private todosStore: TodosStore) {}

  /**
   *
   * @param {VISIBILITY_FILTER} filter
   */
  updateFilter(filter: VISIBILITY_FILTER) {
    this.todosStore.updateRoot({
      ui: {
        filter
      }
    });
  }

  /**
   *
   * @param {ID} id
   * @param {boolean} completed
   */
  complete({ id, completed }: Todo) {
    this.todosStore.update(id, {
      completed
    });
  }

  /**
   *
   * @param {string} title
   */
  add(title: string) {
    const todo = createTodo({ id: Math.random(), title });
    this.todosStore.add(todo);
  }

  /**
   *
   * @param {ID} id
   */
  delete(id: ID) {
    this.todosStore.remove(id);
  }

  checkAll(completed: boolean) {
    this.todosStore.updateAll({
      completed
    });
  }
}
