import { Store } from './store';
import { Observable } from 'rxjs';
import { queryConfigKey, QueryConfigOptions } from './queryConfig';
import { isString } from './isString';
import { isFunction } from './isFunction';
import { isDev } from './env';
import { __queries__ } from './stores';

export class Query<S> {
  // @internal
  __store__: Store<S>;

  constructor(protected store: Store<S>) {
    this.__store__ = store;
    if(isDev()) {
      // @internal
      __queries__[store.storeName] = this;
    }
  }

  /**
   * Select a slice from the store
   *
   * @example
   *
   * this.query.select()
   * this.query.select(state => state.entities)
   * this.query.select('token');
   */
  select<K extends keyof S>(key: K): Observable<S[K]>;
  select<R>(project: (store: S) => R): Observable<R>;
  select(): Observable<S>;
  select<R>(project?: ((store: S) => R) | keyof S): Observable<R | S> {
    let mapFn;
    if (isFunction(project)) {
      mapFn = project;
    } else if (isString(project)) {
      mapFn = state => state[project];
    } else {
      mapFn = state => state;
    }

    return this.store._select(mapFn);
  }

  /**
   * Select the loading state
   *
   * @example
   *
   * this.query.selectLoading().subscribe(isLoading => {})
   */
  selectLoading() {
    return this.select(state => (state as S & { loading: boolean }).loading);
  }

  /**
   * Select the error state
   *
   * @example
   *
   * this.query.selectError().subscribe(error => {})
   */
  selectError<ErrorType = any>(): Observable<ErrorType> {
    return this.select(state => (state as S & { error: ErrorType }).error);
  }

  /**
   * Get the store's value
   *
   * @example
   *
   * this.query.getValue()
   *
   */
  getValue(): S {
    return this.store._value();
  }

  /**
   * Select the cache state
   *
   * @example
   *
   * this.query.selectHasCache().pipe(
   *   switchMap(hasCache => {
   *     return hasCache ? of() : http().pipe(res => store.set(res))
   *   })
   * )
   */
  selectHasCache(): Observable<boolean> {
    return this.store._cache().asObservable();
  }

  /**
   * Whether we've cached data
   *
   * @example
   *
   * this.query.getHasCache()
   *
   */
  getHasCache(): boolean {
    return this.store._cache().value;
  }

  // @internal
  get config(): QueryConfigOptions {
    return this.constructor[queryConfigKey];
  }
}
