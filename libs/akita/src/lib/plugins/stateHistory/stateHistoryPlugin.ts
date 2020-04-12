import { pairwise, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { AkitaPlugin, Queries } from '../plugin';
import { logAction } from '../../actions';
import { isFunction } from '../../isFunction';

export interface StateHistoryParams {
  maxAge?: number;
  watchProperty?: string;
  comparator?: (prevState, currentState) => boolean;
}

export type History<State> = {
  past: State[];
  present: State | null;
  future: State[];
};

export class StateHistoryPlugin<State = any> extends AkitaPlugin<State> {
  /** Allow skipping an update from outside */
  private skip = false;

  private history = {
    past: [],
    present: null,
    future: []
  };

  /** Skip the update when redo/undo */
  private skipUpdate = false;
  private subscription;

  /* Subjects for supporting observable hasPast$ and hasFuture$ */
  private hasPastSubject: BehaviorSubject<boolean>;
  private _hasPast$: Observable<boolean>;
  private hasFutureSubject: BehaviorSubject<boolean>;
  private _hasFuture$: Observable<boolean>;

  constructor(protected query: Queries<State>, private params: StateHistoryParams = {}, private _entityId?: any) {
    super(query, {
      resetFn: () => this.clear()
    });
    params.maxAge = !!params.maxAge ? params.maxAge : 10;
    params.comparator = params.comparator || (() => true);

    this.activate();
  }

  /**
   * Observable stream representing whether the history plugin has an available past
   *
   */
  get hasPast$(): Observable<boolean> {
    return this._hasPast$;
  }

  /**
   * Observable stream representing whether the history plugin has an available future
   *
   */
  get hasFuture$(): Observable<boolean> {
    return this._hasFuture$;
  }

  get hasPast() {
    return this.history.past.length > 0;
  }

  get hasFuture() {
    return this.history.future.length > 0;
  }

  private get property() {
    return this.params.watchProperty;
  }

  /* Updates the hasPast$ hasFuture$ observables*/
  private updateHasHistory() {
    this.hasFutureSubject.next(this.hasFuture);
    this.hasPastSubject.next(this.hasPast);
  }

  activate() {
    this.hasPastSubject = new BehaviorSubject(false);
    this._hasPast$ = this.hasPastSubject.asObservable().pipe(distinctUntilChanged());
    this.hasFutureSubject = new BehaviorSubject(false);
    this._hasFuture$ = this.hasFutureSubject.asObservable().pipe(distinctUntilChanged());

    this.history.present = this.getSource(this._entityId, this.property);
    this.subscription = (this as any)
      .selectSource(this._entityId, this.property)
      .pipe(pairwise())
      .subscribe(([past, present]) => {
        if (this.skip) {
          this.skip = false;
          return;
        }
        /**
         *  comparator: (prev, current) => isEqual(prev, current) === false
         */
        const shouldUpdate = this.params.comparator(past, present);

        if (!this.skipUpdate && shouldUpdate) {
          if (this.history.past.length === this.params.maxAge) {
            this.history.past = this.history.past.slice(1);
          }
          this.history.past = [...this.history.past, past];
          this.history.present = present;
          this.updateHasHistory();
        }
      });
  }

  undo() {
    if (this.history.past.length > 0) {
      const { past, present } = this.history;
      const previous = past[past.length - 1];
      this.history.past = past.slice(0, past.length - 1);
      this.history.present = previous;
      this.history.future = [present, ...this.history.future];
      this.update();
    }
  }

  redo() {
    if (this.history.future.length > 0) {
      const { past, present } = this.history;
      const next = this.history.future[0];
      const newFuture = this.history.future.slice(1);
      this.history.past = [...past, present];
      this.history.present = next;
      this.history.future = newFuture;
      this.update('Redo');
    }
  }

  jumpToPast(index: number) {
    if (index < 0 || index >= this.history.past.length) return;

    const { past, future, present } = this.history;
    /**
     *
     * const past = [1, 2, 3, 4, 5];
     * const present = 6;
     * const future = [7, 8, 9];
     * const index = 2;
     *
     * newPast = past.slice(0, index) = [1, 2];
     * newPresent = past[index] = 3;
     * newFuture = [...past.slice(index + 1),present, ...future] = [4, 5, 6, 7, 8, 9];
     *
     */
    const newPast = past.slice(0, index);
    const newFuture = [...past.slice(index + 1), present, ...future];
    const newPresent = past[index];
    this.history.past = newPast;
    this.history.present = newPresent;
    this.history.future = newFuture;
    this.update();
  }

  jumpToFuture(index: number) {
    if (index < 0 || index >= this.history.future.length) return;

    const { past, future, present } = this.history;
    /**
     *
     * const past = [1, 2, 3, 4, 5];
     * const present = 6;
     * const future = [7, 8, 9, 10]
     * const index = 1
     *
     * newPast = [...past, present, ...future.slice(0, index) = [1, 2, 3, 4, 5, 6, 7];
     * newPresent = future[index] = 8;
     * newFuture = futrue.slice(index+1) = [9, 10];
     *
     */

    const newPast = [...past, present, ...future.slice(0, index)];
    const newPresent = future[index];
    const newFuture = future.slice(index + 1);
    this.history.past = newPast;
    this.history.present = newPresent;
    this.history.future = newFuture;
    this.update('Redo');
  }

  /**
   *
   * jump n steps in the past or forward
   *
   */
  jump(n: number) {
    if (n > 0) return this.jumpToFuture(n - 1);
    if (n < 0) return this.jumpToPast(this.history.past.length + n);
  }

  /**
   * Clear the history
   *
   * @param customUpdateFn Callback function for only clearing part of the history
   *
   * @example
   *
   * stateHistory.clear((history) => {
   *  return {
   *    past: history.past,
   *    present: history.present,
   *    future: []
   *  };
   * });
   */
  clear(customUpdateFn?: (history: History<State>) => History<State>) {
    this.history = isFunction(customUpdateFn)
      ? customUpdateFn(this.history)
      : {
          past: [],
          present: null,
          future: []
        };
    this.updateHasHistory();
  }

  destroy(clearHistory = false) {
    if (clearHistory) {
      this.clear();
    }
    this.subscription.unsubscribe();
  }

  ignoreNext() {
    this.skip = true;
  }

  private update(action = 'Undo') {
    this.skipUpdate = true;
    logAction(`@StateHistory - ${action}`);
    this.updateStore(this.history.present, this._entityId, this.property);
    this.updateHasHistory();
    this.skipUpdate = false;
  }
}
