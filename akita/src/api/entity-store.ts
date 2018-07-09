import { _crud } from '../internal/crud';
import { ActiveState, Entities, EntityState, HashMap, ID, Newable } from './types';
import { coerceArray, entityExists, isFunction, toBoolean } from '../internal/utils';
import { Store } from './store';
import { assertActive, assertEntityExists } from '../internal/error';
import { applyTransaction } from './transaction';

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
    this.updateRoot({ loading } as Partial<S>);
  }

  /**
   * Update the store's error state.
   */
  setError<T>(error: T) {
    this.updateRoot({ error } as Partial<S>);
  }

  /**
   *
   * Replace current collection with provided collection
   *
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
    });
  }

  /**
   * Create or replace an entity in the store.
   *
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

    this.setState(state => _crud._replaceEntity(state, id, entity));
  }

  /**
   * Add an entity or entities to the store.
   *
   * this.store.add([Entity, Entity]);
   * this.store.add(Entity);
   */
  add(entities: E[] | E) {
    this.setState(state => _crud._add<S, E>(state, coerceArray(entities), this.idKey));
  }

  /**
   *
   * Update an entity or entities in the store.
   *
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
    this.setState(state => {
      const newState = typeof newStateFn === 'function' ? newStateFn(state.entities[stateOrId as ID]) : newStateFn;
      return _crud._update(state, ids, newState);
    });
  }

  /**
   * An alias to update all.
   */
  updateAll(state: Partial<E>) {
    this.update(null, state);
  }

  /**
   * Update the root state (data which is external to the entities).
   *
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
  updateRoot(newStateFn?: ((state: Readonly<S>) => Partial<S>) | Partial<S>) {
    const newState = isFunction(newStateFn) ? newStateFn(this._value()) : newStateFn;

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
   * this.store.remove(5);
   * this.store.remove([1,2,3]);
   * this.store.remove();
   */
  remove(id?: ID | ID[], resetActive?) {
    if (!toBoolean(id)) this.setPristine();

    const ids = toBoolean(id) ? coerceArray(id) : null;
    this.setState(state => _crud._remove(state, ids, resetActive));
  }

  /**
   *
   * Update the active entity.
   *
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
    this.setState(state => {
      const activeId = state.active;
      const newState = isFunction(newStateFn) ? newStateFn(state.entities[activeId]) : newStateFn;
      return _crud._update(state, [activeId], newState);
    });
  }

  /**
   * Set the given entity as active.
   */
  setActive(id) {
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
