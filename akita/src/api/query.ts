import { Store } from './store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { queryConfigKey, QueryConfigOptions } from './query-config';

export class Query<S> {
  /** Use only for internal plugins like Pagination - don't use this property **/
  __store__: Store<S>;

  constructor(protected store: Store<S>) {
    this.__store__ = store;
  }

  /**
   * Select a slice from the store.
   *
   * @example
   * this.query.select()
   * this.query.select(state => state.entities)
   */
  select<R>(project?: (store: S) => R): Observable<R>;
  select(): Observable<S>;
  select<R>(project?: (store: S) => R): Observable<R | S> {
    let state = project ? project : state => state;
    return this.store._select(state);
  }

  /**
   * Select once and complete.
   */
  selectOnce<R>(project: (store: S) => R): Observable<R> {
    return this.select(project).pipe(take(1));
  }

  /**
   * Select the store's loading state.
   */
  selectLoading() {
    return this.select(state => (state as S & { loading: boolean }).loading);
  }

  /**
   * Select the store's error state.
   */
  selectError<E = any>(): Observable<E> {
    return this.select(state => (state as S & { error: E }).error);
  }

  /**
   * Get the raw value of the store.
   * @deprecated use `getValue()` method
   */
  getSnapshot(): S {
    return this.store._value();
  }

  /**
   * Get the raw value of the store.
   */
  getValue(): S {
    return this.store._value();
  }

  /**
   *  Returns whether the state of the store is pristine (the set() method hasn't been explicitly called
   *  since the store creation, or the last time setPristine()was called).
   */
  get isPristine() {
    return this.store.isPristine;
  }

  /**
   * Returns whether the state of the store is dirty (the set() method
   * or the setDirty() method has been explicitly called since the store creation,
   * or the last time setPristine() was called).
   */
  get isDirty() {
    return !this.store.isPristine;
  }

  get config(): QueryConfigOptions {
    return this.constructor[queryConfigKey];
  }
}
