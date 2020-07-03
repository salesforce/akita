import { ActiveState, EntityState, EntityStore, ID, Store, StoreConfig } from '@datorama/akita';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { EntityStoreAction, runEntityStoreAction, runStoreAction, StoreAction } from '../lib/runStoreAction';
import { ttlStoreCache, useStoreCache } from '../lib/storeCacheOperators';
import { TestAuth, TestAuthStore } from './entityStoreCache.spec';
import { createMockEntities } from './mocks';

export interface TestSearchState {
  result?: string;
}

@StoreConfig({ name: 'TestSearchStore' })
export class TestSearchStore extends Store<TestSearchState> {}

describe('store cache', () => {
  let store: TestSearchStore;

  afterEach(() => {
    store.destroy();
  });

  it('should expire when using setHasCache with ttl', async () => {
    store = new TestSearchStore(
      {},
      {
        cache: {
          ttl: 1000,
        },
      }
    );
    store.setHasCache(true, { restartTTL: true });
    expect(store._cache().value).toBe(true);
    await new Promise((accept) => setTimeout(accept, 2000));
    expect(store._cache().value).toBe(false);
  });

  it('ttlStoreCache', async () => {
    store = new TestSearchStore(
      {},
      {
        cache: {
          ttl: 1000,
        },
      }
    );

    store.update({
      result: 'old result',
    });

    const source = of({ result: 'new result' } as Partial<TestSearchState>);

    {
      store.setHasCache(true, { restartTTL: true });
      const result = await source.pipe(ttlStoreCache(store), first()).toPromise();
      expect(result.result).toBe('old result');
    }

    await new Promise((accept) => setTimeout(accept, 1500));

    {
      const result = await source.pipe(ttlStoreCache(store), first()).toPromise();
      expect(result.result).toBe('new result');
    }
  });

  it('useStoreCache', async () => {
    store = new TestSearchStore(
      {},
      {
        cache: {
          invalidation: {
            store: (store: TestSearchState) => store.result === undefined,
          },
        },
      }
    );

    store.update({
      result: undefined,
    });

    {
      const source = of({ result: 'new result' } as Partial<TestSearchState>);
      const result = await source.pipe(useStoreCache(store), first()).toPromise();
      expect(result.result).toBe('new result');
    }

    {
      const source = of({ result: 'new result 2' } as Partial<TestSearchState>);
      const result = await source.pipe(useStoreCache(store), first()).toPromise();
      expect(result.result).toBe('new result');
    }
  });
});
