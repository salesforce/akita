import { ActiveState, EntityState, EntityStore, ID, Store, StoreConfig } from '@datorama/akita';
import { EntityStoreAction, runEntityStoreAction, runStoreAction, StoreAction } from '../lib/runStoreAction';
import { createMockEntities } from './mocks';

export interface TestSearchState {}

@StoreConfig({ name: 'books', cache: { ttl: 1000 } })
export class TestSearchStore extends Store<TestSearchState> {
  constructor() {
    super({});
  }
}

describe('store cache', () => {
  let store: TestSearchStore;

  beforeEach(() => {
    store = new TestSearchStore();
  });

  afterEach(() => {
    store.destroy();
  });

  it('should expire', async () => {
    store.setHasCache(true, { restartTTL: true });
    expect(store._cache().value).toBe(true);
    await new Promise((accept) => setTimeout(accept, 2000));
    expect(store._cache().value).toBe(false);
  });
});
