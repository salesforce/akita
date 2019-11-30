import { EntityStore } from '../src/entityStore';
import { Store } from '../src/store';
import { snapshotManager } from '../src/snapshotManager';
import { StoreConfig } from '../src/storeConfig';

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
    super({});
  }
}

const todos = new TodosStore();
const auth = new AuthStore();

todos.add([{ id: 1 }]);
auth._setState(() => {
  return {
    id: 1,
    firstName: 'Netanel',
    lastName: 'Basal',
    token: 'token'
  };
});

describe('Snapshot manager', () => {
  it('should get the whole snapshot', () => {
    const expected = {
      todos: {
        entities: { '1': { id: 1 } },
        ids: [1],
        loading: false,
        error: null
      },
      auth: { id: 1, firstName: 'Netanel', lastName: 'Basal', token: 'token' }
    };
    expect(snapshotManager.getStoresSnapshot()).toEqual(expected);
  });

  it('should get only todos', () => {
    const expected = {
      todos: {
        entities: { '1': { id: 1 } },
        ids: [1],
        loading: false,
        error: null
      }
    };
    expect(snapshotManager.getStoresSnapshot(['todos'])).toEqual(expected);
  });

  it('should set snapshot', () => {
    todos.remove();
    const value = {
      todos: {
        entities: { '1': { id: 1 } },
        ids: [1],
        loading: true,
        error: null
      }
    };
    snapshotManager.setStoresSnapshot(value);
    expect(todos._value()).toEqual({
      entities: { '1': { id: 1 } },
      ids: [1],
      loading: true,
      error: null
    });
  });

  it('should set snapshot - support JSON', () => {
    todos.remove();
    const value = `{
      "todos": {
        "entities": { "1": { "id": 1 } },
        "ids": [1],
        "loading": true,
        "error": null
      }
    }`;
    snapshotManager.setStoresSnapshot(value);
    expect(todos._value()).toEqual({
      entities: { '1': { id: 1 } },
      ids: [1],
      loading: true,
      error: null
    });
  });
});
