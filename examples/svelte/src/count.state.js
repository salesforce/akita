import { Store, Query } from '@datorama/akita';

class CounterStore extends Store {}
class CounterQuery extends Query {}

export const store = new CounterStore(
  {
    count: 0
  },
  { name: 'counter' }
);

export const query = new CounterQuery(store);
