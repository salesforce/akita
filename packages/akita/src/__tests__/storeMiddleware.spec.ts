import { EntityStore, StoreConfig } from '..';
import { BooksStore } from './booksStore';
import { createMockEntities } from './mocks';

@StoreConfig({ name: 'test' })
class TestStore extends EntityStore<any, any> {}

describe('Middleware', () => {
  describe('akitaPreAddEntity', () => {
    it('should apply akitaPreAddEntity middleware', () => {
      BooksStore.prototype.akitaPreAddEntity = function (book) {
        if (book.price === 1) {
          return {
            ...book,
            price: 20,
          };
        }

        return book;
      };
      const store = new BooksStore();
      store.add(createMockEntities());

      expect(store._value().entities[1].price).toBe(20);
      store.remove();
      store.set(createMockEntities());
      expect(store._value().entities[1].price).toBe(20);
    });

    it('should bind akitaPreAddEntity to the store context', () => {
      (BooksStore.prototype as any).doSomethingElse = function () {
        return 80;
      };

      BooksStore.prototype.akitaPreAddEntity = function (book) {
        if (book.price === 1) {
          return {
            ...book,
            price: this.doSomethingElse(),
          };
        }

        return book;
      };
      const store = new BooksStore();
      store.add(createMockEntities());

      expect(store._value().entities[1].price).toBe(80);
      store.remove();
      store.set(createMockEntities());
      expect(store._value().entities[1].price).toBe(80);
    });
  });

  describe('akitaPreUpdateEntity', () => {
    it('should apply akitaPreUpdateEntity middleware', () => {
      BooksStore.prototype.akitaPreUpdateEntity = function (prevBook, nextBook) {
        if (nextBook.price === 100) {
          return {
            ...prevBook,
            price: 99,
          };
        }

        return nextBook;
      };
      const store = new BooksStore();
      store.add(createMockEntities());
      store.update(2, { price: 100 });

      expect(store._value().entities[2].price).toBe(99);
    });

    it('should bind akitaPreUpdateEntity to the store context', () => {
      (BooksStore.prototype as any).doSomethingElse = function () {
        return 80;
      };

      BooksStore.prototype.akitaPreUpdateEntity = function (prevBook, nextBook) {
        if (nextBook.price === 100) {
          return {
            ...prevBook,
            price: this.doSomethingElse(),
          };
        }

        return nextBook;
      };
      const store = new BooksStore();

      store.add(createMockEntities());
      store.update(2, { price: 100 });

      expect(store._value().entities[2].price).toBe(80);
    });
  });
});
