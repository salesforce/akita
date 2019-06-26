import { combineLatest, Observable, of } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { isDefined } from './isDefined';
import { EntityStore } from './entityStore';
import { Query } from './query';
import { EntityState, HashMap, ID, ItemPredicate, OrArray, SelectOptions } from './types';
import { isFunction } from './isFunction';
import { toBoolean } from './toBoolean';
import { sortByOptions } from './sortByOptions';
import { entitiesToArray } from './entitiesToArray';
import { entitiesToMap } from './entitiesToMap';
import { SelectAllOptionsA, SelectAllOptionsB, SelectAllOptionsC, SelectAllOptionsD, SelectAllOptionsE } from './selectAllOverloads';
import { isArray } from './isArray';
import { isNil } from './isNil';
import { findEntityByPredicate, getEntity } from './getEntity';
import { EntityAction, EntityActions } from './entityActions';
import { isUndefined } from './isUndefined';
import { QueryConfigOptions } from './queryConfig';

/**
 *
 *  The Entity Query is similar to the general Query, with additional functionality tailored for EntityStores.
 *
 *  class WidgetsQuery extends QueryEntity<WidgetsState> {
 *     constructor(protected store: WidgetsStore) {
 *       super(store);
 *     }
 *  }
 *
 *
 *
 */
export class QueryEntity<S extends EntityState, DEPRECATED = any> extends Query<S> {
  ui: EntityUIQuery<any, DEPRECATED>;
  protected store: EntityStore<S>;

  // @internal
  __store__;

