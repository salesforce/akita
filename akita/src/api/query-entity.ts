import { combineLatest, Observable, of } from 'rxjs';
import { auditTime, map, switchMap, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';
import { compareValues, Order } from '../internal/sort';
import { entityExists, isDefined, isFunction, isUndefined, toBoolean } from '../internal/utils';
import { EntityStore } from './entity-store';
import { memoizeOne } from './memoize';
import { Query } from './query';
import { SortBy, SortByOptions } from './query-config';
import { EntityState, HashMap, ID } from './types';

export interface SelectOptions<E> extends SortByOptions<E> {
  asObject?: boolean;
  filterBy?: ((entity: E, index?: number) => boolean) | ((entity: E, index?: number) => boolean)[] | undefined;
  limitTo?: number;
}

/**
 *  An abstraction for querying the entities from the store
 */
export class QueryEntity<S extends EntityState, E, EntityID = ID> extends Query<S> {
  protected store: EntityStore<S, E, EntityID>;
  private memoized;

  /** Use only for internal plugins like Pagination - don't use this property **/
  __store__;

  constructor(store: EntityStore<S, E, EntityID>) {
    super(store);
    this.__store__ = store;
  }

  /**
   * Select the entire store's entity collection.
   *
   * @example
   * this.store.selectAll();
   */
  selectAll(options: { asObject: true; filterBy?: SelectOptions<E>['filterBy']; limitTo?: number; sortBy?: undefined; sortByOrder?: undefined }): Observable<HashMap<E>>;
  selectAll(options: { filterBy: SelectOptions<E>['filterBy']; limitTo?: number; sortBy?: SortBy<E>; sortByOrder?: Order }): Observable<E[]>;
  selectAll(options: { asObject: true; limitTo?: number; sortBy?: undefined; sortByOrder?: undefined }): Observable<HashMap<E>>;
  selectAll(options: { limitTo?: number; sortBy?: SortBy<E>; sortByOrder?: Order }): Observable<E[]>;
  selectAll(options: { asObject: false; filterBy?: SelectOptions<E>['filterBy']; limitTo?: number; sortBy?: SortBy<E>; sortByOrder?: Order }): Observable<E[]>;
  selectAll(): Observable<E[]>;
  selectAll(
    options: SelectOptions<E> = {
      asObject: false
    }
  ): Observable<E[] | HashMap<E>> {
    const selectState$ = this.select(state => state);
    const selectEntities$ = this.select(state => state.entities);

    this.sortByOptions(options);

    return selectEntities$.pipe(
      withLatestFrom(selectState$, (entities: HashMap<E>, state: S) => {
        const { ids } = state;
        if (options.asObject) {
          return toMap(ids, entities, options);
        } else {
          if (!options.filterBy && !options.sortBy) {
            if (!this.memoized) {
              this.memoized = memoizeOne(toArray);
            }
            return this.memoized(state, options);
          }

          return toArray(state, options);
        }
      })
    );
  }

  /**
   * Get the entire store's entity collection.
   *
   * @example
   * this.store.getAll();
   */
  getAll(options: { asObject: true; filterBy?: SelectOptions<E>['filterBy']; limitTo?: number; sortBy?: undefined; sortByOrder?: undefined }): HashMap<E>;
  getAll(options: { filterBy: SelectOptions<E>['filterBy']; limitTo?: number; sortBy?: SortBy<E>; sortByOrder?: Order }): E[];
  getAll(options: { asObject: true; limitTo?: number; sortBy?: undefined; sortByOrder?: undefined }): HashMap<E>;
  getAll(options: { limitTo?: number; sortBy?: SortBy<E>; sortByOrder?: Order }): E[];
  getAll(options: { asObject: false; filterBy?: SelectOptions<E>['filterBy']; limitTo?: number; sortBy?: SortBy<E>; sortByOrder?: Order }): E[];
  getAll(): E[];
  getAll(options: SelectOptions<E> = { asObject: false, filterBy: undefined, limitTo: undefined }): E[] | HashMap<E> {
    const state = this.getValue();

    if (options.asObject) {
      return toMap(state.ids, state.entities, options, true);
    }

    this.sortByOptions(options);

    return toArray(state, options);
  }

  /**
   * Select multiple entities from the store.
   *
   * @example
   * this.store.selectMany([1,2]);
   * this.store.selectMany([1,2], entity => entity.title);
   */
  selectMany<R>(ids: EntityID[]): Observable<E[]>;
  selectMany<R>(ids: EntityID[], project: (entity: E) => R): Observable<R[]>;
  selectMany<R>(ids: EntityID[], project?: (entity: E) => R): Observable<E[] | R[]> {
    if (!ids || !ids.length) return of([]);

    const entities = ids.map(id => this.selectEntity(id, project));

    return combineLatest(entities).pipe(auditTime(0));
  }

  /**
   * Select an entity or a slice of an entity.
   *
   * @example
   * this.pagesStore.selectEntity(1)
   * this.pagesStore.selectEntity(1, entity => entity.config.date)
   *
   */
  selectEntity<R>(id: EntityID): Observable<E>;
  selectEntity<R>(id: EntityID, project: (entity: E) => R): Observable<R>;
  selectEntity<R>(id: EntityID, project?: (entity: E) => R): Observable<R | E> {
    if (!project) {
      return this._byId(id);
    }

    return this.select(() => {
      if (this.hasEntity(id)) {
        return project(this.getEntity(id));
      }

      return undefined;
    });
  }

  /**
   * Get an entity by id
   *
   * @example
   * this.store.getEntity(1);
   */
  getEntity(id: EntityID): E {
    return this.getValue().entities[id as any];
  }

  /**
   * Select the active entity's id.
   */
  selectActiveId(): Observable<S['active']> {
    return this.select(state => (state as S & { active: S['active'] }).active);
  }

  /**
   * Get the active id
   */
  getActiveId(): S['active'] {
    return this.getValue().active;
  }

  /**
   * Select the active entity.
   */
  selectActive<R>(): S['active'] extends any[] ? Observable<E[]> : Observable<E>;
  selectActive<R>(project?: (entity: E) => R): S['active'] extends any[] ? Observable<R[]> : Observable<R>;
  selectActive<R>(project?: (entity: E) => R): Observable<R | E> | Observable<E[] | R[]> {
    if (Array.isArray(this.getActive())) {
      return this.selectActiveId().pipe(switchMap(ids => this.selectMany(ids, project)));
    }
    return this.selectActiveId().pipe(switchMap(ids => this.selectEntity(ids, project)));
  }

  /**
   * Get the active entity.
   */
  getActive(): S['active'] extends any[] ? E[] : E;
  getActive(): E[] | E {
    const activeId = this.getActiveId();
    if (Array.isArray(activeId)) {
      return activeId.map(id => this.getValue().entities[id]);
    }
    return toBoolean(activeId) ? this.getEntity(activeId) : undefined;
  }

  /**
   * Select the store's entity collection length.
   */
  selectCount(predicate?: (entity: E, index: number) => boolean): Observable<number> {
    if (isFunction(predicate)) {
      return this.selectAll({
        filterBy: predicate
      }).pipe(map(entities => entities.length));
    }

    return this.select(store => store.ids.length);
  }

  /**
   * Get the store's entity collection length.
   */
  getCount(predicate?: (entity: E, index: number) => boolean): number {
    if (isFunction(predicate)) {
      return this.getAll().filter(predicate).length;
    }
    return this.getValue().ids.length;
  }

  selectLast<R>(): Observable<E>;
  selectLast<R>(project: (entity: E) => R): Observable<R>;
  selectLast<R>(project?: (entity: E) => R): Observable<R | E> {
    return this.selectAt(ids => ids[ids.length - 1], project);
  }

  selectFirst<R>(): Observable<E>;
  selectFirst<R>(project: (entity: E) => R): Observable<R>;
  selectFirst<R>(project?: (entity: E) => R): Observable<R | E> {
    return this.selectAt(ids => ids[0], project);
  }

  selectAt<R>(mapFn: (ids: EntityID[]) => EntityID, project?: (entity: E) => R) {
    return this.select(state => state.ids as any[]).pipe(
      map(mapFn),
      distinctUntilChanged(),
      switchMap((id: EntityID) => this.selectEntity(id, project))
    );
  }

  /**
   * Returns whether entity exists.
   */
  hasEntity(id: EntityID): boolean;
  hasEntity(id: EntityID[]): boolean;
  hasEntity(project: (entity: E) => boolean): boolean;
  hasEntity(projectOrIds: EntityID | EntityID[] | ((entity: E) => boolean)): boolean {
    if (isFunction(projectOrIds)) {
      return this.getAll().some(projectOrIds);
    }

    if (Array.isArray(projectOrIds)) {
      return projectOrIds.every(id => (id as any) in this.store.entities);
    }

    return (projectOrIds as any) in this.store.entities;
  }

  /**
   * Returns whether entity store has an active entity.
   */
  hasActive(id?: EntityID): boolean {
    const active = this.getValue().active;
    if (Array.isArray(active)) {
      if (isDefined(id)) {
        return active.includes(id);
      }
      return active.length > 0;
    }
    return isDefined(active);
  }

  isEmpty() {
    return this.getValue().ids.length === 0;
  }

  private _byId(id: EntityID): Observable<E> {
    return this.select(state => this.getEntity(id));
  }

  private sortByOptions(options) {
    options.sortBy = options.sortBy || (this.config && (this.config.sortBy as SortBy<E>));
    options.sortByOrder = options.sortByOrder || (this.config && this.config.sortByOrder);
  }

  ngOnDestroy() {
    this.memoized = null;
  }
}

function toArray<E, S extends EntityState>(state: S, options: SelectOptions<E>): E[] {
  let arr = [];
  const { ids, entities } = state;
  const { filterBy, limitTo, sortBy, sortByOrder } = options;

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    if (!entityExists(id, entities)) {
      continue;
    }

    if (!filterBy) {
      arr.push(entities[id]);
      continue;
    }

    if (Array.isArray(filterBy)) {
      const allPass = filterBy.every(fn => fn(entities[id], i));
      if (allPass) {
        arr.push(entities[id]);
      }
    } else {
      if (filterBy(entities[id], i)) {
        arr.push(entities[id]);
      }
    }
  }

  if (sortBy) {
    let _sortBy: any = isFunction(sortBy) ? sortBy : compareValues(sortBy, sortByOrder);
    arr = arr.sort((a, b) => _sortBy(a, b, state));
  }
  const length = Math.min(limitTo || arr.length, arr.length);

  return length === arr.length ? arr : arr.slice(0, length);
}

