import { StoreConfig } from '../src/api/store-config';
import { persistState } from '../src/enhancers/persist-state';
import { Store } from '../src/api/store';

@StoreConfig({
  name: 'todos'
})
class TodosStore extends Store<any> {
  constructor() {
    super({ todos: [] });
  }
}

@StoreConfig({
  name: 'todosUi'
})
class TodosUiStore extends Store<any> {
  constructor() {
    super({ filter: 'SHOW_ALL' });
  }
}

describe('Persist state - similar store names', () => {
  localStorage.clear();
  const storageState = {
    todos: { todos: ['Akita'] },
    todosUi: { filter: 'SHOW_COMPLETED' }
  };
  localStorage.setItem('AkitaStores', JSON.stringify(storageState));

  persistState({ include: ['todosUi', 'todos'] });

  const todosStore = new TodosStore();
  const todosUiStore = new TodosUiStore();

  it('should persist only the exact name', () => {
    expect(todosStore._value().todos).toEqual(['Akita']);
    expect(todosUiStore._value().filter).toEqual('SHOW_COMPLETED');
  });
});
