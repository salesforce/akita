import { EntityState, EntityStore, StoreConfig } from '../../lib';
import { insertMany, insertOne, update } from '../../lib/actions/index';

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

describe('commit action', () => {
  let store: TodosStore;

  afterAll(() => {
    if (store) {
      store.destroy();
      store = undefined;
    }
  });

  it('update', () => {
    store = new TodosStore({});
    expect(store._value().name).toEqual(undefined);
    store.apply(update({ name: 'error' }));
    expect(store._value().name).toEqual('error');
  });

  it('insertOne', () => {
    store = new TodosStore({});
    expect(store._value().entities).toEqual({});
    store.apply(insertOne({ id: 1, title: 'title 1' }));
    expect(store._value().entities).toEqual({ '1': { id: 1, title: 'title 1' } });
  });

  it('insertMany', () => {
    store = new TodosStore({});
    expect(store._value().entities).toEqual({});
    store.apply(
      insertMany([
        { id: 1, title: 'title 1' },
        { id: 2, title: 'title 2' },
      ])
    );
    expect(store._value().entities).toEqual({
      '1': { id: 1, title: 'title 1' },
      '2': { id: 2, title: 'title 2' },
    });
  });
});
