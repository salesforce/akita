import { EntityStore } from './entityStore';
import { AkitaError } from './errors';
import { isNil } from './isNil';
import { Store } from './store';
import { configKey } from './storeConfig';
import { __stores__ } from './stores';
import { Constructor } from './types';

export enum StoreAction {
  Update = 'UPDATE',
}

const StoreActionMapping = {
  [StoreAction.Update]: 'update',
};

export enum EntityStoreAction {
  Update = 'UPDATE',
  AddEntities = 'ADD_ENTITIES',
  SetEntities = 'SET_ENTITIES',
  UpdateEntities = 'UPDATE_ENTITIES',
  RemoveEntities = 'REMOVE_ENTITIES',
  UpsertEntities = 'UPSERT_ENTITIES',
  UpsertManyEntities = 'UPSERT_MANY_ENTITIES',
}

const EntityStoreActionMapping = {
  [EntityStoreAction.Update]: 'update',
  [EntityStoreAction.AddEntities]: 'add',
  [EntityStoreAction.SetEntities]: 'set',
  [EntityStoreAction.UpdateEntities]: 'update',
  [EntityStoreAction.RemoveEntities]: 'remove',
  [EntityStoreAction.UpsertEntities]: 'upsert',
  [EntityStoreAction.UpsertManyEntities]: 'upsertMany',
};

/**
 * Get a {@link Store} from the global store registry.
 * @param storeClass The {@link Store} class to return the instance.
 */
export function getStore<TStore extends Store<S>, S = TStore extends Store<infer T> ? T : never>(storeClass: Constructor<TStore>): TStore {
  const store = __stores__[storeClass[configKey]['storeName']] as TStore;

  if (isNil(store)) {
    throw new AkitaError(`${store} doesn't exist`);
  }

  return store;
}

/**
 * Get a {@link EntityStore} from the global store registry.
 * @param storeClass The {@link EntityStore} class to return the instance.
 */
export function getEntityStore<TEntityStore extends EntityStore<S>, S = TEntityStore extends EntityStore<infer T> ? T : never>(storeClass: Constructor<TEntityStore>): TEntityStore {
  return getStore(storeClass as Constructor<Store<S>>) as TEntityStore;
}

/**
 *  @example
 *
 *  runStoreAction(BooksStore, StoreAction.Update, update => update({ filter: 'COMPLETE' }));
 *
 */
export function runStoreAction<TStore extends Store<S>, S = TStore extends Store<infer T> ? T : never>(
  storeClass: Constructor<TStore>,
  action: StoreAction.Update,
  operation: (operator: TStore['update']) => void
);
export function runStoreAction<TStore extends Store<S>, S = TStore extends Store<infer T> ? T : never>(
  storeClass: Constructor<TStore>,
  action: StoreAction,
  operation: (operator: TStore[keyof TStore] & Function) => void
) {
  const store = getStore<TStore, S>(storeClass);
  operation(store[StoreActionMapping[action]].bind(store));
}

/**
 *  @example
 *
 *  runEntityStoreAction(BooksStore, EntityStoreAction.SetEntities, set => set([{ id: 1 }, { id: 2 }]));
 *
 */
export function runEntityStoreAction<TEntityStore extends EntityStore<S>, S = TEntityStore extends EntityStore<infer T> ? T : never>(
  storeClass: Constructor<TEntityStore>,
  action: EntityStoreAction.SetEntities,
  operation: (operator: TEntityStore['set']) => void
);
/**
 *  @example
 *
 *  runEntityStoreAction(BooksStore, EntityStoreAction.AddEntities, add => add({ id: 1 }));
 *
 */
export function runEntityStoreAction<TEntityStore extends EntityStore<S>, S = TEntityStore extends EntityStore<infer T> ? T : never>(
  storeClass: Constructor<TEntityStore>,
  action: EntityStoreAction.AddEntities,
  operation: (operator: TEntityStore['add']) => void
);
/**
 *  @example
 *
 *  runEntityStoreAction(BooksStore, EntityStoreAction.UpdateEntities, update => update(2, { title: 'New title' }));
 *
 */
export function runEntityStoreAction<TEntityStore extends EntityStore<S>, S = TEntityStore extends EntityStore<infer T> ? T : never>(
  storeClass: Constructor<TEntityStore>,
  action: EntityStoreAction.UpdateEntities,
  operation: (operator: TEntityStore['update']) => void
);
/**
 *  @example
 *
 *  runEntityStoreAction(BooksStore, EntityStoreAction.RemoveEntities, remove => remove(2));
 *
 */
export function runEntityStoreAction<TEntityStore extends EntityStore<S>, S = TEntityStore extends EntityStore<infer T> ? T : never>(
  storeClass: Constructor<TEntityStore>,
  action: EntityStoreAction.RemoveEntities,
  operation: (operator: TEntityStore['remove']) => void
);
/**
 *  @example
 *
 *  runEntityStoreAction(BooksStore, EntityStoreAction.UpsertEntities, upsert => upsert([2, 3], { title: 'New Title' }, (id, newState) => ({ id, ...newState, price: 0 })));
 *
 */
export function runEntityStoreAction<TEntityStore extends EntityStore<S>, S = TEntityStore extends EntityStore<infer T> ? T : never>(
  storeClass: Constructor<TEntityStore>,
  action: EntityStoreAction.UpsertEntities,
  operation: (operator: TEntityStore['upsert']) => void
);
/**
 *  @example
 *
 *  runEntityStoreAction(BooksStore, EntityStoreAction.UpsertManyEntities, upsertMany => upsertMany([
 *    { id: 2, title: 'New title', price: 0 },
 *    { id: 4, title: 'Another title', price: 0 },
 *  ));
 */
export function runEntityStoreAction<TEntityStore extends EntityStore<S>, S = TEntityStore extends EntityStore<infer T> ? T : never>(
  storeClass: Constructor<TEntityStore>,
  action: EntityStoreAction.UpsertManyEntities,
  operation: (operator: TEntityStore['upsertMany']) => void
);
export function runEntityStoreAction<TEntityStore extends EntityStore<S>, S = TEntityStore extends EntityStore<infer T> ? T : never>(
  storeClass: Constructor<TEntityStore>,
  action: EntityStoreAction,
  operation: (operator: TEntityStore[keyof TEntityStore] & Function) => void
) {
  const store = getEntityStore<TEntityStore, S>(storeClass);
  operation(store[EntityStoreActionMapping[action]].bind(store));
}
