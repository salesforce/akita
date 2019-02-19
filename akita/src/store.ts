import { UpdateStateCallback } from './types';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { assertStoreHasName } from './errors';
import { commit, isTransactionInProcess } from './transaction';
import { deepFreeze } from './deepFreeze';
import { configKey, StoreConfigOptions } from './storeConfig';
import { getAkitaConfig } from './config';
import { isPlainObject } from './isPlainObject';
import { isFunction } from './isFunction';
import { rootDispatcher } from './rootDispatcher';
import { __stores__ } from './stores';
import { Actions, newStateAction, resetCustomAction, setAction } from './actions';
import { root } from './root';
import { __DEV__, isDev } from './env';

export class Store<S> {
  private store: BehaviorSubject<Readonly<S>>;
  private storeValue: S;
  private inTransaction = false;
  private _initialState: S;

  constructor(initialState, private options: Partial<StoreConfigOptions> = {}) {
    this.onInit(initialState);
  }

  setLoading(loading = false) {
    if (loading !== (this._value() as S & { loading: boolean }).loading) {
      isDev() && setAction('Set Loading');
      this._setState(state => ({ ...state, loading } as S & { loading: boolean }));
    }
  }

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
  get config(): StoreConfigOptions {
    return this.constructor[configKey] || {};
  }

  // @internal
  get storeName() {
    return this.options.storeName || this.config.storeName;
  }

  // @internal
  get idKey() {
    return this.options.idKey || this.config.idKey;
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

  reset() {
    if (this.isResettable()) {
      this._setState(() => Object.assign({}, this._initialState));
      isDev() && setAction('Reset Store');
    } else {
      isDev() && console.warn(`You need to enable the reset functionality`);
    }
  }

  /**
   *
   * @example
   *
   * this.store.update(state => {
   *   return {...}
   * })
   */
  update(stateCallback: UpdateStateCallback<S>);
  /**
   *  this.store.update({ token: token })
   */
  update(state: Partial<S>);
  update(stateOrCallback: Partial<S> | UpdateStateCallback<S>) {
    isDev() && setAction('Update Store');

    this._setState(state => {
      const newState = isFunction(stateOrCallback) ? stateOrCallback(state) : stateOrCallback;
      const merged = { ...state, ...newState };
      return isPlainObject(state) ? merged : new (state as any).constructor(merged);
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    if (root.__window === false) return;
    if (!(window as any).hmrEnabled && this === __stores__[this.storeName]) {
      delete __stores__[this.storeName];
      rootDispatcher.next({
        type: Actions.DELETE_STORE,
        payload: { storeName: this.storeName }
      });
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
