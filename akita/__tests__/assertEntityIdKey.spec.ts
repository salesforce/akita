import { EntityStore, StoreConfig } from '../src';

@StoreConfig({
  name: 'test'
})
class TestStore extends EntityStore<any, any> {}

@StoreConfig({
  name: 'test',
  idKey: '_id'
})
class TestStore2 extends EntityStore<any, any> {}

const store = new TestStore();
const store2 = new TestStore2();

describe('assertEntityIdKey', () => {
  it('should error when the entity id is not "id"', () => {
    spyOn(console, 'error');
    store.set([{ _id: 1 }]);
    expect(console.error).toHaveBeenCalledWith(`Can't find entity's 'id' key. https://netbasal.gitbook.io/akita/entity-store/entity-store/entity-id`);
  });

  it('should NOT error when the entity id is "id"', () => {
    spyOn(console, 'error');
    store.set([{ id: 1 }]);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should error when the entity id is not "id"', () => {
    spyOn(console, 'error');
    store.add([{ _id: 1 }]);
    expect(console.error).toHaveBeenCalledWith(`Can't find entity's 'id' key. https://netbasal.gitbook.io/akita/entity-store/entity-store/entity-id`);
  });

  it('should NOT error when the entity id is "id"', () => {
    spyOn(console, 'error');
    store.add([{ id: 1 }]);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should NOT error when the entity id is "_id"', () => {
    spyOn(console, 'error');
    store2.add([{ _id: 1 }]);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should error when the entity id is not "_id"', () => {
    spyOn(console, 'error');
    store2.add([{ id: 1 }]);
    expect(console.error).toHaveBeenCalledWith(`Can't find entity's 'id' key. https://netbasal.gitbook.io/akita/entity-store/entity-store/entity-id`);
  });
});
