import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { selectMany, selectManyFn, selectOne } from '../../../lib/selectors';

interface Todo {
  id: number;
  title: string;
  done?: boolean;
}

interface TodosState extends EntityState<Todo, number> {}

@StoreConfig({ name: 'TodosStore' })
class TodosStore extends EntityStore<TodosState> {}

describe('select state by operator', () => {
  let store: TodosStore;

  afterAll(() => {
    if (store) {
      store.destroy();
      store = undefined;
    }
  });

  it('should return one entity', () => {
    store = new TodosStore({});
    store.add({ id: 1, title: 'title 1' });
    const spy = jest.fn();
    store.state$.pipe(selectOne(1)).subscribe(spy);
    expect(spy).toHaveBeenCalledWith({ id: 1, title: 'title 1' });
  });

  it('should return many entities', () => {
    store = new TodosStore({});
    store.add({ id: 1, title: 'title 1' });
    store.add({ id: 2, title: 'title 2' });
    const spy = jest.fn();
    store.state$.pipe(selectMany([1, 2])).subscribe(spy);
    expect(spy).toHaveBeenCalledWith([
      { id: 1, title: 'title 1' },
      { id: 2, title: 'title 2' },
    ]);
  });

  it('should return many entities by predicate', () => {
    store = new TodosStore({});
    store.add({ id: 1, title: 'title 1' });
    const spy = jest.fn();
    store.state$.pipe(selectManyFn((entity) => entity.id === 1)).subscribe(spy);
    expect(spy).toHaveBeenCalledWith([{ id: 1, title: 'title 1' }]);
  });
});
