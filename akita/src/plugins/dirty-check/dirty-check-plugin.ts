import { AkitaPlugin, Queries } from '../plugin';
import { QueryEntity } from '../../api/query-entity';
import { BehaviorSubject, merge, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, skip } from 'rxjs/operators';
import { coerceArray, isFunction, isUndefined, toBoolean } from '../../internal/utils';
import { EntityParam } from '../entity-collection-plugin';
import { __globalState } from '../../internal/global-state';
import { Query } from '../../api/query';

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
  private head: StoreState | Partial<StoreState> | Entity;
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
      let watchProp = this.params.watchProperty;
      watchProp = coerceArray(watchProp);
      if ((watchProp as any).includes('entities') && !(watchProp as any).includes('ids') && query instanceof QueryEntity) {
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
    /** If we are watching specific props compare them, if not compare the entire store */
    const update = this.params.watchProperty ? this.compareProp(currentValue) : this._getHead() !== currentValue;
    if (update) {
      __globalState.setCustomAction({ type: `@DirtyCheck - Revert` });
      this.updateStore(currentValue, this._entityId);
      this._reset.next();
    }
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
    this.subscription = merge(...source)
      .pipe(skip(1))
      .subscribe((currentState: any) => {
        if (isUndefined(this.head)) return;
        /** __akitaKey is used to determine if we are tracking a specific property or a store change */
        const head = currentState.__akitaKey ? this.head[currentState.__akitaKey as any] : this.head;
        const compareTo = currentState.__akitaKey ? currentState.val : currentState;
        const isChange = this.params.comparator(head, compareTo);

        this.updateDirtiness(isChange);
      });
  }

  private updateDirtiness(isDirty: boolean) {
    this.dirty.next(isDirty);
  }

  private _getHead(): Partial<StoreState> | StoreState {
    let head: StoreState | Partial<StoreState> = this.getSource(this._entityId) as StoreState;
    if (this.params.watchProperty) {
      head = (this.params.watchProperty as (keyof StoreState)[]).reduce(
        (_head, prop) => {
          _head[prop] = (head as Partial<StoreState>)[prop];
          return _head;
        },
        {} as Partial<StoreState>
      );
    }
    return head;
  }

  private compareProp(currentState: Partial<StoreState>): boolean {
    const propKeys = Object.keys(currentState);
    const head = this._getHead();

    return propKeys.some(propKey => currentState[propKey] !== head[propKey]);
  }
}
