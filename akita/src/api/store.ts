import { ID } from './types';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AkitaImmutabilityError } from '../internal/error';
import { commit, isTransactionInProcess } from '../internal/transaction.internal';
import { getFunctionName, isPlainObject } from '../internal/utils';
import { deepFreeze } from '../internal/deep-freeze';

/** Whether we are in dev mode */
let __DEV__ = true;

export const __rootDispatcher__ = new Subject<string>();
export const __registerStore__ = new Subject<Store<any>>();
export const __stores__: { [storeName: string]: Store<any> } = {};

/**
 * Enable production mode to disable objectFreeze
 */
export function enableAkitaProdMode() {
  __DEV__ = false;
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
    this.setState(() => initialState);
    __registerStore__.next(this);
    __stores__[this.storeName] = this;
  }

  /**
   * Select a slice from the store
   *
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

  /**
   * Get the store name
   */
  get storeName() {
    return getFunctionName(this.constructor);
  }

  get isPristine() {
    return this._isPristine;
  }

  /**
   * `setState()` is the only way to update a store; It receives a callback function,
   * which gets the current state, and returns a new immutable state,
   * which will be the new value of the store.
   */
  setState(newStateFn: (state: Readonly<S>) => S) {
    const prevState = this._value();
    this.storeValue = __DEV__ ? deepFreeze(newStateFn(this._value())) : newStateFn(this._value());

    if (prevState === this.storeValue) {
      throw new AkitaImmutabilityError(this.storeName);
    }

    if (!this.store) {
      this.store = new BehaviorSubject(this.storeValue);
      return;
    }

    if (isTransactionInProcess()) {
      this.handleTransaction();
      return;
    }

    this.dispatch(this.storeValue);
  }

  /**
   * This method is a shortcut for `setState()`.
   * It can be useful when you want to pass the whole state object instead of merging a partial state.
   *
   * this.store.update(newState)
   */
  update(newState: Partial<S>);
  update(id: ID | ID[] | null, newState: Partial<S>);
  update(newStateOrId: Partial<S> | ID | ID[] | null, newState?: Partial<S>) {
    this.setState(state => {
      const merged = Object.assign({}, state, newStateOrId);
      if (isPlainObject(this._value())) {
        return merged;
      } else {
        return new (state as any).constructor(merged);
      }
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

  private dispatch(state: S) {
    this.store.next(state);
    __rootDispatcher__.next(this.storeName);
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
      this.dispatch(this._value());
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
}
