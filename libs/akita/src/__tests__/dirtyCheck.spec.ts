import { DirtyCheckPlugin, EntityDirtyCheckPlugin } from '../lib/index';
import { Widget, WidgetsQuery, WidgetsStore } from './setup';
import { Observable } from 'rxjs';
import { skip } from 'rxjs/operators';

describe('DirtyCheck', () => {
  function createWidget() {
    return {
      id: ++_id,
      title: `Widget ${_id}`
    } as Widget;
  }

  let _id = 0;
  describe('Watch entire store', () => {
    const widgetsStore = new WidgetsStore();
    const widgetsQuery = new WidgetsQuery(widgetsStore);

    it('should call activate only on first setHead()', () => {
      jest.spyOn(DirtyCheckPlugin.prototype, 'activate');
      const dirtyCheck = new DirtyCheckPlugin(widgetsQuery);

      expect(DirtyCheckPlugin.prototype.activate).not.toHaveBeenCalled();
      dirtyCheck.setHead();
      expect(DirtyCheckPlugin.prototype.activate).toHaveBeenCalledTimes(1);
      dirtyCheck.setHead();
      expect(DirtyCheckPlugin.prototype.activate).toHaveBeenCalledTimes(1);
    });

    describe('Plugin flow', () => {
      const dirtyCheck = new DirtyCheckPlugin(widgetsQuery);
      const spy = jest.fn();

      dirtyCheck.isDirty$.subscribe(spy);

      it('should setHead()', () => {
        widgetsStore.add(createWidget());
        expect(spy).toHaveBeenLastCalledWith(false);
        dirtyCheck.setHead();
        expect(dirtyCheck.head).toEqual({
          entities: {
            '1': {
              id: 1,
              title: 'Widget 1'
            }
          },
          error: null,
          ids: [1],
          loading: false
        });
        expect(spy).toHaveBeenLastCalledWith(false);
      });

      it("should mark as dirty when the store value doesn't equal to head", () => {
        widgetsStore.add(createWidget());
        expect(spy).toHaveBeenLastCalledWith(true);
      });

      it('should mark as pristine when the store value equal to head', () => {
        widgetsStore.remove(2);
        expect(spy).toHaveBeenLastCalledWith(false);
      });

      it('should rebase the head', () => {
        widgetsStore.add(createWidget());
        expect(spy).toHaveBeenLastCalledWith(true);
        dirtyCheck.setHead();
        expect(spy).toHaveBeenLastCalledWith(false);
        expect(dirtyCheck.head).toEqual({
          entities: {
            '1': {
              id: 1,
              title: 'Widget 1'
            },
            '3': {
              id: 3,
              title: 'Widget 3'
            }
          },

          error: null,
          ids: [1, 3],
          loading: false
        });
      });

      it('should reset the store to current head value', () => {
        widgetsStore.add(createWidget());
        expect(spy).toHaveBeenLastCalledWith(true);
        dirtyCheck.reset();
        expect(widgetsStore._value()).toEqual({
          entities: {
            '1': {
              id: 1,
              title: 'Widget 1'
            },
            '3': {
              id: 3,
              title: 'Widget 3'
            }
          },
          error: null,
          ids: [1, 3],
          loading: false
        });

        expect(spy).toHaveBeenLastCalledWith(false);
      });

      it('should unsubscribe on destroy', () => {
        dirtyCheck.destroy();
        expect(dirtyCheck.subscription.closed).toBeTruthy();
      });

      it('should return true if state is dirty', () => {
        dirtyCheck.updateDirtiness(true);
        const isDirty = dirtyCheck.isDirty();
        expect(isDirty).toBeTruthy();
      });

      it('should return false if state is not dirty', () => {
        dirtyCheck.updateDirtiness(false);
        const isDirty = dirtyCheck.isDirty();
        expect(isDirty).toBeFalsy();
      });

      it('should return true if state has head', () => {
        dirtyCheck.setHead();
        const isDirty = dirtyCheck.hasHead();
        expect(isDirty).toBeTruthy();
      });

      it('should return false if state does not has head', () => {
        dirtyCheck.head = null;
        const hasHead = dirtyCheck.hasHead();
        expect(hasHead).toBeFalsy();
      });

      describe('dirtyPath', () => {
        const widgetsStore = new WidgetsStore({ some: { nested: { value: '' } } });
        const widgetsQuery = new WidgetsQuery(widgetsStore);
        const dirtyCheck = new DirtyCheckPlugin(widgetsQuery);
        it('should not return dirty for isPathDirty', function() {
          let isPathDirty: boolean;
          dirtyCheck.setHead();
          isPathDirty = dirtyCheck.isPathDirty('some.nested.value');
          expect(isPathDirty).toBeFalsy();

          widgetsStore.update({
            some: {
              nested: {
                value: 'other value'
              }
            }
          });

          isPathDirty = dirtyCheck.isPathDirty('some.nested.value');
          expect(isPathDirty).toBeTruthy();

          dirtyCheck.reset();
          isPathDirty = dirtyCheck.isPathDirty('some.nested.value');
          expect(isPathDirty).toBeFalsy();

          widgetsStore.update({
            some: {
              nested: {
                value: 'other value'
              }
            }
          });

          isPathDirty = dirtyCheck.isPathDirty('some.nested.value');
          expect(isPathDirty).toBeTruthy();

          widgetsStore.update({
            some: {
              nested: {
                value: ''
              }
            }
          });

          isPathDirty = dirtyCheck.isPathDirty('some.nested.value');
          expect(isPathDirty).toBeFalsy();
        });

        it('should return dirty for isPathDirty', function() {
          let isPathDirty: boolean;
          dirtyCheck.setHead();
          widgetsStore.update({
            some: {
              nested: {
                value: 'some other name'
              }
            }
          });

          isPathDirty = dirtyCheck.isPathDirty('some.nested.value');
          expect(isPathDirty).toBeTruthy();

          dirtyCheck.reset();
          isPathDirty = dirtyCheck.isPathDirty('some.nested.value');
          expect(isPathDirty).toBeFalsy();

          widgetsStore.update({
            some: {
              nested: {
                value: 'some other name'
              }
            }
          });

          isPathDirty = dirtyCheck.isPathDirty('some.nested.value');
          expect(isPathDirty).toBeTruthy();

          widgetsStore.update({
            some: {
              nested: {
                value: ''
              }
            }
          });

          isPathDirty = dirtyCheck.isPathDirty('some.nested.value');
          expect(isPathDirty).toBeFalsy();

          widgetsStore.update({
            some: {
              nested: {
                value: 'some value'
              }
            }
          });

          isPathDirty = dirtyCheck.isPathDirty('some.nested.value');
          expect(isPathDirty).toBeTruthy();
        });
      });
    });
  });

  describe('Watch specific property', () => {
    const widgetsStore = new WidgetsStore({ name: 'akita' });
    const widgetsQuery = new WidgetsQuery(widgetsStore);
    const dirtyCheck = new DirtyCheckPlugin(widgetsQuery, { watchProperty: 'name' }).setHead();
    const spy = jest.fn();
    dirtyCheck.isDirty$.pipe(skip(1)).subscribe(spy);

    it('should not trigger a change in is dirty', () => {
      /** reset widgets ID */
      _id = 0;
      widgetsStore.add(createWidget());
      expect(spy).not.toHaveBeenCalled();
    });

    it('should return true if state is dirty', () => {
      widgetsStore.update({ name: 'kazaz' });
      expect(spy).toHaveBeenLastCalledWith(true);
    });

    it('should only reset the watched property', () => {
      widgetsStore.add(createWidget());
      dirtyCheck.reset();
      expect(spy).toHaveBeenLastCalledWith(false);
      expect(widgetsStore.entities[1]).toBeDefined();
      expect(widgetsStore.entities[2]).toBeDefined();
      expect(widgetsStore._value().name).toBe('akita');
    });
  });
  describe('Watch entities with deepEqual', () => {
    const widgetsStore = new WidgetsStore({ name: 'akita' });
    const widgetsQuery = new WidgetsQuery(widgetsStore);
    const dirtyCheck = new DirtyCheckPlugin(widgetsQuery, { watchProperty: 'entities', comparator: (a, b) => !deepEqual(a, b) }).setHead();
    const spy = jest.fn();
    dirtyCheck.isDirty$.pipe(skip(1)).subscribe(spy);
    it(`should watch 'ids' property if 'entities' is watched`, () => {
      const watching = !['entities', 'ids'].some(key => !(dirtyCheck.params.watchProperty as any[]).includes(key));
      expect(watching).toBe(true);
    });

    it('should work as expected', () => {
      _id = 0;
      widgetsStore.add([createWidget(), createWidget()]);
      dirtyCheck.setHead();
      /** do some manipulation */
      widgetsStore.update(2, { title: 'kazaz widget' });
      expect(spy).toHaveBeenCalledWith(true);
      widgetsStore.update(2, { title: 'Widget 2' });
      expect(spy).toHaveBeenCalledWith(false);
      widgetsStore.remove(1);
      expect(spy).toHaveBeenCalledWith(true);
      dirtyCheck.reset();
      expect(spy).toHaveBeenCalledWith(false);
      spy.mockClear();
      widgetsStore.update({ anotherProp: '12345' });
      expect(spy).not.toHaveBeenCalled();
      widgetsStore.update({ name: 'store' });
      expect(spy).not.toHaveBeenCalled();
      dirtyCheck.reset();
      expect(spy).not.toHaveBeenCalled();
      expect(widgetsStore.entities).toEqual({ '1': { id: 1, title: 'Widget 1' }, '2': { id: 2, title: 'Widget 2' } });
      expect(widgetsStore._value().name).toEqual('store');
      expect(widgetsStore._value().anotherProp).toEqual('12345');
    });
  });

  describe('Watch 2 props with deepEqual', () => {
    const widgetsStore = new WidgetsStore({ prop1: 'akita', prop2: 'bla', prop3: `I'm out` });
    const widgetsQuery = new WidgetsQuery(widgetsStore);
    const dirtyCheck = new DirtyCheckPlugin(widgetsQuery, { watchProperty: ['prop1', 'prop2'], comparator: (a, b) => !deepEqual(a, b) }).setHead();
    const spy = jest.fn();
    dirtyCheck.isDirty$.pipe(skip(1)).subscribe(spy);

    it('should work as expected', () => {
      _id = 0;
      dirtyCheck.setHead();
      widgetsStore.add([createWidget(), createWidget()]);
      expect(spy).not.toHaveBeenCalled();
      widgetsStore.update({ prop3: '12345' });
      expect(spy).not.toHaveBeenCalled();
      /** do some manipulation */
      widgetsStore.update(2, { title: 'kazaz widget' });
      expect(spy).not.toHaveBeenCalled();
      widgetsStore.update({ prop1: 'change' });
      expect(spy).toHaveBeenCalledWith(true);
      widgetsStore.update({ prop1: 'akita' });
      expect(spy).toHaveBeenCalledWith(false);
      widgetsStore.update({ prop1: 'change', prop2: 'change', prop3: 'change' });
      expect(spy).toHaveBeenCalledWith(true);
      dirtyCheck.reset();
      expect(spy).toHaveBeenCalledWith(false);
      expect(widgetsStore._value().prop3).toEqual('change');
      expect(widgetsStore.entities).toEqual({ '1': { id: 1, title: 'Widget 1' }, '2': { id: 2, title: 'kazaz widget' } });
    });
  });
});

