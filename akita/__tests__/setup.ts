import { EntityStore } from '../src/api/entity-store';
import { ActiveState, EntityState, ID } from '../src/api/types';
import { StoreConfig } from '../src/api/store-config';
import { QueryEntity } from '../src/api/query-entity';

export class Todo {
  id: ID;
  title?: string;
  completed? = false;
  price?: number;
  constructor(params: Todo) {
    Object.assign(this, params);
    if (!params.title) {
      this.title = params.id.toString();
    }
  }
}

export interface State extends EntityState<Todo>, ActiveState {
  metadata?: { name: string };
}

export const initialState: State = {
  active: null,
  metadata: { name: 'metadata' }
};

@StoreConfig({
  name: 'todos'
})
export class TodosStore extends EntityStore<State, Todo> {
  constructor() {
    super(initialState);
  }
}

export type TodoCustomID = {
  todoId: ID;
  title?: string;
  completed?;
};

export interface StateTwo extends EntityState<TodoCustomID> {}

@StoreConfig({
  name: 'todos',
  idKey: 'todoId'
})
export class TodosStoreCustomID extends EntityStore<StateTwo, TodoCustomID> {
  constructor() {
    super(initialState, { idKey: 'todoId' });
  }
}

export function createTodos(len) {
  const arr = [];
  const factory = ct();
  for (var i = 0; i < len; i++) {
    arr.push(factory());
  }
  return arr;
}

export function ct() {
  let count = 0;
  return function() {
    const id = count++;
    return {
      id,
      title: `Todo ${id}`,
      complete: false
    };
  };
}

export function cot() {
  return {
    id: 1,
    title: `Todo ${1}`,
    complete: false
  } as Todo;
}

export type Widget = {
  id: ID;
  title: string;
  complete?: boolean;
};

@StoreConfig({ name: 'widgets' })
export class WidgetsStore extends EntityStore<any, Widget> {
  constructor(initState?) {
    super(initState);
  }
}

export class WidgetsQuery extends QueryEntity<any, Widget> {
  constructor(protected store) {
    super(store);
  }
}

export function createWidget(id) {
  return {
    id,
    title: `Widget ${id}`,
    complete: false
  } as Widget;
}
