import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { insertOne, update } from '../../../lib/actions/index';

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

  it('insert one', () => {
    store = new TodosStore({});
    expect(store._value().entities).toEqual({});
    store.apply(insertOne({ id: 1, title: 'title 1' }));
    expect(store._value().entities).toEqual({ '1': { id: 1, title: 'title 1' } });
  });
});
