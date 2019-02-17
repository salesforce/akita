import { createMockEntities } from './mocks';
import { DEFAULT_ID_KEY, getInitialEntitiesState, setEntities } from '@datorama/akita';
import { entitiesMapMock } from './mocks';
import { BooksStore } from './booksStore.test';

describe('setEntities', () => {
  it('should support array of entities', () => {
    const data = createMockEntities();
    const entityState = getInitialEntitiesState();
    const newState = setEntities({ state: entityState, idKey: DEFAULT_ID_KEY, entities: data });
    expect(newState.ids.length).toBe(2);
    expect(newState.entities).toEqual(entitiesMapMock);
  });

  it('should support ids and entities object', () => {
    const data = {
      entities: entitiesMapMock,
      ids: [1, 2]
    };
    const entityState = getInitialEntitiesState();
    const newState = setEntities({ state: entityState, entities: data, idKey: DEFAULT_ID_KEY });
    expect(newState.ids.length).toBe(2);
    expect(newState.entities).toEqual(entitiesMapMock);
  });

  it('should do nothing if nil', () => {
    const store = new BooksStore();
    spyOn(store, 'setState');
    store.set(null);
    expect(store.setState).not.toHaveBeenCalled();
  });

  it('should do nothing if the collection is empty', () => {
    const store = new BooksStore();
    spyOn(store, 'setState');
    store.set([]);
    expect(store.setState).not.toHaveBeenCalled();
  });
});

describe('setEntities with Active State', () => {
  it('should reset the active when not exist', () => {
    const data = createMockEntities();
    const entityState = { ...getInitialEntitiesState(), active: 5 };
    const newState = setEntities({ state: entityState, idKey: DEFAULT_ID_KEY, entities: data });
    expect(newState.active).toBe(null);
  });

  it('should NOT reset active when exist', () => {
    const data = createMockEntities();
    const entityState = { entities: entitiesMapMock, active: 1 };
    const newState = setEntities({ state: entityState, idKey: DEFAULT_ID_KEY, entities: data });
    expect(newState.active).toBe(1);
  });
});

describe('setEntities with Active Multi', () => {
  it('should reset the active to empty array when not exist', () => {
    const data = createMockEntities();
    const entityState = { ...getInitialEntitiesState(), active: [3, 4] };
    const newState = setEntities({ state: entityState, idKey: DEFAULT_ID_KEY, entities: data });
    expect(newState.active).toEqual([]);
  });

  it('should NOT reset active when exist', () => {
    const data = createMockEntities();
    const ids = [1, 2];
    const entityState = { entities: entitiesMapMock, ids, active: ids };
    const newState = setEntities({ state: entityState, idKey: DEFAULT_ID_KEY, entities: data });
    expect(newState.active).toBe(ids);
  });

  it('should remove active when NOT exist', () => {
    const data = createMockEntities();
    const entityState = { entities: entitiesMapMock, ids: [1], active: [1, 2] };
    const newState = setEntities({ state: entityState, idKey: DEFAULT_ID_KEY, entities: data });
    expect(newState.active).toEqual([1]);
  });
});
