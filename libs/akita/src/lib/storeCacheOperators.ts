import { Store } from '@datorama/akita';
import { MonoTypeOperatorFunction, Observable, of } from 'rxjs';
import { first, map, switchMap, switchMapTo, tap } from 'rxjs/operators';

/**
 * Tests whether a store state is invalidated by a predicate via the {@link StoreConfig}: If so, the subscription is
 * forwarded to the parent observable to request new state data and update the store, otherwise return the existing
 * state and ignore the parent observable.
 *
 * @example
 * ```ts
 *   @StoreConfig({
 *     cache: {
 *       invalidation: {
 *         store: (state: AuthState) => state.token === undefined
 *       }
 *     }
 *   })
 *   export class AuthStore extends Store<AuthState> {
 *     constructor() {
 *       super({});
 *     }
 *   }
 *
 *   // ...
 *
 *   this.http.get('http://...').pipe(useStoreCache(this.authStore)).subscribe(entity => { ... })
 * ```
 * @param store The store state to be tested.
 */
export function useStoreCache<TStore extends Store<TState>, TState = TStore extends Store<infer I> ? I : never>(store: TStore): MonoTypeOperatorFunction<Partial<TState>> {
  const invalidation = store.cacheConfig && store.cacheConfig.invalidation;

  if (invalidation === undefined || !('store' in invalidation) || invalidation.store === undefined) {
    throw Error(`No store predicate in @StoreConfig exists of '${store.storeName} to compute cache invalidation': @StoreConfig({ cache: { store: { predicate: (state) => boolean }}})`);
  }

  const result = store._select((state) => state);

  return (source: Observable<Partial<TState>>) =>
    result.pipe(
      first(),
      map<TState, [boolean, TState]>((state) => [invalidation.store(state), state]),
      switchMap(([invalid, state]) => {
        if (invalid) {
          return source.pipe(
            tap((state) => store.update(state)),
            switchMapTo(result)
          );
        }

        return result;
      })
    );
}

/**
 * Tests whether a store state is expired by its ttl set via {@link StoreConfig} or via {@link Store.setHasCache}:
 * If so, the subscription is forwarded to the parent observable to request new state data and update the store,
 * otherwise return the existing state and ignore the parent observable.
 *
 * @example
 * ```ts
 *   @StoreConfig({
 *     cache: {
 *       ttl: 24 * 3600
 *     }
 *   })
 *   export class AuthStore extends Store<AuthState> {
 *     constructor() {
 *       super({});
 *     }
 *   }
 *
 *   // ...
 *
 *   this.http.get('http://...').pipe(ttlStoreCache(this.authStore)).subscribe(entity => { ... })
 * ```
 * @param store The store state to be tested.
 */
export function ttlStoreCache<TStore extends Store<TState>, TState = TStore extends Store<infer I> ? I : never>(store: TStore): MonoTypeOperatorFunction<Partial<TState>> {
  return (source: Observable<Partial<TState>>) =>
    store._cache().pipe(
      first(),
      switchMap((cache) => {
        const select = store._select((state) => state);

        if (cache) {
          return select;
        } else {
          return source.pipe(
            tap((state) => store.update(state)),
            switchMapTo(select)
          );
        }
      })
    );
}
