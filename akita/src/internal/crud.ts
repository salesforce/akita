import { Entities, EntityState, HashMap, ID, Newable, AddOptions } from '../api/types';
import { AkitaUpdateIdKeyError, assertEntityExists, assertEntityState } from './error';
import { entityExists, isFunction, isPlainObject, resetActive, getActives } from './utils';

export class CRUD {
  _set<S, E>(state: S, entities: E[] | HashMap<E> | Entities<E>, entityClass: Newable<E> | undefined, idKey): S {
    let ids, normalized;

    if ((entities as Entities<E>).ids && (entities as Entities<E>).entities) {
      ids = (entities as Entities<E>).ids;
      normalized = (entities as Entities<E>).entities;
    } else {
      const isArray = Array.isArray(entities);
      normalized = entities;

      if (isArray) {
        normalized = this.keyBy(entities as E[], entityClass, idKey) as E[];
      } else {
        assertEntityState(entities);
      }

      ids = isArray ? (entities as E[]).map(entity => entity[idKey]) : Object.keys(normalized as HashMap<E>).map(id => entities[id][idKey]);
    }

    const newState = {
      ...(state as any),
      entities: normalized,
      ids,
      loading: false
    };

    if (Array.isArray((state as S & { active: any }).active)) {
      newState.active = getActives((state as S & { active: any }).active, newState.ids);
    } else {
      if (resetActive(newState)) {
        newState.active = null;
      }
    }

    return newState;
  }

  _replaceEntity<T extends EntityState>(state: T, id: ID, entity): T {
    return {
      ...(state as any),
      entities: {
        ...state.entities,
        [id]: entity
      }
    };
  }

  _add<S extends EntityState, E>(state: S, entities: E[], idKey, options: AddOptions = {}): S {
    let addedEntities = {};
    let addedIds = [];

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const entityId = entity[idKey];

      if (!entityExists(entityId, state.entities)) {
        addedEntities[entityId] = entity;
        if (options.prepend) addedIds.unshift(entityId);
        else addedIds.push(entityId);
      }
    }

    return {
      ...(state as any),
      entities: {
        ...state.entities,
        ...addedEntities
      },
      ids: options.prepend ? [...addedIds, ...state.ids] : [...state.ids, ...addedIds]
    };
  }

  _update<T extends EntityState>(state: T, ids: ID[], newStateOrFn: object | ((e: Readonly<any>) => object), idKey: string): T {
    const updatedEntities = {};

    let isUpdatingIdKey = false;
    let idToUpdate: ID;

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      idToUpdate = id;
      assertEntityExists(id, state.entities);

      const oldEntity = state.entities[id];
      const newState = isFunction(newStateOrFn) ? newStateOrFn(oldEntity) : newStateOrFn;

      if (newState.hasOwnProperty(idKey) && newState[idKey] !== oldEntity[idKey]) {
        if (ids.length > 1) {
          throw new AkitaUpdateIdKeyError();
        }
        isUpdatingIdKey = true;
        idToUpdate = newState[idKey];
      }

      let newEntity;

      const merged = {
        ...oldEntity,
        ...newState
      };

      if (isPlainObject(oldEntity)) {
        newEntity = merged;
      } else {
        /**
         * In case that new state is class of it's own, there's
         * a possibility that it will be different than the old
         * class.
         * For example, Old state is an instance of animal class
         * and new state is instance of person class.
         * To avoid run over new person class with the old animal
         * class we check if the new state is a class of it's own.
         * If so, use it. Otherwise, use the old state class
         */
        if (isPlainObject(newState)) {
          newEntity = new oldEntity.constructor(merged);
        } else {
          newEntity = new (newState as any).constructor(merged);
        }
      }

      updatedEntities[idToUpdate] = newEntity;
    }

    let updatedIds = state.ids;
    let stateEntities = state.entities;
    if (isUpdatingIdKey) {
      const [id] = ids;
      const { [id]: deletedEntity, ...rest } = state.entities;
      stateEntities = rest;
      updatedIds = state.ids.map(current => (current === id ? idToUpdate : current));
    }

    return {
      ...(state as any),
      entities: {
        ...stateEntities,
        ...updatedEntities
      },
      ids: updatedIds
    };
  }

  _remove<T extends EntityState>(state: T, ids: ID[] | null): T {
    if (!ids) return this._removeAll(state);

    const removed = ids.reduce((acc, id) => {
      const { [id]: entity, ...rest } = acc;
      return rest;
    }, state.entities);

    const newState = {
      ...(state as any),
      entities: removed,
      ids: state.ids.filter(current => ids.indexOf(current) === -1)
    };

    if (Array.isArray(state.active)) {
      newState.active = getActives(state.active, newState.ids);
    } else {
      if (resetActive(newState)) {
        newState.active = null;
      }
    }

    return newState;
  }

  private _removeAll<T extends EntityState>(state: T): T {
    const newState = {
      ...(state as any),
      entities: {},
      ids: [],
      active: null
    };

    return newState;
  }

  private keyBy(entities: any[], entityClass?: Newable<any>, id = 'id') {
    const acc = {};

    for (let i = 0, len = entities.length; i < len; i++) {
      const entity = entities[i];
      acc[entity[id]] = entityClass ? new entityClass(entity) : entity;
    }

    return acc;
  }
}

export const _crud = new CRUD();