  constructor(store: EntityStore<S>, private options: QueryConfigOptions = {}) {
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
  selectAll(options: SelectAllOptionsA<S['entities'][0]>): Observable<HashMap<S['entities'][0]>>;
  selectAll(options: SelectAllOptionsB<S['entities'][0]>): Observable<S['entities'][0][]>;
  selectAll(options: SelectAllOptionsC<S['entities'][0]>): Observable<HashMap<S['entities'][0]>>;
  selectAll(options: SelectAllOptionsD<S['entities'][0]>): Observable<S['entities'][0][]>;
  selectAll(options: SelectAllOptionsE<S['entities'][0]>): Observable<S['entities'][0][]>;
  selectAll(): Observable<S['entities'][0][]>;
  selectAll(
    options: SelectOptions<S['entities'][0]> = {
      asObject: false
    }
  ): Observable<S['entities'][0][] | HashMap<S['entities'][0]>> {
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
  getAll(options: SelectAllOptionsA<S['entities'][0]>): HashMap<S['entities'][0]>;
  getAll(options: SelectAllOptionsB<S['entities'][0]>): S['entities'][0][];
  getAll(options: SelectAllOptionsC<S['entities'][0]>): HashMap<S['entities'][0]>;
  getAll(options: SelectAllOptionsD<S['entities'][0]>): S['entities'][0][];
  getAll(options: SelectAllOptionsE<S['entities'][0]>): S['entities'][0][];
  getAll(): S['entities'][0][];
  getAll(options: SelectOptions<S['entities'][0]> = { asObject: false, filterBy: undefined, limitTo: undefined }): S['entities'][0][] | HashMap<S['entities'][0]> {
    if(options.asObject) {
      return entitiesToMap(this.getValue(), options);
    }
    sortByOptions(options, this.config || this.options);

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
  selectMany<R>(ids: S['ids'][0][]): Observable<S['entities'][0][]>;
  selectMany<R>(ids: S['ids'][0][], project: (entity: S['entities'][0]) => R): Observable<R[]>;
  selectMany<R>(ids: S['ids'][0][], project?: (entity: S['entities'][0]) => R): Observable<S['entities'][0][] | R[]> {
    if(!ids || !ids.length) return of([]);

    const entities = ids.map(id => this.selectEntity(id, project));

    return combineLatest(entities).pipe(
      map(v => v.filter(Boolean)),
      auditTime(0)
    );
  }

  /**
   * Select an entity or a slice of an entity
   *
   * @example
   *
   * this.query.selectEntity(1)
   * this.query.selectEntity(1, entity => entity.config.date)
   * this.query.selectEntity(1, 'comments')
   * this.query.selectEntity(e => e.title === 'title')
   *
   */
  selectEntity<R>(id: S['ids'][0]): Observable<S['entities'][0]>;
  selectEntity<K extends keyof S['entities'][0]>(id: S['ids'][0], project?: K): Observable<S['entities'][0][K]>;
  selectEntity<R>(id: S['ids'][0], project: (entity: S['entities'][0]) => R): Observable<R>;
  selectEntity<R>(predicate: ItemPredicate<S['entities'][0]>): Observable<S['entities'][0]>;
  selectEntity<R>(idOrPredicate: S['ids'][0] | ItemPredicate<S['entities'][0]>, project?: ((entity: S['entities'][0]) => R) | keyof S['entities'][0]): Observable<R | S['entities'][0]> {
    let id = idOrPredicate;

    if(isFunction(idOrPredicate)) {
      // For performance reason we expect the entity to be in the store
      (id as any) = findEntityByPredicate(idOrPredicate, this.getValue().entities);
    }

    return this.select(state => state.entities).pipe(
      map(getEntity(id, project)),
      distinctUntilChanged()
    );
  }

  /**
   * Get an entity by id
   *
   * @example
   *
   * this.query.getEntity(1);
   */
  getEntity(id: S['ids'][0]): S['entities'][0] {
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
  selectActive<R>(): S['active'] extends any[] ? Observable<S['entities'][0][]> : Observable<S['entities'][0]>;
  selectActive<R>(project?: (entity: S['entities'][0]) => R): S['active'] extends any[] ? Observable<R[]> : Observable<R>;
  selectActive<R>(project?: (entity: S['entities'][0]) => R): Observable<R | S['entities'][0]> | Observable<S['entities'][0][] | R[]> {
    if(isArray(this.getActive())) {
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
  getActive(): S['active'] extends any[] ? S['entities'][0][] : S['entities'][0];
  getActive(): OrArray<S['entities'][0]> {
    const activeId = this.getActiveId();
    if(isArray(activeId)) {
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
  selectCount(predicate?: (entity: S['entities'][0], index: number) => boolean): Observable<number> {
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
  getCount(predicate?: (entity: S['entities'][0], index: number) => boolean): number {
    if(isFunction(predicate)) {
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
  selectLast<R>(): Observable<S['entities'][0]>;
  selectLast<R>(project: (entity: S['entities'][0]) => R): Observable<R>;
  selectLast<R>(project?: (entity: S['entities'][0]) => R): Observable<R | S['entities'][0]> {
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
  selectFirst<R>(): Observable<S['entities'][0]>;
  selectFirst<R>(project: (entity: S['entities'][0]) => R): Observable<R>;
  selectFirst<R>(project?: (entity: S['entities'][0]) => R): Observable<R | S['entities'][0]> {
    return this.selectAt(ids => ids[0], project);
  }

  /**
   *
   * Listen for entity actions
   *
   *  @example
   *
   *  this.query.selectEntityAction(EntityActions.Add);
   *  this.query.selectEntityAction(EntityActions.Update);
   *  this.query.selectEntityAction(EntityActions.Remove);
   *
   *  this.query.selectEntityAction();
   */
  selectEntityAction(action: EntityActions): Observable<ID[]>;
  selectEntityAction(): Observable<EntityAction>;
  selectEntityAction(action?: EntityActions): Observable<ID[] | EntityAction> {
    if(isUndefined(action)) {
      return this.store.selectEntityAction$;
    }
    return this.store.selectEntityAction$.pipe(
      filter(ac => ac.type === action),
      map(action => action.ids)
    );
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
  hasEntity(id: S['ids'][0]): boolean;
  hasEntity(id: S['ids'][0][]): boolean;
  hasEntity(project: (entity: S['entities'][0]) => boolean): boolean;
  hasEntity(): boolean;
  hasEntity(projectOrIds?: S['ids'][0] | S['ids'][0][] | ((entity: S['entities'][0]) => boolean)): boolean {
    if(isNil(projectOrIds)) {
      return this.getValue().ids.length > 0;
    }

    if(isFunction(projectOrIds)) {
      return this.getAll().some(projectOrIds);
    }

    if(isArray(projectOrIds)) {
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
  hasActive(id?: S['ids'][0]): boolean {
    const active = this.getValue().active;
    if(Array.isArray(active)) {
      if(isDefined(id)) {
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

  private selectAt<R>(mapFn: (ids: S['ids'][0][]) => S['ids'][0], project?: (entity: S['entities'[0]]) => R) {
    return this.select(state => state.ids as any[]).pipe(
      map(mapFn),
      distinctUntilChanged(),
      switchMap((id: S['ids'][0]) => this.selectEntity(id, project))
    );
  }
}

// @internal
export class EntityUIQuery<UIState, DEPRECATED = any> extends QueryEntity<UIState> {
  constructor(store) {
    super(store);
  }
}
