import { AkitaPlugin, Queries } from '../plugin';
import { QueryEntity } from '../../api/query-entity';
import { BehaviorSubject, Observable, Subject, Subscription, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, skip } from 'rxjs/operators';
import { coerceArray, isFunction, isUndefined, toBoolean } from '../../internal/utils';
import { EntityParam } from '../entity-collection-plugin';
import { __globalState } from '../../internal/global-state';
import { Query } from '../../api/query';

type Head<StoreState = any, Entity = any> = StoreState | Partial<StoreState> | Entity;

export type DirtyCheckComparator<Entity> = (head: Entity, current: Entity) => boolean;

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

export class DirtyCheckPlugin<Entity = any, StoreState = any> extends AkitaPlugin<Entity, StoreState> {
  private head: Head<StoreState, Entity>;
  private dirty = new BehaviorSubject(false);
  private subscription: Subscription;
  private active = false;
  private _reset = new Subject();

  isDirty$: Observable<boolean> = this.dirty.asObservable().pipe(distinctUntilChanged());
  reset$ = this._reset.asObservable();

  constructor(protected query: Queries<Entity, StoreState>, private params?: DirtyCheckParams, private _entityId?: EntityParam) {
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
        currentValue = params.updateFn(this.head, (this.getQuery() as QueryEntity<StoreState, Entity>).getEntity(this._entityId));
      } else {
        currentValue = params.updateFn(this.head, (this.getQuery() as Query<StoreState>).getValue());
      }
    }
    __globalState.setCustomAction({ type: `@DirtyCheck - Revert` });
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
    return toBoolean(this.dirty.value);
  }

  hasHead() {
    return toBoolean(this.getHead());
  }

  destroy() {
    this.head = null;
    this.subscription && this.subscription.unsubscribe();
    this._reset && this._reset.complete();
  }

  isPathDirty(path: string) {
    const head = this.getHead();
    const current = (this.getQuery() as Query<StoreState>).getValue();
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
      ? (this.params.watchProperty as (keyof StoreState)[]).map(prop =>
          this.query.select(state => state[prop]).pipe(
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

  private _getHead(): Head<StoreState, Entity> {
    let head: Head<StoreState, Entity> = this.getSource(this._entityId);
    if (this.params.watchProperty) {
      head = this.getWatchedValues(head as StoreState);
    }
    return head;
  }

  private getWatchedValues(source: StoreState): Partial<StoreState> {
    return (this.params.watchProperty as (keyof StoreState)[]).reduce(
      (watched, prop) => {
        watched[prop] = source[prop];
        return watched;
      },
      {} as Partial<StoreState>
    );
  }
}