function toMap<E>(ids: any[], entities: HashMap<E>, options: SelectOptions<E>, get = false): HashMap<E> {
  const map = {};
  const { filterBy, limitTo } = options;

  if (get && !filterBy && !limitTo) {
    return entities;
  }

  const length = Math.min(limitTo || ids.length, ids.length);

  if (filterBy && isUndefined(limitTo) === false) {
    let count = 0;
    for (let i = 0, length = ids.length; i < length; i++) {
      if (count === limitTo) break;
      const id = ids[i];
      if (!entityExists(id, entities)) {
        continue;
      }
      if (Array.isArray(filterBy)) {
        const allPass = filterBy.every(fn => fn(entities[id], i));
        if (allPass) {
          map[id] = entities[id];
          count++;
        }
      } else {
        if (filterBy(entities[id], i)) {
          map[id] = entities[id];
          count++;
        }
      }
    }
  } else {
    for (let i = 0; i < length; i++) {
      const id = ids[i];

      if (!entityExists(id, entities)) {
        continue;
      }

      if (!filterBy) {
        map[id] = entities[id];
        continue;
      }

      if (Array.isArray(filterBy)) {
        const allPass = filterBy.every(fn => fn(entities[id], i));
        if (allPass) {
          map[id] = entities[id];
        }
      } else {
        if (filterBy(entities[id], i)) {
          map[id] = entities[id];
        }
      }
    }
  }

  return map;
}
