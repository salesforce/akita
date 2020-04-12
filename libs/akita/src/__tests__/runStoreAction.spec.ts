import { BooksStore, TestBook, TestBooksState } from './booksStore';
import { runStoreAction, StoreActions } from '../lib/runStoreAction';
import { createMockEntities } from './mocks';

describe('runStoreAction', () => {
  it('should run store actions', () => {
    const store = new BooksStore();

    runStoreAction<TestBook>('books', StoreActions.SetEntities, { payload: { data: createMockEntities() } });
    expect(store._value().ids.length).toBe(2);

    runStoreAction<TestBook>('books', StoreActions.AddEntities, { payload: { data: createMockEntities(10, 12) } });
    expect(store._value().ids.length).toBe(4);

    runStoreAction<TestBook>('books', StoreActions.UpdateEntities, {
      payload: {
        data: { title: 'New title' },
        entityIds: 2
      }
    });
    expect(store._value().entities[2].title).toBe('New title');

    runStoreAction<TestBook>('books', StoreActions.UpsertEntities, {
      payload: {
        data: { title: 'Another title' },
        entityIds: [2, 3]
      }
    });
    expect(store._value().entities[2].title).toBe('Another title');
    expect(store._value().entities[3].title).toBe('Another title');
    expect(store._value().ids.length).toBe(5);

    runStoreAction<TestBook>('books', StoreActions.UpsertEntities, {
      payload: {
        data: [
          { id: 2, title: 'New title' },
          { id: 4, title: 'Another title' }
        ]
      }
    });
    expect(store._value().entities[2].title).toBe('New title');
    expect(store._value().ids.length).toBe(6);

    runStoreAction<TestBook>('books', StoreActions.RemoveEntities, { payload: { entityIds: 1 } });
    expect(store._value().entities[1]).toBeUndefined();

    runStoreAction<TestBooksState>('books', StoreActions.Update, { payload: { data: { filter: 'COMPLETE' } } });
    expect(store._value().filter).toBe('COMPLETE');
  });
});
