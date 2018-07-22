import { _crud } from '../internal/crud';
import { ActiveState, Entities, EntityState, HashMap, ID, Newable } from './types';
import { coerceArray, entityExists, isFunction, toBoolean } from '../internal/utils';
import { isDev, Store } from './store';
import { AkitaImmutabilityError, assertActive } from '../internal/error';
import { applyTransaction } from './transaction';
import { Action, globalState } from '../internal/global-state';

/**
 * The Root Store that every sub store needs to inherit and
 * invoke `super` with the initial state.
 */
export class EntityStore<S extends EntityState<E>, E> extends Store<S> {
  /**
   *
   * Initiate the store with the state
   */
  constructor(initialState = {}, private options: { idKey?: string } = {}) {
    super({ ...getInitialEntitiesState(), ...initialState });
  }

  get entities() {
    return this._value().entities;
  }

  get idKey() {
    /** backward compatibility */
    const newIdKey = this.config && this.config.idKey;
    if (!newIdKey) {
      return this.options.idKey || 'id';
    }
    return newIdKey;
  }

  /**
   * Update the store's loading state.
   * The initial value is set to true and is switched to false when you call `store.set()`.
   * This can come in handy for indicating loading.
   */
  setLoading(loading = false) {
    if (loading !== this._value().loading) {
      this.updateRoot({ loading } as Partial<S>, { type: 'Set Loading' });
    }
  }

  /**
   * Update the store's error state.
   */
  setError<T>(error: T) {
    if (error !== this._value().error) {
      this.updateRoot({ error } as Partial<S>, { type: 'Set Error' });
    }
  }

  /**
   *
   * Replace current collection with provided collection
   *
   * @example
   * this.store.set([Entity, Entity]);
   * this.store.set({1: Entity, 2: Entity});
   * this.store.set([{id: 1}, {id: 2}], Product);
   *
   */
  set(entities: E[] | HashMap<E> | Entities<E>, entityClass?: Newable<E>) {
    applyTransaction(() => {
      this.setState(state => _crud._set(state, entities, entityClass, this.idKey));
      this.setDirty();
      this.setLoading();
      isDev() && globalState.setAction({ type: 'Set' });
    });
  }

  /**
   * Create or replace an entity in the store.
   *
   * @example
   * this.store.createOrReplace(3, Entity);
   *
   */
  createOrReplace(id: ID, entity: E) {
    if (!entityExists(id, this._value().entities)) {
      if (!entity[this.idKey]) {
        entity[this.idKey] = id;
      }
      return this.add(entity);
    }
    isDev() && globalState.setAction({ type: 'Create or Replace', entityId: [id] });
    this.setState(state => _crud._replaceEntity(state, id, entity));
  }

  /**
   * Add an entity or entities to the store.
   *
   * @example
   * this.store.add([Entity, Entity]);
   * this.store.add(Entity);
   */
  add(entities: E[] | E) {
    const toArray = coerceArray(entities);
    if (toArray.length === 0) return;
    isDev() && globalState.setAction({ type: 'Add' });
    this.setState(state => _crud._add<S, E>(state, coerceArray(entities), this.idKey));
  }

  /**
   *
   * Update an entity or entities in the store.
   *
   * @example
   * this.store.update(3, {
   *   name: 'New Name'
   * });
   *
   *  this.store.update(3, entity => {
   *    return {
   *      config: {
   *        ...entity.filter,
   *        date
   *      }
   *    }
   *  });
   *
   * this.store.update([1,2,3], {
   *   name: 'New Name'
   * });
   *
   *
   * this.store.update(null, {
   *   name: 'New Name'
   * });
   *
   */
  update(newState: Partial<S>);
  update(id: ID | ID[] | null, newStateFn: ((entity: Readonly<E>) => Partial<E>) | Partial<E>);
  update(stateOrId: Partial<S> | ID | ID[] | null, newStateFn?: ((entity: Readonly<E>) => Partial<E>) | Partial<E>) {
    const ids = toBoolean(stateOrId) ? coerceArray(stateOrId) : this._value().ids;
    isDev() && globalState.setAction({ type: 'Update', entityId: ids });

    this.setState(state => {
      const newState = typeof newStateFn === 'function' ? newStateFn(state.entities[stateOrId as ID]) : newStateFn;
      return _crud._update(state, ids, newState);
    });
  }

  /**
   * An alias to update all.
   */
  updateAll(state: Partial<E>) {
    if (this._value().ids.length === 0) return;
    this.update(null, state);
  }

  /**
   * Update the root state (data which is external to the entities).
   *
   * @example
   * this.store.updateRoot({
   *   metadata: 'new metadata
   * });
   *
   *  this.store.updateRoot(state => {
   *    return {
   *      metadata: {
   *        ...state.metadata,
   *        key: 'new value'
   *      }
   *    }
   *  });
   */
  updateRoot(newStateFn: ((state: Readonly<S>) => Partial<S>) | Partial<S>, action?: Action) {
    const newState = isFunction(newStateFn) ? newStateFn(this._value()) : newStateFn;

    if (newState === this._value()) {
      throw new AkitaImmutabilityError(this.storeName);
    }

    isDev() && globalState.setAction(action || { type: 'Update Root' });

    this.setState(state => {
      return {
        ...(state as any),
        ...(newState as any)
      };
    });
  }

  /**
   *
   * Remove one or more entities from the store:
   *
   * @example
   * this.store.remove(5);
   * this.store.remove([1,2,3]);
   * this.store.remove();
   */
  remove(id?: ID | ID[], resetActive?) {
    if (this._value().ids.length === 0) return;
    if (!toBoolean(id)) this.setPristine();

    const ids = toBoolean(id) ? coerceArray(id) : null;
    isDev() && globalState.setAction({ type: 'Remove', entityId: ids });

    this.setState(state => _crud._remove(state, ids, resetActive));
  }

  /**
   *
   * Update the active entity.
   *
   * @example
   * this.store.updateActive(active => {
   *   return {
   *     config: {
   *      ..active.config,
   *      date
   *     }
   *   }
   * })
   */
  updateActive(newStateFn: ((entity: Readonly<E>) => Partial<E>) | Partial<E>) {
    assertActive(this._value());
    isDev() && globalState.setAction({ type: 'Update Active', entityId: this._value().active });
    this.setState(state => {
      const activeId = state.active;
      const newState = isFunction(newStateFn) ? newStateFn(state.entities[activeId]) : newStateFn;
      if (newState === state) {
        throw new AkitaImmutabilityError(this.storeName);
      }
      return _crud._update(state, [activeId], newState);
    });
  }

  /**
   * Set the given entity as active.
   */
  setActive(id) {
    if (id === this._value().active) return;
    isDev() && globalState.setAction({ type: 'Set Active', entityId: id });
    this.setState(state => {
      return {
        ...(state as any),
        active: id
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

export const getInitialActiveState = () =>
  ({
    active: null
  } as ActiveState);
