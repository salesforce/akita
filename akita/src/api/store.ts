import { HashMap, ID } from './types';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AkitaImmutabilityError, assertDecorator } from '../internal/error';
import { commit, isTransactionInProcess } from '../internal/transaction.internal';
import { isFunction, isPlainObject } from '../internal/utils';
import { deepFreeze } from '../internal/deep-freeze';
import { configKey, StoreConfigOptions } from './store-config';
import { __globalState } from '../internal/global-state';

/** Whether we are in dev mode */
let __DEV__ = true;

export const __stores__: { [storeName: string]: Store<any> } = {};

export const enum Actions {
  NEW_STORE,
  NEW_STATE
}

export type Action = {
  type: Actions;
  payload: HashMap<any>;
};

export const rootDispatcher = new ReplaySubject<Action>();

function nextState(storeName, initialState = false) {
  return {
    type: Actions.NEW_STATE,
    payload: {
      name: storeName,
      initialState
    }
  };
}

/**
 * Enable production mode to disable objectFreeze
 */
export function enableAkitaProdMode() {
  __DEV__ = false;
}

export function isDev() {
  return __DEV__;
}

/**
 * The Root Store that every sub store needs to inherit and
 * invoke `super` with the initial state.
 */
export class Store<S> {
  /** Manage the store with BehaviorSubject */
  private store: BehaviorSubject<Readonly<S>>;

  /** The current state value */
  private storeValue: S;

  /** Whether we are inside transaction **/
  private inTransaction = false;

  private _isPristine = true;

  /**
   *
   * Initial the store with the state
   */
  constructor(initialState) {
    __globalState.setAction({ type: '@@INIT' });
    __stores__[this.storeName] = this;
    this.setState(() => initialState);
    rootDispatcher.next({
      type: Actions.NEW_STORE,
      payload: { store: this }
    });
    isDev() && assertDecorator(this.storeName, this.constructor.name);
  }

  setLoading(loading = false) {
    if (loading !== (this._value() as S & { loading: boolean }).loading) {
      isDev() && __globalState.setAction({ type: 'Set Loading' });
      this.setState(s => ({ ...(s as object), loading } as any));
    }
  }

  /**
   * Update the store's error state.
   */
  setError<T>(error: T) {
    if (error !== (this._value() as S & { error: any }).error) {
      isDev() && __globalState.setAction({ type: 'Set Error' });
      this.setState(s => ({ ...(s as object), error } as any));
    }
  }

  /**
   * Select a slice from the store
   *
   * @example
   * this.store.select(state => state.entities)
   *
   */
  _select<R>(project: (store: S) => R): Observable<R> {
    return this.store$.pipe(
      map(project),
      distinctUntilChanged()
    );
  }

  _value(): S {
    return this.storeValue;
  }

  get config(): StoreConfigOptions {
    return this.constructor[configKey];
  }

  /**
   * Get the store name
   */
  get storeName() {
    return this.config && this.config['storeName'];
  }

  get isPristine() {
    return this._isPristine;
  }

  /**
   * `setState()` is the only way to update a store; It receives a callback function,
   * which gets the current state, and returns a new immutable state,
   * which will be the new value of the store.
   */
  setState(newStateFn: (state: Readonly<S>) => S, _rootDispatcher = true) {
    const prevState = this._value();
    this.storeValue = __DEV__ ? deepFreeze(newStateFn(this._value())) : newStateFn(this._value());

    if (prevState === this.storeValue) {
      throw new AkitaImmutabilityError(this.storeName);
    }

    if (!this.store) {
      this.store = new BehaviorSubject(this.storeValue);
      rootDispatcher.next(nextState(this.storeName, true));
      return;
    }

    if (isTransactionInProcess()) {
      this.handleTransaction();
      return;
    }

    this.dispatch(this.storeValue, _rootDispatcher);
  }

  /**
   * This method is a shortcut for `setState()`.
   * It can be useful when you want to pass the whole state object instead of merging a partial state.
   *
   * @example
   * this.store.update(newState)
   */
  update(newState: (state: Readonly<S>) => Partial<S>);
  update(newState: Partial<S>);
  update(id: ID | ID[] | null, newState: Partial<S>);
  update(newStateOrId: Partial<S> | ID | ID[] | null | ((state: Readonly<S>) => Partial<S>), newState?: Partial<S>) {
    __globalState.setAction({ type: 'Update Store' });
    this.setState(state => {
      let value = isFunction(newStateOrId) ? newStateOrId(state) : newStateOrId;
      let merged = Object.assign({}, state, value);
      return isPlainObject(state) ? merged : new (state as any).constructor(merged);
    });
    this.setDirty();
  }

  /**
   * Sets the store to a pristine state.
   */
  setPristine() {
    this._isPristine = true;
  }

  /**
   * Sets the store to a dirty state, indicating that it is not pristine.
   */
  setDirty() {
    this._isPristine = false;
  }

  destroy = this.ngOnDestroy;

  private dispatch(state: S, _rootDispatcher = true) {
    this.store.next(state);
    if (_rootDispatcher) {
      rootDispatcher.next(nextState(this.storeName));
      isDev() && __globalState.setAction({ type: 'Set State' });
    }
  }

  private get store$() {
    return this.store.asObservable();
  }

  /**
   * When the transaction ends dispatch the final value once
   */
  private watchTransaction() {
    commit().subscribe(() => {
      this.inTransaction = false;
      if (isDev() && !__globalState.skipTransactionMsg) {
        __globalState.setAction({ type: '@Transaction' });
      }
      this.dispatch(this._value());
      __globalState.currentT = [];
      __globalState.skipTransactionMsg = false;
    });
  }

  /**
   * Listen to the transaction stream
   */
  private handleTransaction() {
    if (!this.inTransaction) {
      this.watchTransaction();
      this.inTransaction = true;
    }
  }

  private ngOnDestroy() {
    if (this === __stores__[this.storeName]) {
      delete __stores__[this.storeName];
    }
  }
}
