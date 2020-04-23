// TODO fix
/* eslint-disable max-classes-per-file */
import { Observable, Subject } from 'rxjs';
import { logAction, setAction } from './actions';
import { addEntities, AddEntitiesOptions } from './addEntities';
import { coerceArray } from './coerceArray';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { EntityAction, EntityActions } from './entityActions';
import { isDev } from './env';
import { getActiveEntities, SetActiveOptions } from './getActiveEntities';
import { getInitialEntitiesState } from './getInitialEntitiesState';
import { hasEntity } from './hasEntity';
import { isDefined } from './isDefined';
import { isEmpty } from './isEmpty';
import { isFunction } from './isFunction';
import { isNil } from './isNil';
import { isUndefined } from './isUndefined';
import { removeEntities } from './removeEntities';
import { SetEntities, setEntities } from './setEntities';
import { Store } from './store';
import { StoreConfigOptions } from './storeConfig';
import { transaction } from './transaction';
import { Constructor, EntityState, EntityUICreateFn, getEntityType, getIDType, HashMap, IDS, OrArray, StateWithActive, UpdateEntityPredicate, UpdateStateCallback } from './types';
import { updateEntities } from './updateEntities';

/**
 *
 * Store for managing a collection of entities
 *
 * @example
 *
 * export interface WidgetsState extends EntityState<Widget> { }
 *
 * @StoreConfig({ name: 'widgets' })
 *  export class WidgetsStore extends EntityStore<WidgetsState> {
 *   constructor() {
 *     super();
 *   }
 * }
 *
 *
 */
export class EntityStore<S extends EntityState = any, EntityType = getEntityType<S>, IDType = getIDType<S>> extends Store<S> {
  ui: EntityUIStore<any, EntityType>;

  private readonly entityActions = new Subject<EntityAction<IDType>>();

  constructor(initialState: Partial<S> = {}, protected options: Partial<StoreConfigOptions> = {}) {
    super({ ...getInitialEntitiesState(), ...initialState }, options);
  }

  /** @internal */
  get selectEntityAction$(): Observable<EntityAction<IDType>> {
    return this.entityActions.asObservable();
  }

