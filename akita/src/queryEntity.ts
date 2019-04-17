import { combineLatest, Observable, of } from 'rxjs';
import { auditTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { isDefined } from './isDefined';
import { EntityStore } from './entityStore';
import { Query } from './query';
import { EntityState, HashMap, ID, SelectOptions } from './types';
import { isFunction } from './isFunction';
import { toBoolean } from './toBoolean';
import { sortByOptions } from './sortByOptions';
import { entitiesToArray } from './entitiesToArray';
import { entitiesToMap } from './entitiesToMap';
import { SelectAllOptionsA, SelectAllOptionsB, SelectAllOptionsC, SelectAllOptionsD, SelectAllOptionsE } from './selectAllOverloads';
import { isArray } from './isArray';
import { isNil } from './isNil';
import { isString } from './isString';
import { isUndefined } from './isUndefined';

/**
 *
 *  The Entity Query is similar to the general Query, with additional functionality tailored for EntityStores.
 *
 *  class WidgetsQuery extends QueryEntity<WidgetsState, Widget> {
 *     constructor(protected store: WidgetsStore) {
 *       super(store);
 *     }
 *  }
 *
 *
 *
 */
export class QueryEntity<S extends EntityState, E, EntityID = ID> extends Query<S> {
  ui: EntityUIQuery<any, any>;
  protected store: EntityStore<S, E, EntityID>;

  // @internal
  __store__;

  constructor(store: EntityStore<S, E, EntityID>) {
    super(store);
    this.__store__ = store;
  }

  /**
   * Select the entire store's entity collection
   *
   * @example
   *
   * this.query.selectAll()
   *
   * this.query.selectAll({
   *   limitTo: 5
   *   filterBy: entity => entity.completed === true
   * })
   *
   * this.query.selectAll({
   *   asObject: true,
   *   limitTo: 3
   * })
   *
   *  this.query.selectAll({
   *   sortBy: 'price',
   *   sortByOrder: Order.DESC
   * })
   *
   */
  selectAll(options: SelectAllOptionsA<E>): Observable<HashMap<E>>;
  selectAll(options: SelectAllOptionsB<E>): Observable<E[]>;
  selectAll(options: SelectAllOptionsC<E>): Observable<HashMap<E>>;
  selectAll(options: SelectAllOptionsD<E>): Observable<E[]>;
  selectAll(options: SelectAllOptionsE<E>): Observable<E[]>;
  selectAll(): Observable<E[]>;
  selectAll(
    options: SelectOptions<E> = {
      asObject: false
    }
  ): Observable<E[] | HashMap<E>> {
    return this.select(state => state.entities).pipe(map(() => this.getAll(options)));
  }

  /**
   * Get the entire store's entity collection
   *
   * @example
   *
   * this.query.getAll()
   *
   * this.query.getAll({
   *   limitTo: 5
   *   filterBy: entity => entity.completed === true
   * })
   *
   * this.query.getAll({
   *   asObject: true,
   *   limitTo: 3
   * })
   *
   *  this.query.getAll({
   *   sortBy: 'price',
   *   sortByOrder: Order.DESC
   * })
   */
  getAll(options: SelectAllOptionsA<E>): HashMap<E>;
  getAll(options: SelectAllOptionsB<E>): E[];
  getAll(options: SelectAllOptionsC<E>): HashMap<E>;
  getAll(options: SelectAllOptionsD<E>): E[];
  getAll(options: SelectAllOptionsE<E>): E[];
  getAll(): E[];
  getAll(options: SelectOptions<E> = { asObject: false, filterBy: undefined, limitTo: undefined }): E[] | HashMap<E> {
    if (options.asObject) {
      return entitiesToMap(this.getValue(), options);
    }
    sortByOptions(options, this.config);

    return entitiesToArray(this.getValue(), options);
  }

  /**
   * Select multiple entities from the store
   *
   * @example
   *
   * this.query.selectMany([1,2])
   * this.query.selectMany([1,2], entity => entity.title)
   */
  selectMany<R>(ids: EntityID[]): Observable<E[]>;
  selectMany<R>(ids: EntityID[], project: (entity: E) => R): Observable<R[]>;
  selectMany<R>(ids: EntityID[], project?: (entity: E) => R): Observable<E[] | R[]> {
    if (!ids || !ids.length) return of([]);

    const entities = ids.map(id => this.selectEntity(id, project));

    return combineLatest(entities).pipe(map(v => v.filter(Boolean)), auditTime(0));
  }

  /**
   * Select an entity or a slice of an entity
   *
   * @example
   *
   * this.query.selectEntity(1)
   * this.query.selectEntity(1, entity => entity.config.date)
   * this.query.selectEntity(1, 'comments')
   *
   */
  selectEntity<R>(id: EntityID): Observable<E>;
  selectEntity<K extends keyof E>(id: EntityID, project?: K): Observable<E[K]>;
  selectEntity<R>(id: EntityID, project: (entity: E) => R): Observable<R>;
  selectEntity<R>(id: EntityID, project?: ((entity: E) => R) | keyof E): Observable<R | E> {
    return this.select(() => {
      const entity = this.getEntity(id);

      if (isUndefined(entity)) {
        return undefined;
      }

      if (!project) {
        return entity;
      }

      if (isString(project)) {
        return entity[project as string];
      }

      return (project as Function)(entity);
    });
  }

  /**
   * Get an entity by id
   *
   * @example
   *
   * this.query.getEntity(1);
   */
  getEntity(id: EntityID): E {
    return this.getValue().entities[id as any];
  }

  /**
   * Select the active entity's id
   *
   * @example
   *
   * this.query.selectActiveId()
   */
  selectActiveId(): Observable<S['active']> {
    return this.select(state => (state as S & { active: S['active'] }).active);
  }

  /**
   * Get the active id
   *
   * @example
   *
   * this.query.getActiveId()
   */
  getActiveId(): S['active'] {
    return this.getValue().active;
  }

  /**
   * Select the active entity
   *
   * @example
   *
   * this.query.selectActive()
   * this.query.selectActive(entity => entity.title)
   */
  selectActive<R>(): S['active'] extends any[] ? Observable<E[]> : Observable<E>;
  selectActive<R>(project?: (entity: E) => R): S['active'] extends any[] ? Observable<R[]> : Observable<R>;
  selectActive<R>(project?: (entity: E) => R): Observable<R | E> | Observable<E[] | R[]> {
    if (isArray(this.getActive())) {
      return this.selectActiveId().pipe(switchMap(ids => this.selectMany(ids, project)));
    }
    return this.selectActiveId().pipe(switchMap(ids => this.selectEntity(ids, project)));
  }

  /**
   * Get the active entity
   *
   * @example
   *
   * this.query.getActive()
   */
  getActive(): S['active'] extends any[] ? E[] : E;
  getActive(): E[] | E {
    const activeId = this.getActiveId();
    if (isArray(activeId)) {
      return activeId.map(id => this.getValue().entities[id as any]);
    }
    return toBoolean(activeId) ? this.getEntity(activeId) : undefined;
  }

  /**
   * Select the store's entity collection length
   *
   * @example
   *
   * this.query.selectCount()
   * this.query.selectCount(entity => entity.completed)
   */
  selectCount(predicate?: (entity: E, index: number) => boolean): Observable<number> {
    return this.select(state => state.entities).pipe(map(() => this.getCount(predicate)));
  }

  /**
   * Get the store's entity collection length
   *
   * @example
   *
   * this.query.getCount()
   * this.query.getCount(entity => entity.completed)
   */
  getCount(predicate?: (entity: E, index: number) => boolean): number {
    if (isFunction(predicate)) {
      return this.getAll().filter(predicate).length;
    }
    return this.getValue().ids.length;
  }

  /**
   *
   * Select the last entity from the store
   *
   * @example
   *
   * this.query.selectLast()
   * this.query.selectLast(todo => todo.title)
   */
  selectLast<R>(): Observable<E>;
  selectLast<R>(project: (entity: E) => R): Observable<R>;
  selectLast<R>(project?: (entity: E) => R): Observable<R | E> {
    return this.selectAt(ids => ids[ids.length - 1], project);
  }

  /**
   *
   * Select the first entity from the store
   *
   * @example
   *
   * this.query.selectFirst()
   * this.query.selectFirst(todo => todo.title)
   */
  selectFirst<R>(): Observable<E>;
  selectFirst<R>(project: (entity: E) => R): Observable<R>;
  selectFirst<R>(project?: (entity: E) => R): Observable<R | E> {
    return this.selectAt(ids => ids[0], project);
  }

  /**
   *
   * Select the updated entities ids
   *
   *  @example
   *
   *  this.query.selectUpdatedEntityIds()
   *
   */
  selectUpdatedEntityIds() {
    return this.store.updatedEntityIds$;
  }

  /**
   * Returns whether entity exists
   *
   * @example
   *
   * this.query.hasEntity(2)
   * this.query.hasEntity(entity => entity.completed)
   * this.query.hasEntity([1, 2, 33])
   *
   */
  hasEntity(id: EntityID): boolean;
  hasEntity(id: EntityID[]): boolean;
  hasEntity(project: (entity: E) => boolean): boolean;
  hasEntity(): boolean;
  hasEntity(projectOrIds?: EntityID | EntityID[] | ((entity: E) => boolean)): boolean {
    if (isNil(projectOrIds)) {
      return this.getValue().ids.length > 0;
    }

    if (isFunction(projectOrIds)) {
      return this.getAll().some(projectOrIds);
    }

    if (isArray(projectOrIds)) {
      return projectOrIds.every(id => (id as any) in this.getValue().entities);
    }

    return (projectOrIds as any) in this.getValue().entities;
  }

  /**
   * Returns whether entity store has an active entity
   *
   * @example
   *
   * this.query.hasActive()
   * this.query.hasActive(3)
   *
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

  /**
   *
   * Create sub UI query for querying Entity's UI state
   *
   * @example
   *
   *
   * export class ProductsQuery extends QueryEntity<ProductsState, Product> {
   *   ui: EntityUIQuery<ProductsUIState, ProductUI>;
   *
   *   constructor(protected store: ProductsStore) {
   *     super(store);
   *     this.createUIQuery();
   *   }
   *
   * }
   */
  createUIQuery() {
    this.ui = new EntityUIQuery(this.__store__.ui);
  }

  private selectAt<R>(mapFn: (ids: EntityID[]) => EntityID, project?: (entity: E) => R) {
    return this.select(state => state.ids as any[]).pipe(
      map(mapFn),
      distinctUntilChanged(),
      switchMap((id: EntityID) => this.selectEntity(id, project))
    );
  }
}

// @internal
export class EntityUIQuery<UIState, EntityUI> extends QueryEntity<UIState, EntityUI> {
  constructor(store) {
    super(store);
  }
}
