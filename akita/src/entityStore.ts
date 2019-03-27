import { isEmpty } from './isEmpty';
import { SetEntities, setEntities } from './setEntities';
import { Store } from './store';
import { Constructor, EntityState, EntityUICreateFn, ID, IDS, StateWithActive, UpdateEntityPredicate, UpdateStateCallback } from './types';
import { getActiveEntities, SetActiveOptions } from './getActiveEntities';
import { addEntities, AddEntitiesOptions } from './addEntities';
import { coerceArray } from './coerceArray';
import { removeEntities } from './removeEntities';
import { getInitialEntitiesState } from './getInitialEntitiesState';
import { isDefined } from './isDefined';
import { updateEntities } from './updateEntities';
import { transaction } from './transaction';
import { isNil } from './isNil';
import { isFunction } from './isFunction';
import { isUndefined } from './isUndefined';
import { StoreConfigOptions } from './storeConfig';
import { logAction, setAction } from './actions';
import { isDev } from './env';
import { hasEntity } from './hasEntity';
import { BehaviorSubject, Observable } from 'rxjs';
import { assertEntityIdKey } from './assertEntityIdKey';

/**
 *
 * Store for managing a collection of entities
 *
 * @example
 *
 * export interface WidgetsState extends EntityState<Widget> { }
 *
 * @StoreConfig({ name: 'widgets' })
 *  export class WidgetsStore extends EntityStore<WidgetsState, Widget> {
 *   constructor() {
 *     super();
 *   }
 * }
 *
 *
 */
export class EntityStore<S extends EntityState<E>, E, EntityID = ID> extends Store<S> {
  ui: EntityUIStore<any, any>;
  private updatedEntityIds = new BehaviorSubject<ID[]>([]);

  constructor(initialState: Partial<S> = {}, protected options: Partial<StoreConfigOptions> = {}) {
    super({ ...getInitialEntitiesState(), ...initialState }, options);
  }

  // @internal
  get updatedEntityIds$(): Observable<ID[]> {
    return this.updatedEntityIds.asObservable();
  }

  /**
   *
   * Replace current collection with provided collection
   *
   * @example
   *
   * this.store.set([Entity, Entity])
   * this.store.set({ids: [], entities: {}})
   * this.store.set({ 1: {}, 2: {}})
   *
   */
  set(entities: SetEntities<E>) {
    if (isNil(entities)) return;

    isDev() && assertEntityIdKey(entities[0], this.idKey) && setAction('Set Entity');

    const isNativePreAdd = this.akitaPreAddEntity === EntityStore.prototype.akitaPreAddEntity;
    this._setState(state =>
      setEntities({
        state,
        entities,
        idKey: this.idKey,
        preAddEntity: this.akitaPreAddEntity,
        isNativePreAdd
      })
    );

    this.updateCache();

    if (this.hasInitialUIState()) {
      this.handleUICreation();
    }
  }

  /**
   * Add entities
   *
   * @example
   *
   * this.store.add([Entity, Entity])
   * this.store.add(Entity)
   * this.store.add(Entity, { prepend: true })
   */
  add(entities: E[] | E, options?: AddEntitiesOptions) {
    const collection = coerceArray(entities);

    if (isEmpty(collection)) return;
    const currentIds = this.ids;
    const notExistEntities = collection.filter(entity => currentIds.includes(entity[this.idKey]) === false);
    if (isEmpty(notExistEntities)) return;

    isDev() && assertEntityIdKey(entities[0], this.idKey) && setAction('Add Entity');

    this._setState(state =>
      addEntities({
        state,
        preAddEntity: this.akitaPreAddEntity,
        entities: notExistEntities,
        idKey: this.idKey,
        options
      })
    );

    if (this.hasInitialUIState()) {
      this.handleUICreation(notExistEntities.map(entity => entity[this.idKey]));
    }
  }

  /**
   *
   * Update entities
   *
   * @example
   *
   * store.update(1, entity => ...)
   * store.update([1, 2, 3], entity => ...)
   * store.update(null, entity => ...)
   */
  update(id: IDS | null, newStateFn: UpdateStateCallback<E>);
  /**
   * store.update(1, { name: newName })
   */
  update(id: IDS | null, newState: Partial<E>);
  /**
   * store.update(entity => entity.price > 3, entity => ({ name: newName }))
   */
  update(predicate: UpdateEntityPredicate<E>, newStateFn: UpdateStateCallback<E>);
  /**
   * store.update(entity => entity.price > 3, { name: newName })
   */
  update(predicate: UpdateEntityPredicate<E>, newState: Partial<E>);
  /** Support non-entity updates */
  update(newState: UpdateStateCallback<S>);
  update(newState: Partial<S>);
  update(idsOrFnOrState: IDS | null | Partial<S> | UpdateStateCallback<S> | UpdateEntityPredicate<E>, newStateOrFn?: UpdateStateCallback<E> | Partial<E> | Partial<S>) {
    if (isUndefined(newStateOrFn)) {
      super.update(idsOrFnOrState as Partial<S>);
      return;
    }
    let ids: ID[] = [];

    if (isFunction(idsOrFnOrState)) {
      // We need to filter according the predicate function
      ids = this.ids.filter(id => (idsOrFnOrState as UpdateEntityPredicate<E>)(this.entities[id]));
    } else {
      // If it's nil we want all of them
      ids = isNil(idsOrFnOrState) ? this.ids : coerceArray(idsOrFnOrState);
    }

    if (isEmpty(ids)) return;

    isDev() && setAction('Update Entity', ids);
    this._setState(state =>
      updateEntities({
        idKey: this.idKey,
        ids,
        preUpdateEntity: this.akitaPreUpdateEntity,
        state,
        newStateOrFn
      })
    );

    this.updatedEntityIds.next(ids);
  }

