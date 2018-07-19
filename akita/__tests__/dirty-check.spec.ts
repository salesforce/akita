import { DirtyCheckPlugin, EntityDirtyCheckPlugin } from '../src/index';
import { Widget, WidgetsQuery, WidgetsStore } from './setup';

function resetWidgets(widgetsStore, _id) {
  for (let id = 1; id <= _id; id++) {
    widgetsStore.update(id, {
      id,
      title: `Widget ${id}`,
      complete: false
    });
  }
}

describe('DirtyCheck', () => {
  function createWidget() {
    return {
      id: ++_id,
      title: `Widget ${_id}`
    } as Widget;
  }

  let _id = 0;
  const widgetsStore = new WidgetsStore();
  const widgetsQuery = new WidgetsQuery(widgetsStore);

  it('should call activate only on first setHead()', () => {
    spyOn(DirtyCheckPlugin.prototype, 'activate');
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
        loading: true
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
        loading: true
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
        loading: true
      });

      expect(spy).toHaveBeenLastCalledWith(false);
    });

    it('should unsubscribe on destroy', () => {
      dirtyCheck.destroy();
      expect(dirtyCheck.subscription.closed).toBeTruthy();
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

  beforeEach(() => {
    resetWidgets(widgetsStore, _id);
    collection.setHead();
  });

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
    const spy = jest.fn();
    collection.isSomeDirty().subscribe(spy);
    expect(spy).toHaveBeenLastCalledWith(false);
    widgetsStore.update(2, { title: 'Changed' });
    expect(spy).toHaveBeenLastCalledWith(true);
    widgetsStore.update(1, { title: 'Changed' });
    expect(spy).toHaveBeenLastCalledWith(true);
    widgetsStore.update(1, { title: 'Widget 1' });
    expect(spy).toHaveBeenLastCalledWith(true);
    widgetsStore.update(2, { title: 'Widget 2' });
    expect(spy).toHaveBeenLastCalledWith(false);
  });
});
