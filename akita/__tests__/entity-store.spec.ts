import { AkitaEntityNotExistsError, AkitaNoActiveError } from '../src/internal/error';
import { Todo, TodosStore, TodosStoreCustomID } from './setup';

let store = new TodosStore();

describe('EntitiesStore', () => {
  beforeEach(() => {
    store = new TodosStore();
  });

  describe('set', () => {
    it('should set', () => {
      store.set([new Todo({ id: 1, title: '1' })]);
      expect(store._value().entities[1]).toBeDefined();
    });

    it('should set a new instance when passing a class', () => {
      store.set([{ id: 1, title: '1' }], Todo);
      expect(store._value().entities[1]).toBeDefined();
      expect(store._value().entities[1] instanceof Todo).toBeTruthy();
    });

    it('should reset the active if entity does not exist anymore', () => {
      store.set([new Todo({ id: 1, title: '1' })]);
      store.setActive(1);
      expect(store._value().active).toEqual(1);
      expect(store._value().entities[1]).toEqual(new Todo({ id: 1, title: '1' }));
      store.set([new Todo({ id: 2, title: '2' })]);
      expect(store._value().active).toBeNull();
      expect(store._value().entities[1]).toBeUndefined();
      expect(store._value().entities[2]).toEqual(new Todo({ id: 2, title: '2' }));
    });
  });

  describe('createOrReplace', () => {
    it('should create if does not exists', () => {
      store.createOrReplace(1, new Todo({ id: 1 }));
      expect(store.entities[1]).toBeDefined();
    });

    it('should replace if exists', () => {
      store.createOrReplace(1, new Todo({ id: 1 }));
      expect(store.entities[1]).toBeDefined();
      store.createOrReplace(1, new Todo({ id: 1, title: 'replaced' }));
      expect(store.entities[1].title).toEqual('replaced');
    });
  });

  describe('add', () => {
    it('should add entity', () => {
      store.add(new Todo({ id: 1 }));
      expect(store.entities[1]).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update entity', () => {
      store.add(new Todo({ id: 1 }));
      store.update(1, { title: 'update' });
      expect(store.entities[1].title).toEqual('update');
    });

    it('should update entity with callback', () => {
      store.add(new Todo({ id: 1 }));
      store.update(1, entity => {
        return {
          title: 'update'
        };
      });
      expect(store.entities[1].title).toEqual('update');
    });

    it('should update many', () => {
      store.add(new Todo({ id: 1 }));
      store.add(new Todo({ id: 2 }));
      store.add(new Todo({ id: 3 }));
      store.update([1, 2], { title: 'update' });
      expect(store.entities[1].title).toEqual('update');
      expect(store.entities[2].title).toEqual('update');
      expect(store.entities[3].title).toEqual('3');
    });

    it('should update many with callback using entity object', () => {
      store.add(new Todo({ id: 1 }));
      store.add(new Todo({ id: 2 }));
      store.add(new Todo({ id: 3 }));
      store.update([1, 2], entity => ({ title: 'update' + entity.id }));
      expect(store.entities[1].title).toEqual('update1');
      expect(store.entities[2].title).toEqual('update2');
      expect(store.entities[3].title).toEqual('3');
    });

    it('should update all', () => {
      store.add(new Todo({ id: 1 }));
      store.add(new Todo({ id: 2 }));
      store.update(null, { title: 'update' });
      expect(store.entities[1].title).toEqual('update');
      expect(store.entities[2].title).toEqual('update');
    });

    it('should update by predicate', () => {
      store.add(new Todo({ id: 1 }));
      store.add(new Todo({ id: 2 }));
      store.update(e => e.title === '2', { title: 'update' });
      expect(store.entities[1].title).toEqual('1');
      expect(store.entities[2].title).toEqual('update');
    });

    it('should throw if the entity does not exists', () => {
      store.add(new Todo({ id: 1 }));
      expect(function() {
        store.update(100, { title: 'update' });
      }).toThrow(new AkitaEntityNotExistsError(100) as any);
    });
  });

  describe('updateRoot', () => {
    it('should update root', () => {
      const todo = new Todo({ id: 1 });
      store.add(todo);
      store.updateRoot({
        metadata: {
          name: 'update'
        }
      });
      expect(store._value().metadata.name).toEqual('update');
      expect(store.entities[1]).toEqual(todo);
    });

    it('should update root with callback', () => {
      const todo = new Todo({ id: 1 });
      store.add(todo);
      store.updateRoot(state => {
        return {
          metadata: {
            name: 'update'
          }
        };
      });
      expect(store._value().metadata.name).toEqual('update');
      expect(store.entities[1]).toEqual(todo);
    });
  });

  describe('updateActive', () => {
    it('should update the active', () => {
      const todo = new Todo({ id: 1 });
      store.add(todo);
      store.setActive(1);
      store.updateActive({ title: 'update' });
      expect(store.entities[1].title).toEqual('update');
    });

    it('should update the active with callback', () => {
      const todo = new Todo({ id: 1 });
      store.add(todo);
      store.setActive(1);
      store.updateActive(active => {
        return {
          title: 'update'
        };
      });
      expect(store.entities[1].title).toEqual('update');
      expect(store.entities[1].id).toEqual(1);
    });

    it('should throw if active is undefined', () => {
      store.setActive(null);
      expect(function() {
        store.updateActive({ title: 'update' });
      }).toThrow(new AkitaNoActiveError() as any);
    });
  });

  describe('remove', () => {
    it('should remove one', () => {
      const todo = new Todo({ id: 1 });
      store.add(todo);
      store.remove(1);
      expect(store.entities[1]).toBeUndefined();
    });

    it('should remove and set active to null', () => {
      const todo = new Todo({ id: 2 });
      store.add(todo);
      store.setActive(2);
      expect(store._value().active).toEqual(2);
      store.remove(2);
      expect(store.entities[2]).toBeUndefined();
      expect(store._value().active).toBeNull();
    });

    it('should remove and NOT set active to null', () => {
      store.add(new Todo({ id: 1 }));
      store.add(new Todo({ id: 2 }));
      store.setActive(2);
      expect(store._value().active).toEqual(2);
      store.remove(1);
      expect(store._value().active).toEqual(2);
    });

    it('should remove many', () => {
      const todo = new Todo({ id: 1 });
      const todo2 = new Todo({ id: 2 });
      store.add(todo);
      store.add(todo2);
      store.remove([1, 2]);
      expect(store.entities[1]).toBeUndefined();
      expect(store.entities[2]).toBeUndefined();
      expect(store._value().ids.length).toEqual(0);
    });

    it('should remove many with callback', () => {
      const todo = new Todo({ id: 1 });
      const todo2 = new Todo({ id: 2 });
      store.add(todo);
      store.add(todo2);
      store.remove(e => e.id === 1);
      expect(store.entities[1]).toBeUndefined();
      expect(store.entities[2]).toBe(todo2);
      expect(store._value().ids.length).toEqual(1);
    });

    it('should remove all', () => {
      const todo = new Todo({ id: 1 });
      const todo2 = new Todo({ id: 2 });
      store.add(todo);
      store.add(todo2);
      store.remove();
      expect(store.entities[1]).toBeUndefined();
      expect(store.entities[2]).toBeUndefined();
      expect(store._value().ids.length).toEqual(0);
    });

    it('should remove all and set active to null', () => {
      const todo = new Todo({ id: 1 });
      const todo2 = new Todo({ id: 2 });
      store.add(todo);
      store.add(todo2);
      store.setActive(1);
      store.remove();
      expect(store.entities[1]).toBeUndefined();
      expect(store.entities[2]).toBeUndefined();
      expect(store._value().ids.length).toEqual(0);
      expect(store._value().active).toBeNull();
    });
  });

  describe('active', () => {
    it('should set active', () => {
      const todo = new Todo({ id: 2 });
      store.add(todo);
      store.setActive(2);
      expect(store._value().active).toEqual(2);
    });
  });
});

let store2 = new TodosStoreCustomID();

describe('Custom ID', () => {
  it('should set with custom id', () => {
    store2.set([{ todoId: 1, title: '1' }]);
    expect(store2._value().entities[1]).toBeDefined();
  });

  it('should add with custom id', () => {
    store2.add([{ todoId: 2, title: '2' } as any]);
    expect(store2._value().entities[1]).toBeDefined();
    expect(store2._value().entities[2]).toBeDefined();
    expect(store2._value().entities[2].title).toEqual('2');
  });
});
