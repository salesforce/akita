import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { ttlEntityCache, useEntityCache } from '../lib/entityCacheOperators';

export type TestAuth = {
  id: number;
  token: string;
};

export interface TestAuthState extends EntityState<TestAuth, number> {}

@StoreConfig({ name: 'TestAuthStore' })
export class TestAuthStore extends EntityStore<TestAuthState> {}

describe('entity store cache', () => {
  let store: TestAuthStore;

  afterEach(() => {
    store.destroy();
  });

  it('entities should expire', async () => {
    store = new TestAuthStore(
      {},
      {
        cache: {
          ttl: 1000,
        },
      }
    );

    store.set([
      { id: 1, token: 'token 1' },
      { id: 2, token: 'token 2' },
    ]);

    expect(store._value().ids.length).toBe(2);
    expect(store._value().idsExpired.length).toBe(0);

    await new Promise((accept) => setTimeout(accept, 2000));
    expect(store._value().ids.length).toBe(2);
    expect(store._value().idsExpired).toContain(1);
    expect(store._value().idsExpired).toContain(2);
  });

  it('updated entity should expire later', async () => {
    store = new TestAuthStore(
      {},
      {
        cache: {
          ttl: 1000,
        },
      }
    );

    const base = Date.now();
    store.expired$.subscribe(({ id }) => {
      if (id === 1) {
        expect(Date.now()).toBeGreaterThan(base + 1500);
      }
      if (id === 2) {
        expect(Date.now()).toBeGreaterThan(base + 1000);
      }
    });

    store.set([
      { id: 1, token: 'token 1' },
      { id: 2, token: 'token 2' },
    ]);

    expect(store._value().ids.length).toBe(2);
    expect(store._value().idsExpired.length).toBe(0);

    await new Promise((accept) => setTimeout(accept, 500)); //  500ms
    store.update(1, { token: 'token 1 new' });
    expect(store._value().ids.length).toBe(2);
    expect(store._value().idsExpired.length).toBe(0);

    await new Promise((accept) => setTimeout(accept, 500)); // 1000ms
    expect(store._value().ids.length).toBe(2);
    expect(store._value().idsExpired).not.toContain(1);
    expect(store._value().idsExpired).toContain(2);

    await new Promise((accept) => setTimeout(accept, 1000)); // 2000ms
    expect(store._value().ids.length).toBe(2);
    expect(store._value().idsExpired).toContain(1);
    expect(store._value().idsExpired).toContain(2);
  });

  it('ttlEntityCache', async () => {
    store = new TestAuthStore(
      {},
      {
        cache: {
          ttl: 1000,
        },
      }
    );

    store.set([
      { id: 1, token: 'token 1' },
      { id: 2, token: 'token 2' },
    ]);

    expect(store._value().ids.length).toBe(2);

    const source = of({ id: 1, token: 'token fetched' } as TestAuth);

    {
      const result = await source.pipe(ttlEntityCache(store, 1), first()).toPromise();
      expect(result.id).toBe(1);
      expect(result.token).toBe('token 1');
    }

    await new Promise((accept) => setTimeout(accept, 1500));

    {
      const result = await source.pipe(ttlEntityCache(store, 1), first()).toPromise();
      expect(result.id).toBe(1);
      expect(result.token).toBe('token fetched');
    }
  });

  it('useEntityCache', async () => {
    store = new TestAuthStore(
      {},
      {
        cache: {
          invalidation: {
            entity: (entity: TestAuth) => entity.token === undefined,
          },
        },
      }
    );

    store.set([
      { id: 1, token: undefined },
      { id: 2, token: 'token 2' },
    ]);

    expect(store._value().ids.length).toBe(2);

    {
      const source = of({ id: 1, token: 'token fetched' } as TestAuth);
      const result = await source.pipe(useEntityCache(store, 1), first()).toPromise();
      expect(result.id).toBe(1);
      expect(result.token).toBe('token fetched');
    }

    {
      const source = of({ id: 2, token: 'token fetched' } as TestAuth);
      const result = await source.pipe(useEntityCache(store, 2), first()).toPromise();
      expect(result.id).toBe(2);
      expect(result.token).toBe('token 2');
    }
  });
});
