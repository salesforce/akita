import { EntityStore } from './entity-store';
import { ActiveState, EntityState, HashMap, ID } from './types';
import { combineLatest, Observable } from 'rxjs';
import { auditTime, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Query } from './query';
import { entityExists, isFunction, isUndefined, toBoolean } from '../internal/utils';
import { memoizeOne } from './memoize';
import { compareValues, Order } from '../internal/sort';
import { SortBy, SortByOptions } from './query-config';

export interface SelectOptions<E> extends SortByOptions<E> {
  asObject?: boolean;
  filterBy?: ((entity: E) => boolean) | undefined;
  limitTo?: number;
}

/**
 *  An abstraction for querying the entities from the store
 */
export class QueryEntity<S extends EntityState, E> extends Query<S> {
  protected store: EntityStore<S, E>;
  private memoized;

  /** Use only for internal plugins like Pagination - don't use this property **/
  __store__;

  constructor(store: EntityStore<S, E>) {
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
    const selectIds$ = this.select(state => state.ids);
    const selectEntities$ = this.select(state => state.entities);

    options.sortBy = options.sortBy || (this.config && (this.config.sortBy as SortBy<E>));
    options.sortByOrder = options.sortByOrder || (this.config && this.config.sortByOrder);

    return selectEntities$.pipe(
      withLatestFrom(selectIds$, (entities, ids: ID[]) => {
        if (options.asObject) {
          return toMap(ids, entities, options);
        } else {
          if (!options.filterBy) {
            if (!this.memoized) {
              this.memoized = memoizeOne(toArray);
            }
            return this.memoized(ids, entities, options);
          }

          return toArray(ids, entities, options);
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
  getAll(options: { asObject: true; filterBy?: SelectOptions<E>['filterBy']; limitTo?: number }): HashMap<E>;
  getAll(options: { filterBy: SelectOptions<E>['filterBy']; limitTo?: number }): E[];
  getAll(options: { asObject: true; limitTo?: number }): HashMap<E>;
  getAll(options: { limitTo?: number }): E[];
  getAll(options: { asObject: false; filterBy?: SelectOptions<E>['filterBy']; limitTo?: number }): E[];
  getAll(): E[];
  getAll(options: SelectOptions<E> = { asObject: false, filterBy: undefined, limitTo: undefined }): E[] | HashMap<E> {
    const ids = this.getSnapshot().ids;
    const entities = this.getSnapshot().entities;

    if (options.asObject) {
      return toMap(ids, entities, options, true);
    }

    return toArray(ids, entities, options);
  }

  /**
   * Select multiple entities from the store.
   *
   * @example
   * this.store.selectMany([1,2]);
   */
  selectMany(ids: ID[], options: { asObject: true }): Observable<HashMap<E>>;
  selectMany(ids: ID[], options: { asObject: true; filterUndefined: boolean }): Observable<HashMap<E>>;
  selectMany(ids: ID[], options: { filterUndefined: boolean }): Observable<E[]>;
  selectMany(ids: ID[]): Observable<E[]>;
  selectMany(ids: ID[], options: { asObject?: boolean; filterUndefined?: boolean } = {}): Observable<E[] | HashMap<E>> {
    const asObject = options.asObject || false;
    const filterUndefined = isUndefined(options.filterUndefined) ? true : options.filterUndefined;
    const entities = ids.map(id => this.selectEntity(id));

    return combineLatest(entities).pipe(
      map(entities => {
        if (asObject) {
          let toMap = {};
          const all = this.getSnapshot().entities;
          for (let i = 0, len = ids.length; i < len; i++) {
            const id = ids[i];
            if (!entityExists(id, all) && filterUndefined) {
              continue;
            }
            toMap[id] = entities[id];
          }
          return toMap;
        }

        return filterUndefined ? entities.filter(val => !isUndefined(val)) : entities;
      }),
      auditTime(0)
    );
  }

  /**
   * Select an entity or a slice of an entity.
   *
   * @example
   * this.pagesStore.selectEntity(1)
   * this.pagesStore.selectEntity(1, entity => entity.config.date)
   *
   */
  selectEntity<R>(id: ID): Observable<E>;
  selectEntity<R>(id: ID, project: (entity: E) => R): Observable<R>;
  selectEntity<R>(id: ID, project?: (entity: E) => R): Observable<R | E> {
    if (!project) {
      return this._byId(id);
    }

    return this.select(state => {
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
  getEntity(id: ID): E {
    return this.getSnapshot().entities[id];
  }

  /**
   * Select the active entity's id.
   */
  selectActiveId(): Observable<ID> {
    return this.select(state => (state as S & ActiveState).active);
  }

  /**
   * Get the active id
   */
  getActiveId(): ID {
    return (this.getSnapshot() as S & ActiveState).active;
  }

  /**
   * Select the active entity.
   */
  selectActive<R>(): Observable<E>;
  selectActive<R>(project: (entity: E) => R): Observable<R>;
  selectActive<R>(project?: (entity: E) => R): Observable<R | E> {
    return this.selectActiveId().pipe(switchMap(activeId => this.selectEntity(activeId, project)));
  }

  /**
   * Get the active entity.
   */
  getActive(): E {
    const activeId: ID = this.getActiveId();
    return toBoolean(activeId) ? this.getEntity(activeId) : undefined;
  }

  /**
   * Select the store's entity collection length.
   */
  selectCount(predicate?: (entity: E) => boolean): Observable<number> {
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
  getCount(predicate?: (entity: E) => boolean): number {
    if (isFunction(predicate)) {
      return this.getAll().filter(predicate).length;
    }
    return this.getSnapshot().ids.length;
  }

  /**
   * Select the store's loading state.
   */
  selectLoading() {
    return this.select(state => state.loading);
  }

  /**
   * Select the store's error state.
   */
  selectError() {
    return this.select(state => state.error);
  }

  /**
   * Returns whether entity exists.
   */
  hasEntity(id: ID): boolean;
  hasEntity(project: (entity: E) => boolean): boolean;
  hasEntity(projectOrId: any): boolean {
    if (isFunction(projectOrId)) {
      return this.getAll().some(projectOrId);
    }
    return projectOrId in this.store.entities;
  }

  isEmpty() {
    return this.getSnapshot().ids.length === 0;
  }

  private _byId(id: ID): Observable<E> {
    return this.select(state => this.getEntity(id));
  }

  ngOnDestroy() {
    this.memoized = null;
  }
}

function toArray<E>(ids: ID[], entities: HashMap<E>, options: SelectOptions<E>): E[] {
  const arr = [];
  const { filterBy, limitTo, sortBy, sortByOrder } = options;

  const length = Math.min(limitTo || ids.length, ids.length);

  for (let i = 0; i < length; i++) {
    const id = ids[i];

    if (!entityExists(id, entities)) {
      continue;
    }

    if (!filterBy) {
      arr.push(entities[id]);
      continue;
    }

    if (filterBy(entities[id])) {
      arr.push(entities[id]);
    }
  }

  if (sortBy) {
    let _sortBy = isFunction(sortBy) ? sortBy : compareValues(sortBy, sortByOrder);
    return arr.slice().sort(_sortBy);
  }

  return arr;
}

function toMap<E>(ids: ID[], entities: HashMap<E>, options: SelectOptions<E>, get = false): HashMap<E> {
  const map = {};
  const { filterBy, limitTo } = options;

  if (get && !filterBy && !limitTo) {
    return entities;
  }

  const length = Math.min(limitTo || ids.length, ids.length);

  for (let i = 0; i < length; i++) {
    const id = ids[i];

    if (!entityExists(id, entities)) {
      continue;
    }

    if (!filterBy) {
      map[id] = entities[id];
      continue;
    }

    if (toBoolean(filterBy(entities[id]))) {
      map[id] = entities[id];
    }
  }

  return map;
}
