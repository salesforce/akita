import { EntityStore } from '../src/api/entity-store';
import { persistState } from '../src/plugins/persist-state';
import { Store } from '../src/api/store';
import { StoreConfig } from '../src/api/store-config';

@StoreConfig({
  name: 'todos'
})
class TodosStore extends EntityStore<any, any> {
  constructor() {
    super();
  }
}

@StoreConfig({
  name: 'products'
})
class ProductsStore extends EntityStore<any, any> {
  constructor() {
    super();
  }
}

@StoreConfig({
  name: 'cart'
})
class CartStore extends EntityStore<any, any> {
  constructor() {
    super();
  }
}

@StoreConfig({
  name: 'auth'
})
class AuthStore extends Store<any> {
  constructor() {
    super({});
  }
}

describe('persistState - Include', () => {
  const storage = persistState({
    include: ['todos']
  });

  afterAll(() => storage.destroy());

  const todos = new TodosStore();
  const products = new ProductsStore();
  const cart = new CartStore();
  const auth = new AuthStore();

  it('should start with initial state', () => {
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual({ todos: { entities: {}, error: null, ids: [], loading: true } });
  });

  it('should NOT save if not in include', () => {
    products.add([{ id: 1 }]);
    cart.add([{ id: 1 }]);
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual({ todos: { entities: {}, error: null, ids: [], loading: true } });
  });

  it('should save if in include', () => {
    todos.add([{ id: 1 }]);
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual({
      todos: {
        entities: {
          '1': {
            id: 1
          }
        },
        error: null,
        ids: [1],
        loading: true
      }
    });
  });
});
