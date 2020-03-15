import { EntityStore } from '../lib/entityStore';
import { persistState } from '../lib/persistState';
import { Store } from '../lib/store';
import { StoreConfig } from '../lib/storeConfig';
import { tick } from './setup';

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

describe('persistState - Exclude', () => {
  const storage = persistState({
    exclude: ['cart', 'products']
  });

  afterAll(() => storage.destroy());

  const todos = new TodosStore();
  const products = new ProductsStore();
  const cart = new CartStore();
  const auth = new AuthStore();

  it('should start empty', async () => {
    await tick();
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual(null);
  });

  it('should NOT save if in exclude', async () => {
    products.add([{ id: 1 }]);
    cart.add([{ id: 1 }]);
    await tick();
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual(null);
  });

  it('should save if NOT in exclude', async () => {
    todos.add([{ id: 1 }]);
    auth._setState(() => {
      return {
        id: 1,
        firstName: 'Netanel',
        lastName: 'Basal',
        token: 'token'
      };
    });
    await tick();
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toMatchObject({
      auth: { id: 1, firstName: 'Netanel', lastName: 'Basal', token: 'token' },
      todos: {
        entities: {
          '1': {
            id: 1
          }
        },
        error: null,
        ids: [1],
        loading: false
      }
    });
  });
});
