import { <%= classify(name) %>Store } from './<%= dasherize(name) %>.store';

describe('<%= classify(name) %>Store', () => {
  let store: <%= classify(name) %>Store;

  beforeEach(() => {
    store = new <%= classify(name) %>Store();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
