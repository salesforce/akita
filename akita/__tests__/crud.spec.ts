import { CRUD } from '../src/internal/crud';
import { coerceArray } from '../src/internal/utils';
import { AkitaEntityNotExistsError, AkitaInvalidEntityState } from '../src/internal/error';
import { ID } from '../src/api/types';

class Todo {
  id: ID;
  title: string;

  constructor(params: Todo) {
    Object.assign(this, params);
  }
}

function getEntitiesCount(store) {
  return store.ids.length;
}

describe('CRUD', () => {
  const ID_KEY = 'id';
  const crud = new CRUD();
  let store = {
    entities: {},
    ids: []
  };

  describe('Add', () => {
    it('should add many', () => {
      const todoOne = new Todo({ id: 1, title: '1' });
      const todoTwo = new Todo({ id: 2, title: '2' });

      store = crud._add(store, [todoOne, todoTwo], ID_KEY);

      expect(getEntitiesCount(store)).toEqual(2);
      expect(store.ids.length).toBe(2);
      expect(store.entities[1]).toBe(todoOne);
      expect(store.entities[2]).toBe(todoTwo);
    });

    it('should add one', () => {
      const todo = new Todo({ id: 3, title: '3' });
      store = crud._add(store, coerceArray(todo), ID_KEY);

      expect(getEntitiesCount(store)).toBe(3);
      expect(store.ids.length).toBe(3);
      expect(store.entities[3]).toBe(todo);
    });
  });

  describe('Update', () => {
    it('should update one', () => {
      const old = store.entities[3];
      store = crud._update(store, [3], { title: 'changed' });

      expect(store.entities[3].title).toBe('changed');
      expect(store.entities[3].id).toBe(3);
      expect(old).not.toBe(store.entities[3]);
      expect(getEntitiesCount(store)).toBe(3);
      expect(store.ids.length).toBe(3);
    });

    it('should update many', () => {
      const oldOne = store.entities[1];
      const oldTwo = store.entities[2];
      const oldThree = store.entities[3];

      store = crud._update(store, [1, 2, 3], { title: 'changed many' });

      expect(store.entities[1].title).toBe('changed many');
      expect(store.entities[2].title).toBe('changed many');
      expect(store.entities[3].title).toBe('changed many');

      expect(oldOne).not.toBe(store.entities[1]);
      expect(oldTwo).not.toBe(store.entities[2]);
      expect(oldThree).not.toBe(store.entities[3]);

      expect(store.entities[1] instanceof Todo).toBe(true);
      expect(store.entities[2] instanceof Todo).toBe(true);
      expect(store.entities[3] instanceof Todo).toBe(true);

      expect(getEntitiesCount(store)).toBe(3);
      expect(store.ids.length).toBe(3);
    });

    it('should throw if does not exists', function() {
      expect(function() {
        crud._update(store, [500], { title: '500' });
      }).toThrow(new AkitaEntityNotExistsError(500) as any);
    });
  });

  describe('Remove', () => {
    it('should remove one', () => {
      store = crud._remove(store, [3]);

      expect(getEntitiesCount(store)).toBe(2);
      expect(store.ids.length).toBe(2);
      expect(store.entities[3]).toBe(undefined);
    });

    it('should remove many', () => {
      const todoOne = new Todo({ id: 4, title: '4' });
      const todoTwo = new Todo({ id: 5, title: '5' });
      const todoThree = new Todo({ id: 6, title: '6' });

      store = crud._add(store, [todoOne, todoTwo, todoThree], ID_KEY);
      store = crud._remove(store, [4, 5]);

      expect(getEntitiesCount(store)).toBe(3);
      expect(store.ids.length).toBe(3);
      expect(store.ids).toEqual([1, 2, 6]);
      expect(store.entities[4]).toBe(undefined);
      expect(store.entities[5]).toBe(undefined);
      expect(store.entities[1]).toBeDefined();
      expect(store.entities[2]).toBeDefined();
      expect(store.entities[6]).toBeDefined();
    });

    it('should remove all', () => {
      store = crud._remove(store, null);

      expect(getEntitiesCount(store)).toBe(0);
      expect(store.ids.length).toBe(0);
      expect(store.ids).toEqual([]);
    });
  });

  describe('Replace', () => {
    it('should replace the entity', () => {
      store = crud._add(store, [new Todo({ id: 100, title: '100' })], ID_KEY);
      store = crud._replaceEntity(store, 100, { id: '100' });
      const entity = store.entities[100];
      expect(entity).toBeDefined();
      expect(entity.title).not.toBeDefined();
      expect(entity.id).toEqual('100');
    });
  });

  describe('Set', () => {
    it('should support array', () => {
      const todoOne = new Todo({ id: 200, title: '200' });
      const todoTwo = new Todo({ id: 201, title: '201' });
      store = crud._set(store, [todoOne, todoTwo], null, ID_KEY);

      expect(getEntitiesCount(store)).toBe(2);
      expect(store.ids).toEqual([200, 201]);
      expect(store.entities).toEqual({
        200: todoOne,
        201: todoTwo
      });
    });

    it('should support array with class', () => {
      const todoOne = { id: 200, title: '200' };
      const todoTwo = { id: 201, title: '201' };
      store = crud._set(store, [todoOne, todoTwo], Todo, ID_KEY);

      expect(getEntitiesCount(store)).toBe(2);
      expect(store.ids).toEqual([200, 201]);
      expect(store.entities[200] instanceof Todo).toBeTruthy();
      expect(store.entities[201] instanceof Todo).toBeTruthy();
    });

    it('should support entity state', () => {
      const todoOne = { id: 200, title: '200' };
      const todoTwo = { id: 201, title: '201' };
      const state = {
        entities: {
          200: todoOne,
          201: todoTwo
        },
        ids: [200, 201]
      };
      store = crud._set(store, state.entities, null, ID_KEY);

      expect(getEntitiesCount(store)).toBe(2);
      expect(store.ids).toEqual([200, 201]);
      expect(store.entities[200].title).toEqual('200');
      expect(store.entities[201].title).toEqual('201');
    });

    it('should set ids when passing entities', () => {
      let store = {
        entities: {},
        ids: []
      };

      const state = {
        entities: {
          1: {
            id: 1
          },
          2: {
            id: 2
          }
        }
      };

      const newState = crud._set(store, state.entities, null, ID_KEY);

      expect(newState.ids.length).toEqual(2);
      expect(newState.ids).toEqual([1, 2]);
    });

    it('should NOT throw if empty', () => {
      const state = {
        entities: {},
        ids: []
      };
      expect(function() {
        crud._set(store, state.entities, null, ID_KEY);
      }).not.toThrow(new AkitaInvalidEntityState() as any);
    });
  });

  describe('Utils', () => {
    it('should convert an array to hashmap', () => {
      const todoOne = new Todo({ id: 1, title: '1' });
      const todoTwo = new Todo({ id: 2, title: '2' });
      const arr = [todoOne, todoTwo];

      expect(crud['keyBy'](arr)).toEqual({
        1: todoOne,
        2: todoTwo
      });
    });

    it('should convert an array to hashmap with class', () => {
      const todoOne = { id: 1, title: '1' };
      const todoTwo = { id: 2, title: '2' };
      const arr = [todoOne, todoTwo];

      expect(crud['keyBy'](arr, Todo)).toEqual({
        1: new Todo(todoOne),
        2: new Todo(todoTwo)
      });
    });
  });
});

