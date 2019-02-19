import { Store } from './store';
import { Observable } from 'rxjs';
import { queryConfigKey, QueryConfigOptions } from './queryConfig';

export class Query<S> {
  // @internal
  __store__: Store<S>;

  constructor(protected store: Store<S>) {
    this.__store__ = store;
  }

  /**
   * Select a slice from the store
   *
   * @example
   *
   * this.query.select()
   * this.query.select(state => state.entities)
   */
  select<R>(project?: (store: S) => R): Observable<R>;
  select(): Observable<S>;
  select<R>(project?: (store: S) => R): Observable<R | S> {
    let state = project ? project : state => state;
    return this.store._select(state);
  }

  selectLoading() {
    return this.select(state => (state as S & { loading: boolean }).loading);
  }

  selectError<E = any>(): Observable<E> {
    return this.select(state => (state as S & { error: E }).error);
  }

  getValue(): S {
    return this.store._value();
  }

  get config(): QueryConfigOptions {
    return this.constructor[queryConfigKey];
  }
}
