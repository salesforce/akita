import { StoreCache, UpdateStateCallback } from './types';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { assertStoreHasName } from './errors';
import { commit, isTransactionInProcess } from './transaction';
import { deepFreeze } from './deepFreeze';
import { configKey, StoreConfigOptions, UpdatableStoreConfigOptions } from './storeConfig';
import { getAkitaConfig } from './config';
import { isPlainObject } from './isPlainObject';
import { isFunction } from './isFunction';
import { rootDispatcher } from './rootDispatcher';
import { __stores__ } from './stores';
import { Actions, newStateAction, resetCustomAction, setAction } from './actions';
import { isNotBrowser } from './root';
import { __DEV__, isDev } from './env';
import { DEFAULT_ID_KEY } from './defaultIDKey';

/**
 *
 * Store for managing any type of data
 *
 * @example
 *
 * export interface SessionState {
 *   token: string;
 *   userDetails: UserDetails
 * }
 *
 * export function createInitialState(): SessionState {
 *  return {
 *    token: '',
 *    userDetails: null
 *  };
 * }
 *
 * @StoreConfig({ name: 'session' })
 * export class SessionStore extends Store<SessionState> {
 *   constructor() {
 *    super(createInitialState());
 *   }
 * }
 */
export class Store<S> {
  private store: BehaviorSubject<Readonly<S>>;
  private storeValue: S;
  private inTransaction = false;
  private _initialState: S;
  protected cache: StoreCache = {
    active: new BehaviorSubject<boolean>(false),
    ttl: null
  };

  constructor(initialState: Partial<S>, protected options: Partial<StoreConfigOptions> = {}) {
    this.onInit(initialState as S);
  }

  /**
   *  Set the loading state
   *
   *  @example
   *
   *  store.setLoading(true)
   *
   */
  setLoading(loading = false) {
    if (loading !== (this._value() as S & { loading: boolean }).loading) {
      isDev() && setAction('Set Loading');
      this._setState(state => ({ ...state, loading } as S & { loading: boolean }));
    }
  }

  /**
   *
   * Set whether the data is cached
   *
   * @example
   *
   * store.setHasCache(true)
   * store.setHasCache(false)
   *
   */
  setHasCache(hasCache: boolean) {
    if (hasCache !== this.cache.active.value) {
      this.cache.active.next(hasCache);
    }
  }

  /**
   *  Set the error state
   *
   *  @example
   *
   *  store.setError({text: 'unable to load data' })
   *
   */
  setError<T>(error: T) {
    if (error !== (this._value() as S & { error: any }).error) {
      isDev() && setAction('Set Error');
      this._setState(state => ({ ...state, error } as S & { error: any }));
    }
  }

  // @internal
  _select<R>(project: (store: S) => R): Observable<R> {
    return this.store.asObservable().pipe(
      map(project),
      distinctUntilChanged()
    );
  }

  // @internal
  _value(): S {
    return this.storeValue;
  }

  // @internal
  _cache(): BehaviorSubject<boolean> {
    return this.cache.active;
  }

  // @internal
  get config(): StoreConfigOptions {
    return this.constructor[configKey] || {};
  }

  // @internal
  get storeName() {
    return this.config.storeName || this.options.storeName || this.options.name;
  }

  // @internal
  get idKey() {
    return this.config.idKey || this.options.idKey || DEFAULT_ID_KEY;
  }

  // @internal
  get cacheConfig() {
    return this.config.cache || this.options.cache;
  }

  // @internal
  _setState(newStateFn: (state: Readonly<S>) => S, _dispatchAction = true) {
    this.storeValue = __DEV__ ? deepFreeze(newStateFn(this._value())) : newStateFn(this._value());

    if (!this.store) {
      this.store = new BehaviorSubject(this.storeValue);
      rootDispatcher.next(newStateAction(this.storeName, true));
      return;
    }

    if (isTransactionInProcess()) {
      this.handleTransaction();
      return;
    }

    this.dispatch(this.storeValue, _dispatchAction);
  }

  /**
   *
   * Reset the current store back to the initial value
   *
   * @example
   *
   * store.reset()
   *
   */
  reset() {
    if (this.isResettable()) {
      isDev() && setAction('Reset');
      this._setState(() => Object.assign({}, this._initialState));
      this.setHasCache(false);
    } else {
      isDev() && console.warn(`You need to enable the reset functionality`);
    }
  }

  /**
   *
   * Update the store's value
   *
   * @example
   *
   * this.store.update(state => {
   *   return {...}
   * })
   */
  update(stateCallback: UpdateStateCallback<S>);
  /**
   *
   * @example
   *
   *  this.store.update({ token: token })
   */
  update(state: Partial<S>);
  update(stateOrCallback: Partial<S> | UpdateStateCallback<S>) {
    isDev() && setAction('Update');

    this._setState(state => {
      const newState = isFunction(stateOrCallback) ? stateOrCallback(state) : stateOrCallback;
      const merged = this.akitaPreUpdate(state, { ...state, ...newState } as S);
      return isPlainObject(state) ? merged : new (state as any).constructor(merged);
    });
  }

  updateStoreConfig(newOptions: UpdatableStoreConfigOptions) {
    this.options = { ...this.options, ...newOptions };
  }

  // @internal
  akitaPreUpdate(_: Readonly<S>, nextState: Readonly<S>): S {
    return nextState;
  }

  ngOnDestroy() {
    this.destroy();
  }

  /**
   *
   * Destroy the store
   *
   * @example
   *
   * store.destroy()
   *
   */
  destroy() {
    if (isNotBrowser) return;
    if (!(window as any).hmrEnabled && this === __stores__[this.storeName]) {
      delete __stores__[this.storeName];
      rootDispatcher.next({
        type: Actions.DELETE_STORE,
        payload: { storeName: this.storeName }
      });
      this.setHasCache(false);
      this.cache.active.complete();
    }
  }

  private onInit(initialState: S) {
    isDev() && setAction('@@INIT');
    __stores__[this.storeName] = this;
    this._setState(() => initialState);
    rootDispatcher.next({
      type: Actions.NEW_STORE,
      payload: { store: this }
    });
    if (this.isResettable()) {
      this._initialState = initialState;
    }
    isDev() && assertStoreHasName(this.storeName, this.constructor.name);
  }

  private dispatch(state: S, _dispatchAction = true) {
    this.store.next(state);
    if (_dispatchAction) {
      rootDispatcher.next(newStateAction(this.storeName));
      resetCustomAction();
    }
  }

  private watchTransaction() {
    commit().subscribe(() => {
      this.inTransaction = false;
      this.dispatch(this._value());
    });
  }

  private isResettable() {
    const localReset = this.config && this.config.resettable;
    if (localReset === false) {
      return false;
    }
    return localReset || getAkitaConfig().resettable;
  }

  private handleTransaction() {
    if (!this.inTransaction) {
      this.watchTransaction();
      this.inTransaction = true;
    }
  }
}