  /**
   *
   * Create or update
   *
   * @example
   *
   * store.upsert(1, { active: true })
   * store.upsert([2, 3], { active: true })
   * store.upsert([2, 3], entity => ({ isOpen: !entity.isOpen}))
   *
   */
  @transaction()
  upsert(ids: IDS, newState: Partial<E> | E | UpdateStateCallback<E>, options: { baseClass?: Constructor } = {}) {
    const toArray = coerceArray(ids);
    const predicate = isUpdate => id => hasEntity(this.entities, id) === isUpdate;
    const isClassBased = isFunction(options.baseClass);
    const updateIds = toArray.filter(predicate(true));
    const newEntities = toArray.filter(predicate(false)).map(id => {
      let entity = isFunction(newState) ? newState({} as E) : newState;
      const withId = { ...(entity as E), [this.idKey]: id };
      if (isClassBased) {
        return new options.baseClass(withId);
      }
      return withId;
    });

    // it can be any of the three types
    this.update(updateIds as any, newState as any);
    this.add(newEntities);
    isDev() && logAction('Upsert Entity', ids);
  }

  /**
   *
   * Remove one or more entities
   *
   * @example
   *
   * this.store.remove(5)
   * this.store.remove([1,2,3])
   * this.store.remove()
   */
  remove(id?: ID | ID[]);
  /**
   * this.store.remove(entity => entity.id === 1)
   */
  remove(predicate: (entity: Readonly<E>) => boolean);
  remove(idsOrFn?: ID | ID[] | ((entity: Readonly<E>) => boolean)) {
    if (isEmpty(this.ids)) return;

    const idPassed = isDefined(idsOrFn);

    // null means remove all
    let ids: ID[] | null = [];

    if (isFunction(idsOrFn)) {
      ids = this.ids.filter(entityId => idsOrFn(this.entities[entityId]));
    } else {
      ids = idPassed ? coerceArray(idsOrFn) : null;
    }

    if (isEmpty(ids)) return;

    isDev() && setAction('Remove Entity', ids);
    this._setState((state: StateWithActive<S>) => removeEntities({ state, ids }));
    if (ids === null) {
      this.setHasCache(false);
    }

    this.handleUIRemove(ids);
  }

  /**
   *
   * Update the active entity
   *
   * @example
   *
   * this.store.updateActive({ completed: true })
   * this.store.updateActive(active => {
   *   return {
   *     config: {
   *      ..active.config,
   *      date
   *     }
   *   }
   * })
   */
  updateActive(newStateOrCallback: UpdateStateCallback<E> | Partial<E>) {
    const ids = coerceArray(this.active);
    isDev() && setAction('Update Active', ids);
    this.update(ids, newStateOrCallback as Partial<E>);
  }

  /**
   * Set the given entity as active
   *
   * @example
   *
   * store.setActive(1)
   * store.setActive([1, 2, 3])
   */
  setActive(idOrOptions: S['active'] extends any[] ? S['active'] : (SetActiveOptions | S['active']));
  setActive(idOrOptions: EntityID | SetActiveOptions | null) {
    const active = getActiveEntities(idOrOptions, this.ids, this.active);

    if (active === undefined) {
      return;
    }

    isDev() && setAction('Set Active', active);
    this._setActive(active);
  }

  /**
   * Add active entities
   *
   * @example
   *
   * store.addActive(2);
   * store.addActive([3, 4, 5]);
   */
  addActive<T = IDS>(ids: T) {
    const toArray = coerceArray(ids);
    if (isEmpty(toArray)) return;
    const everyExist = toArray.every(id => this.active.indexOf(id) > -1);
    if (everyExist) return;

    isDev() && setAction('Add Active', ids);
    this._setState(state => {
      /** Protect against case that one of the items in the array exist */
      const uniques = Array.from(new Set([...(state.active as EntityID[]), ...toArray]));
      return {
        ...state,
        active: uniques
      };
    });
  }

