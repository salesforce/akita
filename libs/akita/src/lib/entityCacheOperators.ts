import { EntityState, getEntityType, getIDType } from './types';
import { EntityStore } from './entityStore';
import { combineLatest, MonoTypeOperatorFunction, Observable, of } from 'rxjs';
import { distinctUntilChanged, first, map, switchMap, switchMapTo, tap } from 'rxjs/operators';

function selectEntity<TStore extends EntityStore<TState, TEntity, TIdType>, TState extends EntityState<TEntity, TIdType>, TEntity, TIdType>(store: TStore, id: TIdType) {
  return store
    ._select((state) => state.entities)
    .pipe(
      map((entities) => entities[id as any]),
      distinctUntilChanged()
    );
}

/**
 * Tests whether an entity is invalidated by a predicate via the {@link StoreConfig}: If so, the subscription is forwarded
 * to the parent observable to request new entity data and update the store, otherwise return the existing entity and
 * ignore the parent observable.
 *
 * @example
 * ```ts
 *   @StoreConfig({
 *     cache: {
 *       invalidation: {
 *         entity: (entity: Todo) => entity.moreInfo === undefined
 *       }
 *     }
 *   })
 *   export class TodosStore extends EntityStore<TodosState, Todo> {
 *     constructor() {
 *       super({});
 *     }
 *   }
 *
 *   // ...
 *
 *   this.http.get('http://...').pipe(useEntityCache(this.todosStore, 1)).subscribe(entity => { ... })
 * ```
 * @param store The store in which the entity is located.
 * @param id The entity id to be tested.
 */
export function useEntityCache<
  TStore extends EntityStore<TState, TEntity, TIdType>,
  TState extends EntityState<TEntity, TIdType> = TStore extends EntityStore<infer I> ? I : never,
  TEntity = getEntityType<TState>,
  TIdType = getIDType<TState>
>(store: TStore, id: TIdType): MonoTypeOperatorFunction<TEntity> {
  const invalidation = store.cacheConfig && store.cacheConfig.invalidation;

  if (invalidation === undefined || !('entity' in invalidation) || invalidation.entity === undefined) {
    throw Error(`No entity predicate in @StoreConfig exists of '${store.storeName}' to compute cache invalidation: @StoreConfig({ cache: { entity: { predicate: (state) => boolean }}})`);
  }

  const result = selectEntity<TStore, TState, TEntity, TIdType>(store, id);

  return (source: Observable<TEntity>) =>
    result.pipe(
      first(),
      map<TEntity, [boolean, TEntity]>((entity) => [invalidation.entity(entity), entity]),
      switchMap(([invalid, oldEntity]) => {
        if (invalid) {
          return source.pipe(
            tap((newEntity) => {
              if (oldEntity) {
                store.update(id, newEntity);
              } else {
                store.add(newEntity);
              }
            }),
            switchMapTo(result)
          );
        }

        return result;
      })
    );
}

/**
 * Tests whether an entity is expired by its ttl set via the {@link StoreConfig}: If so, the subscription is forwarded
 * to the parent observable to request new entity data and update the store, otherwise return the existing entity and
 * ignore the parent observable.
 *
 * @example
 * ```ts
 *   @StoreConfig({
 *     cache: {
 *       ttl: 1000
 *     }
 *   })
 *   export class NotificationsStore extends EntityStore<NotificationsState, Todo> {
 *     constructor() {
 *       super({});
 *     }
 *   }
 *
 *   // ...
 *
 *   this.http.get('http://...').pipe(ttlEntityCache(this.notificationsStore, 1)).subscribe(entity => { ... })
 * ```
 * @param store The store in which the entity is located.
 * @param id The entity id to be tested.
 */
export function ttlEntityCache<
  TStore extends EntityStore<TState, TEntity, TIdType>,
  TState extends EntityState<TEntity, TIdType> = TStore extends EntityStore<infer I> ? I : never,
  TEntity = getEntityType<TState>,
  TIdType = getIDType<TState>
>(store: TStore, id: TIdType): MonoTypeOperatorFunction<TEntity> {
  const config = store.cacheConfig;

  if (config === undefined || config.ttl === undefined) {
    throw Error(`No cache ttl in @StoreConfig set of '${store.storeName}' to compute entity expiration: ` + `@StoreConfig({ cache: { ttl: 1000 }})`);
  }

  const result = selectEntity<TStore, TState, TEntity, TIdType>(store, id);

  return (source: Observable<TEntity>) =>
    combineLatest([
      store
        ._select((state) => state.entities)
        .pipe(
          map((entities) => entities[id as any] !== undefined),
          first()
        ),
      store
        ._select((state) => state.idsExpired)
        .pipe(
          map((idsExpired) => idsExpired[id as any] !== undefined),
          first()
        ),
    ]).pipe(
      switchMap(([IsPresent, isExpired]) => {
        if (!IsPresent || isExpired) {
          return source.pipe(
            tap((entity) => {
              if (IsPresent) {
                store.update(id as getIDType<TState>, entity);
              } else {
                store.add(entity as getEntityType<TState>);
              }
            }),
            switchMapTo(result)
          );
        }

        return result;
      })
    );
}