describe('DirtyCheckEntity', () => {
  function createWidget(complete = false) {
    return {
      id: ++_id,
      title: `Widget ${_id}`,
      complete
    } as Widget;
  }

  let _id = 0;
  let widgetsStore = new WidgetsStore();
  let widgetsQuery = new WidgetsQuery(widgetsStore);
  let collection = new EntityDirtyCheckPlugin(widgetsQuery);
  widgetsStore.add([createWidget(), createWidget(), createWidget()]);
  collection.setHead();

  describe('Not passing ids', () => {
    it('should select all when not passing entityIds', () => {
      expect(collection.entities.size).toEqual(3);
    });

    it('should work with entity', () => {
      const spy = jest.fn();
      collection.isDirty(1).subscribe(spy);
      expect(spy).toHaveBeenLastCalledWith(false);
      widgetsStore.update(2, { title: 'Changed' });
      expect(spy).toHaveBeenLastCalledWith(false);
      widgetsStore.update(1, { title: 'Changed' });
      expect(spy).toHaveBeenLastCalledWith(true);
      widgetsStore.update(1, { title: 'Widget 1' });
      expect(spy).toHaveBeenLastCalledWith(false);
      widgetsStore.update(1, { title: 'Changed' });
      expect(spy).toHaveBeenLastCalledWith(true);
      expect(widgetsQuery.getEntity(1)).toEqual({ id: 1, title: 'Changed', complete: false });
      collection.reset(1);
      expect(widgetsQuery.getEntity(1)).toEqual({ id: 1, title: 'Widget 1', complete: false });
      widgetsStore.update(1, { title: 'Changed', complete: true });
      expect(widgetsQuery.getEntity(1)).toEqual({ id: 1, title: 'Changed', complete: true });
      const updateFn = (head, current) => {
        return {
          ...head,
          title: current.title
        };
      };
      collection.reset(1, { updateFn });
      expect(widgetsQuery.getEntity(1)).toEqual({ id: 1, title: 'Changed', complete: false });
      expect(spy).toHaveBeenLastCalledWith(true);
    });

    it('should return true if some of the entities are dirty', () => {
      jest.useFakeTimers();
      widgetsStore.remove();
      widgetsStore.add([createWidget(), createWidget(), createWidget()]);
      collection.setHead();
      let expectedResult = false;
      let isDirty = collection.someDirty();
      const subscription = collection.someDirty$.subscribe(res => {
        isDirty = collection.someDirty();
        expect(isDirty).toBe(expectedResult);
        expect(res).toBe(expectedResult);
      });
      expect(isDirty).toBe(expectedResult);
      jest.runAllTimers();
      widgetsStore.update(5, { title: 'Changed' });
      expectedResult = true;
      isDirty = collection.someDirty();
      expect(isDirty).toBe(expectedResult);
      jest.runAllTimers();
      widgetsStore.update(4, { title: 'Changed' });
      expectedResult = true;
      isDirty = collection.someDirty();
      expect(isDirty).toBe(expectedResult);
      jest.runAllTimers();
      widgetsStore.update(4, { title: 'Widget 4' });
      expectedResult = true;
      isDirty = collection.someDirty();
      expect(isDirty).toBe(expectedResult);
      jest.runAllTimers();
      widgetsStore.update(5, { title: 'Widget 5' });
      expectedResult = false;
      isDirty = collection.someDirty();
      expect(isDirty).toBe(expectedResult);
      jest.runAllTimers();
      subscription.unsubscribe();
    });

    it('should return isDirty as observable by default', () => {
      const widget = createWidget();
      widgetsStore.add(widget);
      const isDirty = collection.isDirty(widget.id);
      expect(isDirty).toBeInstanceOf(Observable);
    });

    it('should return isDirty as observable', () => {
      const widget = createWidget();
      widgetsStore.add(widget);
      const isDirty = collection.isDirty(widget.id, true);
      expect(isDirty).toBeInstanceOf(Observable);
    });

    it('should return isDirty as boolean', () => {
      const widget = createWidget();
      widgetsStore.add(widget);
      const isDirty = collection.isDirty(widget.id, false);
      expect(typeof isDirty).toEqual('boolean');
    });

    it('should return true for hasHead()', () => {
      const widget = createWidget();
      widgetsStore.add(widget);
      expect(collection.hasHead(widget.id)).toBeTruthy();
    });

    describe('dirtyPath', () => {
      it('should not return dirty for isPathDirty', function() {
        let isPathDirty: boolean;
        const widget = createWidget();
        widgetsStore.add(widget);
        collection.setHead();
        isPathDirty = collection.isPathDirty(widget.id, 'title');
        expect(isPathDirty).toBeFalsy();

        widgetsStore.update(widget.id, { title: 'some value' });
        isPathDirty = collection.isPathDirty(widget.id, 'title');
        expect(isPathDirty).toBeTruthy();

        collection.reset();
        isPathDirty = collection.isPathDirty(widget.id, 'title');
        expect(isPathDirty).toBeFalsy();

        widgetsStore.update(widget.id, { title: 'some value' });
        isPathDirty = collection.isPathDirty(widget.id, 'title');
        expect(isPathDirty).toBeTruthy();

        widgetsStore.update(widget.id, { title: `Widget ${widget.id}` });
        isPathDirty = collection.isPathDirty(widget.id, 'title');
        expect(isPathDirty).toBeFalsy();
      });

      it('should return dirty for isPathDirty', function() {
        let isPathDirty: boolean;
        let widget = createWidget();
        widgetsStore.add(widget);
        collection.setHead();

        isPathDirty = collection.isPathDirty(widget.id, 'title');
        expect(isPathDirty).toBeFalsy();

        widgetsStore.update(widget.id, {
          ...widget,
          title: 'some other name'
        });

        isPathDirty = collection.isPathDirty(widget.id, 'title');
        expect(isPathDirty).toBeTruthy();

        widgetsStore.update(widget.id, {
          ...widget,
          title: `Widget ${widget.id}`
        });

        isPathDirty = collection.isPathDirty(widget.id, 'title');
        expect(isPathDirty).toBeFalsy();

        widgetsStore.update(widget.id, {
          ...widget,
          title: 'some other name'
        });

        isPathDirty = collection.isPathDirty(widget.id, 'title');
        expect(isPathDirty).toBeTruthy();
      });
    });
  });

  describe('Passing ids', () => {
    let widgetsStore = new WidgetsStore();
    let widgetsQuery = new WidgetsQuery(widgetsStore);
    _id = 0;
    let collection = new EntityDirtyCheckPlugin(widgetsQuery, { entityIds: [1, 2] });
    widgetsStore.add([createWidget(), createWidget(), createWidget()]);
    collection.setHead([1, 2]);

    it('should select given ids', () => {
      expect(collection.entities.size).toEqual(2);
    });

    it('should work with entity', () => {
      const spy = jest.fn();
      collection.isDirty(1).subscribe(spy);
      expect(spy).toHaveBeenLastCalledWith(false);
      widgetsStore.update(2, { title: 'Changed' });
      expect(spy).toHaveBeenLastCalledWith(false);
      widgetsStore.update(1, { title: 'Changed' });
      expect(spy).toHaveBeenLastCalledWith(true);
      widgetsStore.update(1, { title: 'Widget 1' });
      expect(spy).toHaveBeenLastCalledWith(false);
      widgetsStore.update(1, { title: 'Changed' });
      expect(spy).toHaveBeenLastCalledWith(true);
      expect(widgetsQuery.getEntity(1)).toEqual({ id: 1, title: 'Changed', complete: false });
      collection.reset(1);
      expect(widgetsQuery.getEntity(1)).toEqual({ id: 1, title: 'Widget 1', complete: false });
      widgetsStore.update(1, { title: 'Changed', complete: true });
      expect(widgetsQuery.getEntity(1)).toEqual({ id: 1, title: 'Changed', complete: true });
      const updateFn = (head, current) => {
        return {
          ...head,
          title: current.title
        };
      };
      collection.reset(1, { updateFn });
      expect(widgetsQuery.getEntity(1)).toEqual({ id: 1, title: 'Changed', complete: false });
      expect(spy).toHaveBeenLastCalledWith(true);
    });

    it('someDirty should return true if some of the entities are dirty', () => {
      jest.useFakeTimers();
      widgetsStore.remove();
      _id = 3;
      widgetsStore.add([createWidget(), createWidget(), createWidget()]);
      collection = new EntityDirtyCheckPlugin(widgetsQuery, { entityIds: [4, 6] });
      collection.setHead();
      let expectedResult = false;
      let isDirty = collection.someDirty();
      const spy = jest.fn();
      const subscription = [
        collection.someDirty$.subscribe(res => {
          isDirty = collection.someDirty();
          expect(isDirty).toBe(expectedResult);
          expect(res).toBe(expectedResult);
        }),
        collection.someDirty$.subscribe(spy)
      ];
      expect(isDirty).toBe(expectedResult);
      jest.runAllTimers();
      widgetsStore.update(5, { title: 'Changed' });
      expectedResult = false;
      isDirty = collection.someDirty();
      expect(isDirty).toBe(expectedResult);
      jest.runAllTimers();
      widgetsStore.update(6, { title: 'Changed' });
      expectedResult = true;
      isDirty = collection.someDirty();
      expect(isDirty).toBe(expectedResult);
      jest.runAllTimers();
      widgetsStore.update(4, { title: 'Changed' });
      expectedResult = true;
      isDirty = collection.someDirty();
      expect(isDirty).toBe(expectedResult);
      jest.runAllTimers();
      widgetsStore.update(4, { title: 'Widget 4' });
      expectedResult = true;
      isDirty = collection.someDirty();
      expect(isDirty).toBe(expectedResult);
      jest.runAllTimers();
      widgetsStore.update(5, { title: 'Widget 5' });
      expectedResult = true;
      isDirty = collection.someDirty();
      expect(isDirty).toBe(expectedResult);
      jest.runAllTimers();
      widgetsStore.update(6, { title: 'Widget 6' });
      expectedResult = false;
      isDirty = collection.someDirty();
      expect(isDirty).toBe(expectedResult);
      jest.runAllTimers();
      expect(spy).toBeCalledTimes(7);
      subscription.forEach(s => s.unsubscribe());
    });

    it('someDirty should return false when calling set head', () => {
      jest.useFakeTimers();
      widgetsStore.remove();
      _id = 6;
      widgetsStore.add([createWidget(), createWidget(), createWidget()]);
      collection = new EntityDirtyCheckPlugin(widgetsQuery, { entityIds: 7 });
      const spy = jest.fn();
      let expectedResult = false;
      const subscription = [
        collection.someDirty$.subscribe(res => {
          expect(res).toBe(expectedResult);
        }),
        collection.someDirty$.subscribe(spy)
      ];
      jest.runAllTimers();
      collection.setHead();
      expectedResult = false;
      jest.runAllTimers();
      widgetsStore.update(7, { title: 'Changed' });
      expectedResult = true;
      jest.runAllTimers();
      collection.setHead();
      expectedResult = false;
      jest.runAllTimers();
      widgetsStore.update(7, { title: 'Changed 2' });
      expectedResult = true;
      jest.runAllTimers();
      collection.setHead(8);
      expectedResult = true;
      jest.runAllTimers();
      collection.setHead(7);
      expectedResult = false;
      jest.runAllTimers();
      expect(spy).toBeCalledTimes(6);
      subscription.forEach(s => s.unsubscribe());
    });

    it('should return false for hasHead()', () => {
      const widget = createWidget();
      widgetsStore.add(widget);
      expect(collection.hasHead(widget.id)).toBeFalsy();
      collection.setHead(widget.id);
      expect(collection.hasHead(widget.id)).toBeFalsy();
    });
  });
});

function deepEqual(x, y) {
  return x && y && typeof x === 'object' && typeof y === 'object'
    ? Object.keys(x).length === Object.keys(y).length &&
        Object.keys(x).reduce(function(isEqual, key) {
          return isEqual && deepEqual(x[key], y[key]);
        }, true)
    : x === y;
}
