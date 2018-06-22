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

const mock = `{"CartStore":{"entities":{},"ids":[],"loading":true,"error":null},"ProductsStore":{"entities":{},"ids":[],"loading":true,"error":null},"AuthStore":{"id":null,"firstName":"","lastName":"","token":""},"TodosStore":{"ui":{"filter":"SHOW_ALL"},"entities":{"0.5666823893391795":{"id":0.5666823893391795,"title":"ds","completed":true},"0.16954788680591548":{"id":0.16954788680591548,"title":"ds","completed":false}},"ids":[0.5666823893391795,0.16954788680591548],"loading":true,"error":null}}`;
localStorage.setItem('AkitaStores', mock);

describe('persistState', () => {
  const storage = persistState();

  afterAll(() => storage.destroy());

  const todos = new TodosStore();
  const products = new ProductsStore();
  const cart = new CartStore();
  const auth = new AuthStore();

  it('should get data from storage', () => {
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it('should initial the value if in storage', () => {
    expect(todos._value()).toEqual({
      ui: { filter: 'SHOW_ALL' },
      entities: {
        '0.5666823893391795': { id: 0.5666823893391795, title: 'ds', completed: true },
        '0.16954788680591548': { id: 0.16954788680591548, title: 'ds', completed: false }
      },
      ids: [0.5666823893391795, 0.16954788680591548],
      loading: true,
      error: null
    });
  });

  it('should set the value upon update', () => {
    localStorage.setItem.mockClear();
    products.add([{ id: 1 }]);
    const expected = {
      CartStore: { entities: {}, ids: [], loading: true, error: null },
      ProductsStore: { entities: { '1': { id: 1 } }, ids: [1], loading: true, error: null },
      AuthStore: { id: null, firstName: '', lastName: '', token: '' },
      TodosStore: {
        ui: { filter: 'SHOW_ALL' },
        entities: {
          '0.5666823893391795': { id: 0.5666823893391795, title: 'ds', completed: true },
          '0.16954788680591548': { id: 0.16954788680591548, title: 'ds', completed: false }
        },
        ids: [0.5666823893391795, 0.16954788680591548],
        loading: true,
        error: null
      }
    };
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual(expected);
  });

  it('should set the value upon update - simple store', () => {
    localStorage.setItem.mockClear();
    auth.setState(() => {
      return {
        id: 1,
        firstName: 'Netanel',
        lastName: 'Basal',
        token: 'token'
      };
    });
    const expected = {
      CartStore: { entities: {}, ids: [], loading: true, error: null },
      ProductsStore: { entities: { '1': { id: 1 } }, ids: [1], loading: true, error: null },
      AuthStore: { id: 1, firstName: 'Netanel', lastName: 'Basal', token: 'token' },
      TodosStore: {
        ui: { filter: 'SHOW_ALL' },
        entities: {
          '0.5666823893391795': { id: 0.5666823893391795, title: 'ds', completed: true },
          '0.16954788680591548': { id: 0.16954788680591548, title: 'ds', completed: false }
        },
        ids: [0.5666823893391795, 0.16954788680591548],
        loading: true,
        error: null
      }
    };
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual(expected);
  });

  it('should clear store', () => {
    storage.clearStore('todos');
    const expected = {
      CartStore: { entities: {}, ids: [], loading: true, error: null },
      ProductsStore: { entities: { '1': { id: 1 } }, ids: [1], loading: true, error: null },
      AuthStore: { id: 1, firstName: 'Netanel', lastName: 'Basal', token: 'token' }
    };
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toEqual(expected);
  });

  it('should clear all', () => {
    storage.clear();
    expect(JSON.parse(localStorage.getItem('AkitaStores'))).toBeNull();
  });
});
