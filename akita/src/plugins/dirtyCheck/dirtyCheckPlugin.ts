import { AkitaPlugin, Queries } from '../plugin';
import { QueryEntity } from '../../queryEntity';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, skip } from 'rxjs/operators';
import { isUndefined } from '../../isUndefined';
import { Query } from '../../query';
import { coerceArray } from '../../coerceArray';
import { isFunction } from '../../isFunction';
import { logAction } from '../../actions';

type Head<State = any> = State | Partial<State>;

export type DirtyCheckComparator<State> = (head: State, current: State) => boolean;

export type DirtyCheckParams<StoreState = any> = {
  comparator?: DirtyCheckComparator<StoreState>;
  watchProperty?: keyof StoreState | (keyof StoreState)[];
};

export const dirtyCheckDefaultParams = {
  comparator: (head, current) => JSON.stringify(head) !== JSON.stringify(current)
};

export function getNestedPath(nestedObj, path: string) {
  const pathAsArray: string[] = path.split('.');
  return pathAsArray.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), nestedObj);
}

export type DirtyCheckResetParams<StoreState = any> = {
  updateFn?: StoreState | ((head: StoreState, current: StoreState) => any);
};

export class DirtyCheckPlugin<State = any> extends AkitaPlugin<State> {
  private head: Head<State>;
  private dirty = new BehaviorSubject(false);
  private subscription: Subscription;
  private active = false;
  private _reset = new Subject();

  isDirty$: Observable<boolean> = this.dirty.asObservable().pipe(distinctUntilChanged());
  reset$ = this._reset.asObservable();

  constructor(protected query: Queries<State>, private params?: DirtyCheckParams<State>, private _entityId?: any) {
    super(query);
    this.params = { ...dirtyCheckDefaultParams, ...params };
    if (this.params.watchProperty) {
      let watchProp = coerceArray(this.params.watchProperty) as any[];
      if (query instanceof QueryEntity && watchProp.includes('entities') && !watchProp.includes('ids')) {
        watchProp.push('ids');
      }
      this.params.watchProperty = watchProp;
    }
  }

  reset(params: DirtyCheckResetParams = {}) {
    let currentValue = this.head;
    if (isFunction(params.updateFn)) {
      if (this.isEntityBased(this._entityId)) {
        currentValue = params.updateFn(this.head, (this.getQuery() as QueryEntity<State>).getEntity(this._entityId));
      } else {
        currentValue = params.updateFn(this.head, (this.getQuery() as Query<State>).getValue());
      }
    }
    logAction(`@DirtyCheck - Revert`);
    this.updateStore(currentValue, this._entityId);
    this._reset.next();
  }

  setHead() {
    if (!this.active) {
      this.activate();
      this.active = true;
    } else {
      this.head = this._getHead();
    }
    this.updateDirtiness(false);
    return this;
  }

  isDirty(): boolean {
    return !!this.dirty.value;
  }

  hasHead() {
    return !!this.getHead();
  }

  destroy() {
    this.head = null;
    this.subscription && this.subscription.unsubscribe();
    this._reset && this._reset.complete();
  }

  isPathDirty(path: string) {
    const head = this.getHead();
    const current = (this.getQuery() as Query<State>).getValue();
    const currentPathValue = getNestedPath(current, path);
    const headPathValue = getNestedPath(head, path);

    return this.params.comparator(currentPathValue, headPathValue);
  }

  protected getHead() {
    return this.head;
  }

  private activate() {
    this.head = this._getHead();
    /** if we are tracking specific properties select only the relevant ones */
    const source = this.params.watchProperty
      ? (this.params.watchProperty as (keyof State)[]).map(prop =>
          this.query
            .select(state => state[prop])
            .pipe(
              map(val => ({
                val,
                __akitaKey: prop
              }))
            )
        )
      : [this.selectSource(this._entityId)];
    this.subscription = combineLatest(...source)
      .pipe(skip(1))
      .subscribe((currentState: any[]) => {
        if (isUndefined(this.head)) return;
        /** __akitaKey is used to determine if we are tracking a specific property or a store change */
        const isChange = currentState.some(state => {
          const head = state.__akitaKey ? this.head[state.__akitaKey as any] : this.head;
          const compareTo = state.__akitaKey ? state.val : state;

          return this.params.comparator(head, compareTo);
        });

        this.updateDirtiness(isChange);
      });
  }

  private updateDirtiness(isDirty: boolean) {
    this.dirty.next(isDirty);
  }

  private _getHead(): Head<State> {
    let head: Head<State> = this.getSource(this._entityId);
    if (this.params.watchProperty) {
      head = this.getWatchedValues(head as State);
    }
    return head;
  }

  private getWatchedValues(source: State): Partial<State> {
    return (this.params.watchProperty as (keyof State)[]).reduce(
      (watched, prop) => {
        watched[prop] = source[prop];
        return watched;
      },
      {} as Partial<State>
    );
  }
}
