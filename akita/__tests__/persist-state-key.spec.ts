import { StoreConfig } from '../src/api/store-config';
import { EntityStore } from '../src/api/entity-store';
import { persistState } from '../src/enhancers/persist-state';
import { Store } from '../src/index';

@StoreConfig({
  name: 'todos'
})
class TodosStore extends EntityStore<any, any> {
  constructor() {
    super({ ui: { filter: 'SHOW_ALL' } });
  }
}

describe('Persist state - prop', () => {
  localStorage.clear();

  persistState({ include: ['todos.ui'] });

  const todosStore = new TodosStore();

  it('should persist only the ui key', () => {
    todosStore.updateRoot({ ui: { filter: 'SHOW_COMPLETED' } });
    expect(JSON.parse(localStorage.getItem('AkitaStores')).todos).toEqual({ filter: 'SHOW_COMPLETED' });
  });
});

describe('Persist state - initial', () => {
  localStorage.clear();
  localStorage.setItem('AkitaStores', JSON.stringify({ todos: { filter: 'SHOW_COMPLETED' } }));

  persistState({ include: ['todos.ui'] });

  const todosStore = new TodosStore();

  it('should persist only the ui key', () => {
    expect(todosStore._value().ui).toEqual({ filter: 'SHOW_COMPLETED' });
  });
});

describe('Persist state - nested key', () => {
  localStorage.clear();

  @StoreConfig({
    name: 'todos'
  })
  class TodosStore extends EntityStore<any, any> {
    constructor() {
      super({ a: { b: { c: { d: 'test' } } } });
    }
  }

  persistState({ include: ['todos.a.b.c.d'], key: 'TestA' });
  const todosStore = new TodosStore();

  it('should persist only the nested key', () => {
    todosStore.updateRoot({ a: { b: { c: { d: 'changed' } } } });
    expect(JSON.parse(localStorage.getItem('TestA')).todos).toEqual('changed');
  });
});

describe('Persist state - nested key initial', () => {
  localStorage.clear();
  localStorage.setItem('AkitaStores', JSON.stringify({ todos: 'changed' }));

  @StoreConfig({
    name: 'todos'
  })
  class TodosStore extends EntityStore<any, any> {
    constructor() {
      super({ a: { b: { c: { e: 'hello', d: 'test', f: { g: 'Akita' } } } } });
    }
  }

  persistState({ include: ['todos.a.b.c.d'] });

  const todosStore = new TodosStore();

  it('should persist only the d key', () => {
    expect(todosStore._value().a.b.c.d).toEqual('changed');
    expect(todosStore._value().a.b.c.e).toEqual('hello');
    expect(todosStore._value().a.b.c.f.g).toEqual('Akita');
  });
});

describe('Persist state - similar store names', () => {
  localStorage.clear();
  localStorage.setItem('AkitaStores', JSON.stringify({ tasksUi: { filter: 'SHOW_COMPLETED' }, tasks: { tasks: ['Akita'] } }));

  @StoreConfig({
    name: 'tasks'
  })
  class TasksStore extends Store<any> {
    constructor() {
      super({ tasks: [] });
    }
  }

  @StoreConfig({
    name: 'tasksUi'
  })
  class TasksUiStore extends Store<any> {
    constructor() {
      super({ filter: 'SHOW_ALL' });
    }
  }

  persistState({ include: ['tasksUi', 'tasks'] });

  const tasksStore = new TasksStore();
  const tasksUiStore = new TasksUiStore();

  it('should persist only the exact name', () => {
    expect(tasksStore._value().tasks).toEqual(['Akita']);
    expect(tasksUiStore._value().filter).toEqual('SHOW_COMPLETED');
  });
});