  /** @internal */
  get idKey(): string {
    return this.config.idKey || this.options.idKey || DEFAULT_ID_KEY;
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
  set(entities: SetEntities<EntityType>, options: { activeId?: IDType | null } = {}): void {
    if (isNil(entities)) return;

    if (isDev()) setAction('Set Entity');

    const isNativePreAdd = this.akitaPreAddEntity === EntityStore.prototype.akitaPreAddEntity;

    this._setState((state) => {
      const newState = setEntities({
        state,
        entities,
        idKey: this.idKey,
        preAddEntity: this.akitaPreAddEntity.bind(this),
        isNativePreAdd,
      });

      if (isUndefined(options.activeId) === false) {
        (newState as any).active = options.activeId;
      }

      return newState;
    });

    this.setHasCache(true, { restartTTL: true });

    if (this.hasInitialUIState()) {
      this.handleUICreation();
    }

    this.entityActions.next({ type: EntityActions.Set, ids: this.ids });
  }

  /**
   * Add entities
   *
   * @example
   *
   * this.store.add([Entity, Entity])
   * this.store.add(Entity)
   * this.store.add(Entity, { prepend: true })
   *
   * this.store.add(Entity, { loading: false })
   */
  add(entities: OrArray<EntityType>, options: AddEntitiesOptions = { loading: false }): void {
    const collection = coerceArray(entities);

    if (isEmpty(collection)) return;

    const data = addEntities({
      state: this._value(),
      preAddEntity: this.akitaPreAddEntity.bind(this),
      entities: collection,
      idKey: this.idKey,
      options,
    });

    if (data) {
      if (isDev()) setAction('Add Entity');
      data.newState.loading = options.loading;

      this._setState(() => data.newState);

      if (this.hasInitialUIState()) {
        this.handleUICreation(true);
      }

      this.entityActions.next({ type: EntityActions.Add, ids: data.newIds });
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
  update(id: OrArray<IDType> | null, newStateFn: UpdateStateCallback<EntityType>);

  /**
   * store.update(1, { name: newName })
   */
  update(id: OrArray<IDType> | null, newState: Partial<EntityType>);

  /**
   * store.update(entity => entity.price > 3, entity => ({ name: newName }))
   */
  update(predicate: UpdateEntityPredicate<EntityType>, newStateFn: UpdateStateCallback<EntityType>);

  /**
   * store.update(entity => entity.price > 3, { name: newName })
   */
  update(predicate: UpdateEntityPredicate<EntityType>, newState: Partial<EntityType>);

  /** Support non-entity updates */
  update(newState: UpdateStateCallback<S>);

  update(newState: Partial<S>);

  update(
    idsOrFnOrState: OrArray<IDType> | null | Partial<S> | UpdateStateCallback<S> | UpdateEntityPredicate<EntityType>,
    newStateOrFn?: UpdateStateCallback<EntityType> | Partial<EntityType> | Partial<S>
  ): any {
    if (isUndefined(newStateOrFn)) {
      super.update(idsOrFnOrState as Partial<S>);
      return;
    }
    let ids: IDType[] = [];

    if (isFunction(idsOrFnOrState)) {
      // We need to filter according the predicate function
      ids = this.ids.filter((id) => (idsOrFnOrState as UpdateEntityPredicate<EntityType>)(this.entities[id]));
    } else {
      // If it's nil we want all of them
      ids = isNil(idsOrFnOrState) ? this.ids : coerceArray(idsOrFnOrState as OrArray<IDType>);
    }

    if (isEmpty(ids)) return;

    if (isDev()) setAction('Update Entity', ids);
    this._setState((state) =>
      updateEntities({
        idKey: this.idKey,
        ids,
        preUpdateEntity: this.akitaPreUpdateEntity.bind(this),
        state,
        newStateOrFn,
        producerFn: this._producerFn,
      })
    );

    this.entityActions.next({ type: EntityActions.Update, ids });
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
  upsert(ids: OrArray<IDType>, newState: Partial<EntityType> | EntityType | UpdateStateCallback<EntityType> | EntityType[], options: { baseClass?: Constructor } = {}): void {
    const toArray = coerceArray(ids);
    const predicate = (isUpdate) => (id): any => hasEntity(this.entities, id) === isUpdate;
    const isClassBased = isFunction(options.baseClass);
    const updateIds = toArray.filter(predicate(true));
    const newEntities = toArray.filter(predicate(false)).map((id) => {
      const entity = isFunction(newState) ? newState({} as EntityType) : newState;
      const withId = { ...(entity as EntityType), [this.idKey]: id };
      if (isClassBased) {
        // TODO @deprecate baseClass and add a new BaseClass
        // eslint-disable-next-line new-cap
        return new options.baseClass(withId);
      }
      return withId;
    });

    // it can be any of the three types
    this.update(updateIds as any, newState as any);
    this.add(newEntities);
    if (isDev()) logAction('Upsert Entity');
  }

  /**
   *
   * Upsert entity collection (idKey must be present)
   *
   * @example
   *
   * store.upsertMany([ { id: 1 }, { id: 2 }]);
   *
   * store.upsertMany([ { id: 1 }, { id: 2 }], { loading: true  });
   * store.upsertMany([ { id: 1 }, { id: 2 }], { baseClass: Todo  });
   *
   */
  upsertMany(entities: EntityType[], options: { baseClass?: Constructor; loading?: boolean } = {}): void {
    const addedIds = [];
    const updatedIds = [];
    const updatedEntities = {};

    // Update the state directly to optimize performance
    // eslint-disable-next-line no-restricted-syntax
    for (const entity of entities) {
      const withPreCheckHook = this.akitaPreCheckEntity(entity);
      const id = withPreCheckHook[this.idKey];
      if (hasEntity(this.entities, id)) {
        const prev = this._value().entities[id];
        const merged = { ...this._value().entities[id], ...withPreCheckHook };
        // TODO @deprecate baseClass and add a new BaseClass
        // eslint-disable-next-line new-cap
        const next = options.baseClass ? new options.baseClass(merged) : merged;
        const withHook = this.akitaPreUpdateEntity(prev, next);
        const nextId = withHook[this.idKey];
        updatedEntities[nextId] = withHook;
        updatedIds.push(nextId);
      } else {
        // TODO @deprecate baseClass and add a new BaseClass
        // eslint-disable-next-line new-cap
        const newEntity = options.baseClass ? new options.baseClass(withPreCheckHook) : withPreCheckHook;
        const withHook = this.akitaPreAddEntity(newEntity);
        const nextId = withHook[this.idKey];
        addedIds.push(nextId);
        updatedEntities[nextId] = withHook;
      }
    }

    if (isDev()) logAction('Upsert Many');

    this._setState((state) => ({
      ...state,
      ids: addedIds.length ? [...state.ids, ...addedIds] : state.ids,
      entities: {
        ...state.entities,
        ...updatedEntities,
      },
      loading: !!options.loading,
    }));

    if (updatedIds.length) this.entityActions.next({ type: EntityActions.Update, ids: updatedIds });
    if (addedIds.length) this.entityActions.next({ type: EntityActions.Add, ids: addedIds });
    if (addedIds.length && this.hasUIStore()) {
      this.handleUICreation(true);
    }
  }

  /**
   *
   * Replace one or more entities (except the id property)
   *
   *
   * @example
   *
   * this.store.replace(5, newEntity)
   * this.store.replace([1,2,3], newEntity)
   */
  replace(ids: IDS, newState: Partial<EntityType>): void {
    const toArray = coerceArray(ids);
    if (isEmpty(toArray)) return;
    const replaced = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const id of toArray) {
      // !WARN fixing this is a breaking change as users might rely on this side effect
      // eslint-disable-next-line no-param-reassign
      newState[this.idKey] = id;
      replaced[id] = newState;
    }
    if (isDev()) setAction('Replace Entity', ids);
    this._setState((state) => ({
      ...state,
      entities: {
        ...state.entities,
        ...replaced,
      },
    }));
  }

  /**
   *
   * Move entity inside the collection
   *
   *
   * @example
   *
   * this.store.move(fromIndex, toIndex)
   */
  move(from: number, to: number): void {
    const ids = this.ids.slice();
    ids.splice(to < 0 ? ids.length + to : to, 0, ids.splice(from, 1)[0]);

    if (isDev()) setAction('Move Entity');
    this._setState((state) => ({
      ...state,
      // Change the entities reference so that selectAll emit
      entities: {
        ...state.entities,
      },
      ids,
    }));
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
  remove(id?: OrArray<IDType>);

  /**
   * this.store.remove(entity => entity.id === 1)
   */
  remove(predicate: (entity: Readonly<EntityType>) => boolean);

  remove(idsOrFn?: OrArray<IDType> | ((entity: Readonly<EntityType>) => boolean)): void {
    if (isEmpty(this.ids)) return;

    const idPassed = isDefined(idsOrFn);

    // null means remove all
    let ids: IDType[] | null = [];

    if (isFunction(idsOrFn)) {
      ids = this.ids.filter((entityId) => idsOrFn(this.entities[entityId]));
    } else {
      ids = idPassed ? coerceArray(idsOrFn) : null;
    }

    if (isEmpty(ids)) return;

    if (isDev()) setAction('Remove Entity', ids);
    this._setState((state: StateWithActive<S>) => removeEntities({ state, ids }));
    if (ids === null) {
      this.setHasCache(false);
    }

    this.handleUIRemove(ids);
    this.entityActions.next({ type: EntityActions.Remove, ids });
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
  updateActive(newStateOrCallback: UpdateStateCallback<EntityType> | Partial<EntityType>): void {
    const ids = coerceArray(this.active);
    if (isDev()) setAction('Update Active', ids);
    this.update(ids, newStateOrCallback as Partial<EntityType>);
  }

  /**
   * Set the given entity as active
   *
   * @example
   *
   * store.setActive(1)
   * store.setActive([1, 2, 3])
   */
  setActive(idsOrOptions: S['active'] extends any[] ? S['active'] : SetActiveOptions | S['active']): void;

  setActive(idsOrOptions: OrArray<IDType> | SetActiveOptions | null): void {
    const active = getActiveEntities(idsOrOptions, this.ids, this.active);

    if (active === undefined) {
      return;
    }

    if (isDev()) setAction('Set Active', active);
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
  addActive<T = OrArray<IDType>>(ids: T): void {
    const toArray = coerceArray(ids);
    if (isEmpty(toArray)) return;
    const everyExist = toArray.every((id) => this.active.indexOf(id) > -1);
    if (everyExist) return;

    if (isDev()) setAction('Add Active', ids);
    this._setState((state) => {
      /** Protect against case that one of the items in the array exist */
      const uniques = Array.from(new Set([...(state.active as IDType[]), ...toArray]));
      return {
        ...state,
        active: uniques,
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
  removeActive<T = OrArray<IDType>>(ids: T): void {
    const toArray = coerceArray(ids);
    if (isEmpty(toArray)) return;
    const someExist = toArray.some((id) => this.active.indexOf(id) > -1);
    if (!someExist) return;

    if (isDev()) setAction('Remove Active', ids);
    this._setState((state) => {
      return {
        ...state,
        active: Array.isArray(state.active) ? state.active.filter((currentId) => !toArray.includes(currentId)) : null,
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
  toggleActive<T = OrArray<IDType>>(ids: T): void {
    const toArray = coerceArray(ids);
    const filterExists = (remove) => (id): boolean => this.active.includes(id) === remove;
    const remove = toArray.filter(filterExists(true));
    const add = toArray.filter(filterExists(false));
    this.removeActive(remove);
    this.addActive(add);
    if (isDev()) logAction('Toggle Active');
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
  createUIStore(initialState = {}, storeConfig: Partial<StoreConfigOptions> = {}): EntityUIStore<any, EntityType> {
    const defaults: Partial<StoreConfigOptions> = { name: `UI/${this.storeName}`, idKey: this.idKey };
    // TODO EntityUIStore uses EntityStore, and EntityStore uses EntityUIStore. This is bad, fix!
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.ui = new EntityUIStore(initialState, { ...defaults, ...storeConfig });
    return this.ui;
  }

  /** @internal */
  destroy(): void {
    super.destroy();
    if (this.ui instanceof EntityStore) {
      this.ui.destroy();
    }
    this.entityActions.complete();
  }

  /** @internal */
  // eslint-disable-next-line class-methods-use-this
  akitaPreUpdateEntity(_: Readonly<EntityType>, nextEntity: any): EntityType {
    return nextEntity as EntityType;
  }

  /** @internal */
  // eslint-disable-next-line class-methods-use-this
  akitaPreAddEntity(newEntity: any): EntityType {
    return newEntity as EntityType;
  }

  /** @internal */
  // eslint-disable-next-line class-methods-use-this
  akitaPreCheckEntity(newEntity: Readonly<EntityType>): EntityType {
    return newEntity;
  }

  private get ids(): any[] {
    return this._value().ids;
  }

  private get entities(): HashMap<any> {
    return this._value().entities;
  }

  private get active(): S['active'] {
    return this._value().active;
  }

  private _setActive(ids: OrArray<IDType>): void {
    this._setState((state) => {
      return {
        ...state,
        active: ids,
      };
    });
  }

  private handleUICreation(add = false): void {
    const { ids } = this;
    const isFunc = isFunction(this.ui._akitaCreateEntityFn);
    let uiEntities;
    const createFn = (id): any => {
      const current = this.entities[id];
      const ui = isFunc ? this.ui._akitaCreateEntityFn(current) : this.ui._akitaCreateEntityFn;
      return {
        [this.idKey]: current[this.idKey],
        ...ui,
      };
    };

    if (add) {
      uiEntities = this.ids.filter((id) => isUndefined(this.ui.entities[id])).map(createFn);
    } else {
      uiEntities = ids.map(createFn);
    }

    if (add) {
      this.ui.add(uiEntities);
    } else {
      this.ui.set(uiEntities);
    }
  }

  private hasInitialUIState(): boolean {
    return this.hasUIStore() && isUndefined(this.ui._akitaCreateEntityFn) === false;
  }

  private handleUIRemove(ids: IDType[]): void {
    if (this.hasUIStore()) {
      this.ui.remove(ids);
    }
  }

  private hasUIStore(): boolean {
    // TODO EntityUIStore uses EntityStore, and EntityStore uses EntityUIStore. This is bad, fix!
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return this.ui instanceof EntityUIStore;
  }
}

/** @internal */
export class EntityUIStore<UIState, DEPRECATED = any> extends EntityStore<UIState> {
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
  setInitialEntityState<EntityUI = any, Entity = any>(createFn: EntityUICreateFn<EntityUI, Entity>): void {
    this._akitaCreateEntityFn = createFn;
  }
}
