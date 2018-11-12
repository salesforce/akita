import { EntityStore } from '../src/api/entity-store';
import { Store } from '../src/api/store';
import { resetStores } from '../src/api/store-utils';
import { StoreConfig } from '../src/api/store-config';
import { akitaConfig } from '../src/api/config';

akitaConfig({
  resettable: true
});

@StoreConfig({
  name: 'todos'
})
class TodosStore extends EntityStore<any, any> {
  constructor() {
    super();
  }
}

@StoreConfig({
  name: 'auth'
})
class AuthStore extends Store<any> {
  constructor() {
    super({
      id: null,
      firstName: '',
      lastName: '',
      token: ''
    });
  }
}

const todos = new TodosStore();
const auth = new AuthStore();

todos.add([{ id: 1 }]);
auth.setState(() => {
  return {
    id: 1,
    firstName: 'Netanel',
    lastName: 'Basal',
    token: 'token'
  };
});

describe('Reset store', () => {
  afterEach(() => {
    todos.setState(() => [{ id: 1 }]);
    auth.setState(() => {
      return {
        id: 1,
        firstName: 'Netanel',
        lastName: 'Basal',
        token: 'token'
      };
    });
  });

  it('should reset store state to its initial state', () => {
    const expected = {
      entities: {},
      ids: [],
      loading: true,
      error: null
    };

    todos.reset();
    expect(todos._value()).toEqual(expected);
  });

  it('should reset all stores states', () => {
    const expected = {
      todos: {
        entities: {},
        ids: [],
        loading: true,
        error: null
      },
      auth: { id: null, firstName: '', lastName: '', token: '' }
    };
    resetStores();
    expect({ todos: todos._value(), auth: auth._value() }).toEqual(expected);
  });

  it('should reset all stores excluding the names passed as args', () => {
    const expected = {
      todos: {
        entities: {},
        ids: [],
        loading: true,
        error: null
      },
      auth: {
        id: 1,
        firstName: 'Netanel',
        lastName: 'Basal',
        token: 'token'
      }
    };
    resetStores({ exclude: ['auth'] });
    expect({ todos: todos._value(), auth: auth._value() }).toEqual(expected);
  });
});
