import { <%= classify(name) %>Query } from './<%= dasherize(name) %>.query';
import { <%= classify(name) %>Store } from './<%= dasherize(name) %>.store';

describe('<%= classify(name) %>Query', () => {
  let query: <%= classify(name) %>Query;

  beforeEach(() => {
    query = new <%= classify(name) %>Query(new <%= classify(name) %>Store);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});
