import { Store } from './store';
import { Query } from './query';
import { EntityStoreConfig, StoreConfigOptions } from './storeConfig';
import { EntityStore } from './entityStore';
import { QueryEntity } from './queryEntity';

export function createStore<State>(initialState: Partial<State>, options: Partial<StoreConfigOptions>) {
  return new Store<State>(initialState, options);
}

export function createQuery<State>(store: Store<State>) {
  return new Query<State>(store);
}

export function createEntityStore<State, Entity>(initialState: Partial<State>, options: Partial<EntityStoreConfig>) {
  return new EntityStore<State, Entity>(initialState, options);
}

export function createEntityQuery<State, Entity>(store: EntityStore<State, Entity>) {
  return new QueryEntity<State, Entity>(store);
}
