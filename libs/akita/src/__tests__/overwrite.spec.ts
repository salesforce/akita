import { Store, StoreConfig } from '@datorama/akita';

type ExampleState = ExampleStateA | ExampleStateB;

interface ExampleStateA {
  _tag: 'a';
  uniqueToA: string;
}

interface ExampleStateB {
  _tag: 'b';
  uniqueToB: string;
}

const initialState: ExampleState = {
  _tag: 'a',
  uniqueToA: 'This value is unique to a',
};

@StoreConfig({
  name: 'example-store',
  resettable: true,
})
class ExampleStore extends Store<ExampleState> {
  constructor() {
    super(initialState);
  }
}

const exampleStore = new ExampleStore();

describe('Store Overwrite', () => {
  beforeEach(() => {
    exampleStore.reset();
  });

  it('should overwrite the store value replacing the previous state using a state object', () => {
    exampleStore.overwrite({ _tag: 'b', uniqueToB: 'This value is unique to b' });
    expect(exampleStore._value()).toBeTruthy();
    expect(exampleStore._value()).toEqual({_tag: 'b', uniqueToB: 'This value is unique to b'});
  });

  it('should overwrite the store value replacing the previous state using a callback function', () => {
    exampleStore.overwrite((_) => ({ _tag: 'b', uniqueToB: 'This value is unique to b' }));
    expect(exampleStore._value()).toBeTruthy();
    expect(exampleStore._value()).toEqual({_tag: 'b', uniqueToB: 'This value is unique to b'});
  });

  it('should update the store value but only replace specified properties', () => {
    exampleStore.update({ _tag: 'b', uniqueToB: 'This value is unique to b' });
    expect(exampleStore._value()).toBeTruthy();
    expect(exampleStore._value()).toEqual({_tag: 'b', uniqueToB: 'This value is unique to b', uniqueToA: 'This value is unique to a'});
  });
});
