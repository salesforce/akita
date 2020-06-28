import { EntityState, EntityStore, QueryEntity, StoreConfig } from '@datorama/akita';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { useEntityCache } from '../lib/useEntityCache';

export type TestAuth = {
  id: number;
  token: string;
};

export interface TestAuthState extends EntityState<TestAuth, number> {}

@StoreConfig({ name: 'books' })
export class TestAuthStore extends EntityStore<TestAuthState> {}

export class TestAuthQuery extends QueryEntity<TestAuthState> {}

describe('entity store cache', () => {
  let store: TestAuthStore;
  let query: QueryEntity<TestAuthState>;

  afterEach(() => {
    store.destroy();
    query = undefined;
  });

  it('entities should expire', async () => {
    store = new TestAuthStore(
      {},
      {
        cache: {
          ttl: 1000,
          removeExpiredEntities: true,
        },
      }
    );
    query = new TestAuthQuery(store);

    store.set([
      { id: 1, token: 'token 1' },
      { id: 2, token: 'token 2' },
    ]);
    expect(store._value().ids.length).toBe(2);
    await new Promise((accept) => setTimeout(accept, 2000));
    expect(store._value().ids.length).toBe(0);
  });

  it('updated entity should expire later', async () => {
    store = new TestAuthStore(
      {},
      {
        cache: {
          ttl: 1000,
          removeExpiredEntities: true,
        },
      }
    );
    query = new TestAuthQuery(store);

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
    ]); //    0ms
    expect(store._value().ids.length).toBe(2);

    await new Promise((accept) => setTimeout(accept, 500)); //  500ms
    store.update(1, { token: 'token 1 new' });

    await new Promise((accept) => setTimeout(accept, 500)); // 1000ms
    expect(store._value().ids.length).toBe(1);
    expect(store._value().entities[1].token).toBe('token 1 new');

    await new Promise((accept) => setTimeout(accept, 1000)); // 2000ms
    expect(store._value().ids.length).toBe(0);
  });

  it('removed entity should cancel expiration', async () => {
    store = new TestAuthStore(
      {},
      {
        cache: {
          ttl: 1000,
          removeExpiredEntities: true,
        },
      }
    );
    query = new TestAuthQuery(store);

    const base = Date.now();
    store.expired$.subscribe(({ id }) => {
      if (id === 2) {
        fail('Entity id=2 should not expire.');
      }
    });

    store.set([
      { id: 1, token: 'token 1' },
      { id: 2, token: 'token 2' },
    ]);
    expect(store._value().ids.length).toBe(2);

    await new Promise((accept) => setTimeout(accept, 500)); //  500ms
    store.remove(2);

    await new Promise((accept) => setTimeout(accept, 1000)); // 1500ms
    expect(store._value().ids.length).toBe(0);
  });

  it('useEntityCache', async () => {
    store = new TestAuthStore(
      {},
      {
        cache: {
          ttl: 1000,
          removeExpiredEntities: false,
        },
      }
    );
    query = new TestAuthQuery(store);

    const source = of({ id: 1, token: 'token 1 - new' } as TestAuth);
    store.set([
      { id: 1, token: 'token 1' },
      { id: 2, token: 'token 2' },
    ]);
    expect(store._value().ids.length).toBe(2);

    {
      const result = await source.pipe(useEntityCache(query, 1), first()).toPromise();
      expect(result.id).toBe(1);
      expect(result.token).toBe('token 1');
    }

    await new Promise((accept) => setTimeout(accept, 1500));

    {
      const result = await source.pipe(useEntityCache(query, 1), first()).toPromise();
      expect(result.id).toBe(1);
      expect(result.token).toBe('token 1 - new');
    }
  });
});
