import { EntityStoreAction, runEntityStoreAction, runStoreAction, StoreAction } from '../lib/runStoreAction';
import { BooksStore } from './booksStore';
import { createMockEntities } from './mocks';

describe('when runStoreAction', () => {
  let store: BooksStore;

  beforeEach(() => {
    store = new BooksStore();
  });

  afterEach(() => {
    store.destroy();
  });

  describe('is invoked by store class', () => {
    it('should run "Update" action', () => {
      runStoreAction(BooksStore, StoreAction.Update, (update) => update({ filter: 'COMPLETE' }));
      expect(store._value().filter).toBe('COMPLETE');
    });
  });

  describe('is invoked by store name', () => {
    it('should run "Update" action', () => {
      runStoreAction('books', StoreAction.Update, (update) => update({ filter: 'COMPLETE' }));
      expect(store._value().filter).toBe('COMPLETE');
    });
  });
});

describe('when runEntityStoreAction', () => {
  let store: BooksStore;

  beforeEach(() => {
    store = new BooksStore();
  });

  afterEach(() => {
    store.destroy();
  });

  describe('is invoked by store class', () => {
    it('should run "SetEntities" action', () => {
      runEntityStoreAction(BooksStore, EntityStoreAction.SetEntities, (set) => set(createMockEntities()));
      expect(store._value().ids.length).toBe(2);
    });

    it('should run "AddEntities" action', () => {
      runEntityStoreAction(BooksStore, EntityStoreAction.AddEntities, (add) => add(createMockEntities()));
      expect(store._value().ids.length).toBe(2);
    });

    it('should run "UpdateEntities" action', () => {
      runEntityStoreAction(BooksStore, EntityStoreAction.AddEntities, (add) => add(createMockEntities()));
      runEntityStoreAction(BooksStore, EntityStoreAction.UpdateEntities, (update) => update(2, { title: 'New Title' }));
      expect(store._value().entities[2].title).toBe('New Title');
    });

    it('should run "UpsertEntities" action', () => {
      runEntityStoreAction(BooksStore, EntityStoreAction.AddEntities, (add) => add(createMockEntities()));

      runEntityStoreAction(BooksStore, EntityStoreAction.UpsertEntities, (upsert) =>
        upsert(2, { title: 'New Title' }, (id, newState) => ({
          id,
          ...newState,
          price: -1,
        }))
      );
      runEntityStoreAction(BooksStore, EntityStoreAction.UpsertEntities, (upsert) =>
        upsert(3, { title: 'New Title' }, (id, newState) => ({
          id,
          ...newState,
          price: -1,
        }))
      );

      expect(store._value().entities[1].title).toBe('Item 1');
      expect(store._value().entities[1].price).toBe(1);

      expect(store._value().entities[2].title).toBe('New Title');
      expect(store._value().entities[2].price).toBe(2);

      expect(store._value().entities[3].title).toBe('New Title');
      expect(store._value().entities[3].price).toBe(-1);

      expect(store._value().ids.length).toBe(3);
    });

    it('should run "UpsertManyEntities" action', () => {
      runEntityStoreAction(BooksStore, EntityStoreAction.AddEntities, (add) => add(createMockEntities()));
      runEntityStoreAction(BooksStore, EntityStoreAction.UpsertManyEntities, (upsertMany) =>
        upsertMany([
          { id: 2, title: 'New Title', price: -1 },
          { id: 4, title: 'New Title', price: -1 },
        ])
      );

      expect(store._value().entities[2].id).toBe(2);
      expect(store._value().entities[2].title).toBe('New Title');
      expect(store._value().entities[2].price).toBe(-1);

      expect(store._value().entities[4].id).toBe(4);
      expect(store._value().entities[4].title).toBe('New Title');
      expect(store._value().entities[4].price).toBe(-1);

      expect(store._value().ids.length).toBe(3);
    });

    it('should run "RemoveEntities" action', () => {
      runEntityStoreAction(BooksStore, EntityStoreAction.AddEntities, (add) => add(createMockEntities()));
      runEntityStoreAction(BooksStore, EntityStoreAction.RemoveEntities, (remove) => remove(1));
      expect(store._value().entities[1]).toBeUndefined();
      expect(store._value().ids.length).toBe(1);
    });
  });

  describe('is invoked by store name', () => {
    it('should run "SetEntities" action', () => {
      runEntityStoreAction('books', EntityStoreAction.SetEntities, (set) => set(createMockEntities()));
      expect(store._value().ids.length).toBe(2);
    });

    it('should run "AddEntities" action', () => {
      runEntityStoreAction('books', EntityStoreAction.AddEntities, (add) => add(createMockEntities()));
      expect(store._value().ids.length).toBe(2);
    });

    it('should run "UpdateEntities" action', () => {
      runEntityStoreAction('books', EntityStoreAction.AddEntities, (add) => add(createMockEntities()));
      runEntityStoreAction('books', EntityStoreAction.UpdateEntities, (update) => update(2, { title: 'New Title' }));
      expect(store._value().entities[2].title).toBe('New Title');
    });

    it('should run "UpsertEntities" action', () => {
      runEntityStoreAction('books', EntityStoreAction.AddEntities, (add) => add(createMockEntities()));

      runEntityStoreAction('books', EntityStoreAction.UpsertEntities, (upsert) =>
        upsert(2, { title: 'New Title' }, (id, newState) => ({
          id,
          ...newState,
          price: -1,
        }))
      );
      runEntityStoreAction('books', EntityStoreAction.UpsertEntities, (upsert) =>
        upsert(3, { title: 'New Title' }, (id, newState) => ({
          id,
          ...newState,
          price: -1,
        }))
      );

      expect(store._value().entities[1].title).toBe('Item 1');
      expect(store._value().entities[1].price).toBe(1);

      expect(store._value().entities[2].title).toBe('New Title');
      expect(store._value().entities[2].price).toBe(2);

      expect(store._value().entities[3].title).toBe('New Title');
      expect(store._value().entities[3].price).toBe(-1);

      expect(store._value().ids.length).toBe(3);
    });

    it('should run "UpsertManyEntities" action', () => {
      runEntityStoreAction('books', EntityStoreAction.AddEntities, (add) => add(createMockEntities()));
      runEntityStoreAction('books', EntityStoreAction.UpsertManyEntities, (upsertMany) =>
        upsertMany([
          { id: 2, title: 'New Title', price: -1 },
          { id: 4, title: 'New Title', price: -1 },
        ])
      );

      expect(store._value().entities[2].id).toBe(2);
      expect(store._value().entities[2].title).toBe('New Title');
      expect(store._value().entities[2].price).toBe(-1);

      expect(store._value().entities[4].id).toBe(4);
      expect(store._value().entities[4].title).toBe('New Title');
      expect(store._value().entities[4].price).toBe(-1);

      expect(store._value().ids.length).toBe(3);
    });

    it('should run "RemoveEntities" action', () => {
      runEntityStoreAction('books', EntityStoreAction.AddEntities, (add) => add(createMockEntities()));
      runEntityStoreAction('books', EntityStoreAction.RemoveEntities, (remove) => remove(1));
      expect(store._value().entities[1]).toBeUndefined();
      expect(store._value().ids.length).toBe(1);
    });
  });
});