describe('Plain Objects', () => {
  const ID_KEY = 'id';
  const crud = new CRUD();
  let store = {
    entities: {},
    ids: []
  };

  it('should set', () => {
    store = crud._set(store, [{ id: 1, title: '1' }], null, ID_KEY);
    expect(getEntitiesCount(store)).toEqual(1);
    expect(store.ids).toEqual([1]);
    expect(store.entities[1].id).toEqual(1);
  });

  it('should set entity state', () => {
    const state = {
      entities: {
        1: { id: 1, title: '1' }
      },
      ids: [1]
    };
    store = crud._set(store, state.entities, null, ID_KEY);
    expect(getEntitiesCount(store)).toEqual(1);
    expect(store.ids).toEqual([1]);
    expect(store.entities[1].id).toEqual(1);
  });

  it('should add', () => {
    store = crud._add(store, [{ id: 1, title: '1' }], ID_KEY);
    expect(getEntitiesCount(store)).toEqual(1);
    expect(store.ids).toEqual([1]);
    expect(store.entities[1].id).toEqual(1);
  });

  it('should update', () => {
    store = crud._update(store, [1], { title: 'new' });
    expect(getEntitiesCount(store)).toEqual(1);
    expect(store.ids).toEqual([1]);
    expect(store.entities[1].title).toEqual('new');
  });
});
