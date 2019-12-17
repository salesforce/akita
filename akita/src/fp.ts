import { Store } from './store';
import { Query } from './query';
import { StoreConfigOptions } from './storeConfig';
import { EntityStore } from './entityStore';
import { QueryEntity } from './queryEntity';
import { QueryConfigOptions } from './queryConfig';
import { EntityState } from './types';

export function createStore<State>(initialState: Partial<State>, options: Partial<StoreConfigOptions>) {
  return new Store<State>(initialState, options);
}

export function createQuery<State>(store: Store<State>) {
  return new Query<State>(store);
}

export function createEntityStore<State extends EntityState>(initialState: Partial<State>, options: Partial<StoreConfigOptions>) {
  return new EntityStore<State>(initialState, options);
}

export function createEntityQuery<State extends EntityState>(store: EntityStore<State>, options: QueryConfigOptions = {}) {
  return new QueryEntity<State>(store, options);
}
