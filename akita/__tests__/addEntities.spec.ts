import { createMockEntities, entitiesMapMock } from './mocks';
import { addEntities } from '../src/addEntities';
import { BooksStore } from './booksStore.test';

describe('addEntities', () => {
  it('should do nothing if the collection is empty', () => {
    const store = new BooksStore();
    spyOn(store, '_setState');
    store.add([]);
    expect(store._setState).not.toHaveBeenCalled();
  });

  it('should add entities', () => {
    const store = new BooksStore();
    store.add(createMockEntities());
    expect(store._value().ids).toEqual([1, 2]);
    expect(store._value().entities).toEqual(entitiesMapMock);
    store.remove();
  });

  it('should NOT add if all exist', () => {
    const store = new BooksStore();
    store.add(createMockEntities());
    expect(store._value().ids).toEqual([1, 2]);
    expect(store._value().entities).toEqual(entitiesMapMock);
    spyOn(store, '_setState');
    store.add(createMockEntities());
    expect(store._value().ids).toEqual([1, 2]);
    expect(store._value().entities).toEqual(entitiesMapMock);
    expect(store._setState).not.toHaveBeenCalled();
    store.remove();
  });

  it('should add only what not exist', () => {
    const store = new BooksStore();
    store.add(createMockEntities());
    expect(store._value().ids).toEqual([1, 2]);
    expect(store._value().entities).toEqual(entitiesMapMock);
    store.add([...createMockEntities(), ...createMockEntities(10, 12)]);
    expect(store._value().ids).toEqual([1, 2, 11, 12]);
    expect(Object.keys(store._value().entities).length).toEqual(4);
    store.remove();
  });

  it('should prepend', () => {
    const store = new BooksStore();
    store.add(createMockEntities());
    store.add(createMockEntities(10, 12), { prepend: true });
    expect(store._value().ids).toEqual([12, 11, 1, 2]);
    for (const id of [12, 11, 1, 2]) {
      expect(store._value().entities[id]).toBeDefined();
    }
    store.remove();
  });

  it('should reset the loading back to false', () => {
    const store = new BooksStore();
    expect(store._value().loading).toBeTruthy();
    store.add(createMockEntities(), { loading: false });
    expect(store._value().loading).toBeFalsy();
  });
});
