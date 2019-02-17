import { _crud } from '../internal/crud';
import { AkitaImmutabilityError, assertActive } from '../internal/error';
import { __globalState, Action } from '../internal/global-state';
import { isFunction, isNil, isObject, isPlainObject, isUndefined, toBoolean } from '../internal/utils';
import { isDev, Store } from './store';
import { Entities, EntityState, ID, IDS, SetActiveOptions, UpdateEntityPredicate, UpdateStateCallback } from './types';
import { applyTransaction, transaction } from './transaction';
import { setEntities } from '../setEntities';
import { coerceArray, hasEntity, isEmpty, updateEntities } from '@datorama/akita';
import { addEntities, AddEntitiesOptions } from '../addEntities';

/**
 * The Root Store that every sub store needs to inherit and
 * invoke `super` with the initial state.
 */
export class EntityStore<S extends EntityState<E>, E, EntityID = ID> extends Store<S> {
  /**
   *
   * Initiate the store with the state
   */
  constructor(initialState = {}, options: { idKey?: string; storeName?: string } = {}) {
    super({ ...getInitialEntitiesState(), ...initialState }, options);
  }

  /**
   *
   * Replace current collection with provided collection
   *
   * @example
   *
   * this.store.set([Entity, Entity]);
   * this.store.set({ids: [], entities: {}});
   *
   */
  set(entities: E[] | Entities<E>) {
    if (isNil(entities) || isEmpty(entities)) return;
    this.setState(state => setEntities({ state, entities, idKey: this.idKey }));
    this.setDirty();
  }

  /**
   *
   * Add or Update
   *
   * @example
   *
   * store.upsert(1, { name: newName })
   * store.upsert([1,2,3], { name: newName })
   * store.upsert(1, entity => ({ name: newName }))
   */
  // @transaction()
  // upsert( ids: IDS, entityOrFn: Partial<E> | UpdateStateCallback<E> ) {
  //   const asArray = coerceArray(ids);
  //   for( const id of asArray ) {
  //     if( hasEntity(this.entities, id) ) {
  //       this.update(id, entityOrFn as Partial<E>);
  //     } else {
  //       const entity = isFunction(entityOrFn) ? entityOrFn({} as Readonly<E>) : entityOrFn;
  //       if( entity.hasOwnProperty(this.idKey) === false ) {
  //         entity[this.idKey] = id;
  //       }
  //       this.add(entity as E);
  //     }
  //   }
  // }

  /**
   * Add entities
   *
   * @example
   *
   * this.store.add([Entity, Entity]);
   * this.store.add(Entity);
   * this.store.add(Entity, { prepend: true });
   */
  add(entities: E[] | E, options?: AddEntitiesOptions) {
    const collection = coerceArray(entities);

    if (isEmpty(collection)) return;
    const currentIds = this.getIds;
    const notExistEntities = collection.filter(entity => currentIds.includes(entity[this.idKey]) === false);
    if (isEmpty(notExistEntities)) return;

    this.setState(state =>
      addEntities({
        state,
        entities: notExistEntities,
        idKey: this.idKey,
        options
      })
    );
  }

  /**
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
      ids = this.getIds.filter(id => (idsOrFnOrState as UpdateEntityPredicate<E>)(this.entities[id]));
    } else {
      // If it's nil we want all of them
      ids = isNil(idsOrFnOrState) ? this.getIds : coerceArray(idsOrFnOrState);
    }

    if (isEmpty(ids)) return;

    this.setState(state =>
      updateEntities({
        idKey: this.idKey,
        ids,
        state,
        newStateOrFn
      })
    );
  }

  /**
   *
   * Remove one or more entities from the store:
   *
   * @example
   * this.store.remove(5);
   * this.store.remove([1,2,3]);
   * this.store.remove(entity => entity.id === 1);
   * this.store.remove();
   */
  remove(id?: ID | ID[]);
  remove(predicate: (entity: Readonly<E>) => boolean);
  remove(idsOrFn?: ID | ID[] | ((entity: Readonly<E>) => boolean)) {
    const storeIds = this._value().ids;

    if (storeIds.length === 0) return;
    const idPassed = toBoolean(idsOrFn);
    if (!idPassed) this.setPristine();

    let ids: ID[] = [];
    if (isFunction(idsOrFn)) {
      for (let i = 0, len = storeIds.length; i < len; i++) {
        const id = storeIds[i];
        const entity = this._value().entities[id];
        if (entity && idsOrFn(entity)) {
          ids.push(id);
        }
      }
    } else {
      ids = idPassed ? coerceArray(idsOrFn) : null;
    }

    if (ids && ids.length === 0) return;

    this.setState(state => {
      return _crud._remove(state, ids);
    });
  }