  /**
   * Remove active entities
   *
   * @example
   *
   * store.removeActive(2)
   * store.removeActive([3, 4, 5])
   */
  removeActive<T = IDS>(ids: T) {
    const toArray = coerceArray(ids);
    if (isEmpty(toArray)) return;
    const someExist = toArray.some(id => this.active.indexOf(id) > -1);
    if (!someExist) return;

    isDev() && setAction('Remove Active', ids);
    this._setState(state => {
      return {
        ...state,
        active: state.active.filter(currentId => toArray.indexOf(currentId) === -1)
      };
    });
  }

  /**
   * Toggle active entities
   *
   * @example
   *
   * store.toggle(2)
   * store.toggle([3, 4, 5])
   */
  @transaction()
  toggleActive<T = IDS>(ids: T) {
    const toArray = coerceArray(ids);
    const filterExists = remove => id => this.active.includes(id) === remove;
    const remove = toArray.filter(filterExists(true));
    const add = toArray.filter(filterExists(false));
    this.removeActive(remove);
    this.addActive(add);
    isDev() && logAction('Toggle Active');
  }

  /**
   *
   * Create sub UI store for managing Entity's UI state
   *
   * @example
   *
   * export type ProductUI = {
   *   isLoading: boolean;
   *   isOpen: boolean
   * }
   *
   * interface ProductsUIState extends EntityState<ProductUI> {}
   *
   * export class ProductsStore EntityStore<ProductsState, Product> {
   *   ui: EntityUIStore<ProductsUIState, ProductUI>;
   *
   *   constructor() {
   *     super();
   *     this.createUIStore();
   *   }
   *
   * }
   */
  createUIStore(initialState = {}, storeConfig: Partial<StoreConfigOptions> = {}) {
    const defaults: Partial<StoreConfigOptions> = { name: `UI/${this.storeName}` };
    this.ui = new EntityUIStore(initialState, { ...defaults, ...storeConfig });
    return this.ui;
  }

  // @internal
  destroy() {
    super.destroy();
    if (this.ui instanceof EntityStore) {
      this.ui.destroy();
    }
    this.updatedEntityIds.complete();
  }

  // @internal
  akitaPreUpdateEntity(_: Readonly<E>, nextEntity: Readonly<E>): E {
    return nextEntity;
  }

  // @internal
  akitaPreAddEntity(newEntity: Readonly<E>): E {
    return newEntity;
  }

  private get ids() {
    return this._value().ids;
  }

  private get entities() {
    return this._value().entities;
  }

  private get active() {
    return this._value().active;
  }

  private _setActive(ids: EntityID | EntityID[]) {
    this._setState(state => {
      return {
        ...state,
        active: ids
      };
    });
  }

  private updateCache() {
    this.setHasCache(true);
    const ttlConfig = this.options.cache && this.options.cache.ttl;
    if (ttlConfig) {
      if (this.cache.ttl !== null) {
        clearTimeout(this.cache.ttl);
      }
      this.cache.ttl = <any>setTimeout(() => this.setHasCache(false), ttlConfig);
    }
  }

  private handleUICreation(addedIds?: ID[]) {
    const ids = addedIds || this.ids;
    const isFunc = isFunction(this.ui._akitaCreateEntityFn);
    const uiEntities = ids.map(id => {
      const current = this.entities[id];
      const ui = isFunc ? this.ui._akitaCreateEntityFn(current) : this.ui._akitaCreateEntityFn;
      return {
        [this.idKey]: current[this.idKey],
        ...ui
      };
    });

    addedIds ? this.ui.add(uiEntities) : this.ui.set(uiEntities);
  }

  private hasInitialUIState() {
    return this.hasUIStore() && isUndefined(this.ui._akitaCreateEntityFn) === false;
  }

  private handleUIRemove(ids: ID[]) {
    if (this.hasUIStore()) {
      this.ui.remove(ids);
    }
  }

  private hasUIStore() {
    return this.ui instanceof EntityUIStore;
  }
}

// @internal
export class EntityUIStore<UIState, EntityUI> extends EntityStore<UIState, EntityUI> {
  _akitaCreateEntityFn: EntityUICreateFn;

  constructor(initialState = {}, storeConfig: Partial<StoreConfigOptions> = {}) {
    super(initialState, storeConfig);
  }

  /**
   *
   * Set the initial UI entity state. This function will determine the entity's
   * initial state when we call `set()` or `add()`.
   *
   * @example
   *
   * constructor() {
   *   super();
   *   this.createUIStore().setInitialEntityState(entity => ({ isLoading: false, isOpen: true }));
   *   this.createUIStore().setInitialEntityState({ isLoading: false, isOpen: true });
   * }
   *
   */
  setInitialEntityState<EntityUI = any, Entity = any>(createFn: EntityUICreateFn<EntityUI, Entity>) {
    this._akitaCreateEntityFn = createFn;
  }
}
