import { Store } from './store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export class Query<S> {
  constructor(protected store: Store<S>) {}

  /**
   * Select a slice from the store.
   *
   * this.query.select(state => state.entities)
   */
  select<R>(project: (store: S) => R): Observable<R> {
    return this.store._select(project);
  }

  /**
   * Select once and complete.
   */
  selectOnce<R>(project: (store: S) => R): Observable<R> {
    return this.select(project).pipe(take(1));
  }

  /**
   * Get the raw value of the store.
   */
  getSnapshot(): S {
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
}