  /**
   *
   * Update the active entity.
   *
   * @example
   * this.store.updateActive({ completed: true });
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
    const ids = coerceArray(this.getActive());
    this.update(ids, newStateOrCallback as Partial<E>);
  }

  /**
   * Set the given entity as active.
   */
  setActive(idOrOptions: S['active'] extends any[] ? S['active'] : (SetActiveOptions | S['active']));
  setActive(idOrOptions: EntityID | SetActiveOptions | null) {
    if (Array.isArray(idOrOptions)) {
      this._setActive(idOrOptions);
    } else {
      let activeId: EntityID;
      if (isObject(idOrOptions)) {
        if (isNil(this._value().active)) return;
        (idOrOptions as SetActiveOptions) = Object.assign({ wrap: true }, idOrOptions);
        const ids = this._value().ids;
        const currentIdIndex = ids.indexOf(this._value().active);
        if ((idOrOptions as SetActiveOptions).prev) {
          const isFirst = currentIdIndex === 0;
          if (isFirst && !(idOrOptions as SetActiveOptions).wrap) return;
          activeId = isFirst ? ids[ids.length - 1] : (ids[currentIdIndex - 1] as any);
        } else if ((idOrOptions as SetActiveOptions).next) {
          const isLast = ids.length === currentIdIndex + 1;
          if (isLast && !(idOrOptions as SetActiveOptions).wrap) return;
          activeId = isLast ? ids[0] : (ids[currentIdIndex + 1] as any);
        }
      } else {
        if (idOrOptions === this._value().active) return;
        activeId = idOrOptions as EntityID;
      }

      this._setActive(activeId);
    }
  }

  /**
   * Add active entities
   *
   * @example
   * store.addActive(2);
   * store.addActive([3, 4, 5]);
   */
  addActive<T = IDS>(ids: T) {
    const toArray = coerceArray(ids);
    const everyExist = toArray.every(id => this._value().active.indexOf(id) > -1);
    if (everyExist) return;

    this.setState(state => {
      /** Protect against case that one of the items in the array exist */
      const uniques = Array.from(new Set([...(state.active as any[]), ...toArray]));
      return {
        ...(state as any),
        active: uniques
      };
    });
  }

  /**
   * Remove active entities
   *
   * @example
   * store.removeActive(2);
   * store.removeActive([3, 4, 5]);
   */
  removeActive<T = IDS>(ids: T) {
    const toArray = coerceArray(ids);
    const someExist = toArray.some(id => this._value().active.indexOf(id) > -1);
    if (!someExist) return;
    this.setState(state => {
      return {
        ...(state as any),
        active: state.active.filter(currentId => toArray.indexOf(currentId) === -1)
      };
    });
  }

  /**
   * Toggle active entities
   *
   * @example
   * store.toggle(2);
   * store.toggle([3, 4, 5]);
   */
  @transaction()
  toggleActive<T = IDS>(ids: T) {
    const toArray = coerceArray(ids);
    const active = this._value().active;
    for (const id of toArray) {
      if (active.indexOf(id) > -1) {
        this.removeActive(ids);
      } else {
        this.addActive(ids);
      }
    }
    isDev() && __globalState.setCustomAction({ type: 'Toggle Active', entityId: ids }, true);
  }

  private get getIds() {
    return this._value().ids;
  }

  private get entities() {
    return this._value().entities;
  }

  private getActive() {
    return this._value().active;
  }

  private _setActive(ids) {
    isDev() && __globalState.setAction({ type: 'Set Active Entity', entityId: ids });
    this.setState(state => {
      return {
        ...(state as any),
        active: ids
      };
    });
  }
}

export const getInitialEntitiesState = () =>
  ({
    entities: {},
    ids: [],
    loading: true,
    error: null
  } as EntityState);
