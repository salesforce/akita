import { isEmpty } from './isEmpty';
import { SetEntities, setEntities } from './setEntities';
import { Store } from './store';
import { EntityState, ID, IDS, StateWithActive, UpdateEntityPredicate, UpdateStateCallback } from './types';
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
  constructor(initialState = {}, options: Partial<StoreConfigOptions> = {}) {
    super({ ...getInitialEntitiesState(), ...initialState }, options);
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

    isDev() && setAction('Set Entities');
    this._setState(state => setEntities({ state, entities, idKey: this.idKey }));
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

    isDev() && setAction('Add Entities');
    this._setState(state =>
      addEntities({
        state,
        preAddEntity: this.akitaPreAddEntity,
        entities: notExistEntities,
        idKey: this.idKey,
        options
      })
    );
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

    isDev() && setAction('Update Entities', ids);
    this._setState(state =>
      updateEntities({
        idKey: this.idKey,
        ids,
        preUpdateEntity: this.akitaPreUpdateEntity,
        state,
        newStateOrFn
      })
    );
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

    isDev() && setAction('Remove Entities', ids);
    this._setState((state: StateWithActive<S>) => removeEntities({ state, ids }));
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

    isDev() && setAction('Set Active', idOrOptions);
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
    isDev() && logAction('Toggle Active');
    const toArray = coerceArray(ids);
    const filterExists = remove => id => this.active.includes(id) === remove;
    const remove = toArray.filter(filterExists(true));
    const add = toArray.filter(filterExists(false));
    this.removeActive(remove);
    this.addActive(add);
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
}
