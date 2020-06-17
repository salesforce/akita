import { BooksStore, TestBook, TestBooksState } from './booksStore';
import { EntityStoreAction, getEntityStore, runEntityStoreAction, runStoreAction, StoreAction } from '../lib/runStoreAction';
import { createMockEntities } from './mocks';

describe('runStoreAction', () => {
  it('should run store actions', () => {
    const store = new BooksStore();

    runEntityStoreAction(BooksStore, EntityStoreAction.SetEntities, (set) => set(createMockEntities()));
    expect(store._value().ids.length).toBe(2);

    runEntityStoreAction(BooksStore, EntityStoreAction.AddEntities, (add) => add(createMockEntities(10, 12)));
    expect(store._value().ids.length).toBe(4);

    runEntityStoreAction(BooksStore, EntityStoreAction.UpdateEntities, (update) => update(2, { title: 'New title' }));
    expect(store._value().entities[2].title).toBe('New title');

    runEntityStoreAction('books', EntityStoreAction.UpdateEntities, (update) => update(2, { title: 'New title 2' }));
    expect(store._value().entities[2].title).toBe('New title 2');

    runEntityStoreAction(BooksStore, EntityStoreAction.UpsertEntities, (upsert) => upsert([2, 3], { title: 'Another title 2' }, (id, newState) => ({ id, ...newState, price: 0 })));
    expect(store._value().entities[2].title).toBe('Another title 2');
    expect(store._value().entities[3].title).toBe('Another title 2');
    expect(store._value().ids.length).toBe(5);

    runEntityStoreAction('books', EntityStoreAction.UpsertEntities, (upsert) => upsert([2, 3], { title: 'Another title 3' }, (id, newState) => ({ id, ...newState, price: 0 })));
    expect(store._value().entities[2].title).toBe('Another title 3');
    expect(store._value().entities[3].title).toBe('Another title 3');
    expect(store._value().ids.length).toBe(5);

    runEntityStoreAction(BooksStore, EntityStoreAction.UpsertManyEntities, (upsertMany) =>
      upsertMany([
        { id: 2, title: 'New title', price: 0 },
        { id: 4, title: 'Another title', price: 0 },
      ])
    );
    expect(store._value().entities[2].title).toBe('New title');
    expect(store._value().ids.length).toBe(6);

    runEntityStoreAction(BooksStore, EntityStoreAction.RemoveEntities, (remove) => remove(1));
    expect(store._value().entities[1]).toBeUndefined();

    runStoreAction(BooksStore, StoreAction.Update, (update) => update({ filter: 'COMPLETE' }));
    expect(store._value().filter).toBe('COMPLETE');

    runStoreAction('books', StoreAction.Update, (update) => update({ filter: 'COMPLETE 2' }));
    expect(store._value().filter).toBe('COMPLETE 2');
  });
});
