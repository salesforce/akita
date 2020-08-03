import { EntityState, EntityStore, StoreConfig } from '../../lib';
import { update } from '../../lib/actions/index';

interface Todo {
  id: number;
  title: string;
  done?: boolean;
}

interface TodosState extends EntityState<Todo, number> {
  name?: string;
}

@StoreConfig({ name: 'TodosStore' })
class TodosStore extends EntityStore<TodosState> {}

describe('commit middleware', () => {
  let store: TodosStore;

  afterAll(() => {
    if (store) {
      store.destroy();
      store = undefined;
    }
  });

  it('intercept actions', () => {
    store = new TodosStore({});
    store.attachMiddleware((store, apply, commit) => {
      return apply(update({ name: 'error2' }));
    });

    expect(store._value().name).toEqual(undefined);
    store.apply(update({ name: 'error' }));
    expect(store._value().name).toEqual('error2');
  });

  it('suppress actions', () => {
    store = new TodosStore({});
    store.attachMiddleware((store, apply, commit) => {
      return undefined;
    });

    expect(store._value().name).toEqual(undefined);
    store.apply(update({ name: 'error' }));
    expect(store._value().name).toBeUndefined();
  });
});
