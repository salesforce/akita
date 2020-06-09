import { EntityStore } from '../lib/entityStore';
import { persistState, PersistStateSelectFn } from '../lib/persistState';
import { Store } from '../lib/store';
import { StoreConfig } from '../lib/storeConfig';
import { tick } from './setup';

interface TodosState {
  todos: any[];
  ui: {
    filter: string;
  };
}

@StoreConfig({
  name: 'todos',
})
class TodosStore extends Store<TodosState> {
  constructor() {
    super({
      todos: [],
      ui: {
        filter: '',
      },
    });
  }
}

@StoreConfig({
  name: 'products',
})
class ProductsStore extends EntityStore<any, any> {
  constructor() {
    super();
  }
}

describe('persistState - Select', () => {
  const selectTodos: PersistStateSelectFn<TodosState> = function (store) {
    return { todos: store.todos };
  };
  selectTodos.storeName = 'todos';

  const storage = persistState({
    select: [selectTodos],
  });

  afterAll(() => storage.destroy());

  const todos = new TodosStore();
  const products = new ProductsStore();

  it('should start with initial state', async () => {
    await tick();
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual(null);
  });

  it('should save the whole state if not in select', async () => {
    await tick();
    products.add([{ id: 1 }]);
    await tick();
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toMatchObject({
      products: {
        entities: {
          '1': {
            id: 1,
          },
        },
        error: null,
        ids: [1],
        loading: false,
      },
    });
  });

  it('should save only selected state data if in select', async () => {
    await tick();
    todos.update({ todos: [{ id: 0 }] });
    await tick();
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toMatchObject({
      todos: {
        todos: [{ id: 0 }],
      },
    });
  });
});
