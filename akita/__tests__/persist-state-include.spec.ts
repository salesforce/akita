import { EntityStore } from '../src/api/entity-store';
import { persistState } from '../src/plugins/persist-state';
import { Store } from '../src/api/store';

class TodosStore extends EntityStore<any, any> {
  constructor() {
    super();
  }
}

class ProductsStore extends EntityStore<any, any> {
  constructor() {
    super();
  }
}

class CartStore extends EntityStore<any, any> {
  constructor() {
    super({});
  }
}

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

  it('should start empty', () => {
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toBeNull();
  });

  it('should NOT save if not in include', () => {
    products.add([{ id: 1 }]);
    cart.add([{ id: 1 }]);
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual({});
  });

  it('should save if in include', () => {
    todos.add([{ id: 1 }]);
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual({
      TodosStore: {
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
