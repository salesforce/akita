import { TodosStore } from './todos.store';
import { createTodo, Todo } from './todo.model';
import { Injectable } from '@angular/core';
import { VISIBILITY_FILTER } from '../filter/filter.model';
import { ID, transaction } from '../../../../../akita/src';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private id = 0;

  constructor(private todosStore: TodosStore) {}

  @transaction()
  addBatch() {
    this.todosStore.add({
      id: ++this.id,
      title: `Todo ${this.id}`,
      completed: false
    });

    this.todosStore.add({
      id: ++this.id,
      title: `Todo ${this.id}`,
      completed: false
    });

    this.todosStore.add({
      id: ++this.id,
      title: `Todo ${this.id}`,
      completed: false
    });
  }

  @transaction()
  updateBatch() {
    this.todosStore.update(1, { completed: true });
    this.todosStore.update(2, { completed: true });
    this.todosStore.update(3, { completed: true });
  }

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
    const todo = createTodo({
      id: ++this.id,
      title
    });
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
