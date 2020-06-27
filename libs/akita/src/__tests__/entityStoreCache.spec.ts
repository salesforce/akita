import { ActiveState, EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { EntityStoreAction, runEntityStoreAction, runStoreAction, StoreAction } from '../lib/runStoreAction';
import { createMockEntities } from './mocks';

export type TestAuth = {
  id: ID;
  token: string;
};

export interface TestAuthState extends EntityState<TestAuth>, ActiveState {}

@StoreConfig({ name: 'books', cache: { ttl: 1000, removeExpiredEntities: true } })
export class TestAuthStore extends EntityStore<TestAuthState> {
  constructor() {
    super();
  }
}

describe('entity store cache', () => {
  let store: TestAuthStore;

  beforeEach(() => {
    store = new TestAuthStore();
  });

  afterEach(() => {
    store.destroy();
  });

  it('entities should expire', async () => {
    store.set([
      { id: 1, token: 'token 1' },
      { id: 2, token: 'token 2' },
    ]);
    expect(store._value().ids.length).toBe(2);
    await new Promise((accept) => setTimeout(accept, 2000));
    expect(store._value().ids.length).toBe(0);
  });

  it('updated entity should expire later', async () => {
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
    console.log('A');

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
});
