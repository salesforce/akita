import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { EMPTY, of } from 'rxjs';
import { filter, switchMapTo, tap } from 'rxjs/operators';
import { insertOne, typeOf, update } from '../../../lib/actions/index';

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
    store.attachEffect((commits$) =>
      commits$.pipe(
        typeOf(update),
        tap((x) => console.log(x))
      )
    ); //,  filter(({ action: { type, args: [state] } }) => state.name === 'error' ), switchMapTo(of(update({ name: 'error2'})))))
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
