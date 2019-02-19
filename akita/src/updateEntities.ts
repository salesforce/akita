import { EntityState, ID, UpdateStateCallback } from './types';
import { isFunction } from './isFunction';
import { hasEntity } from './hasEntity';
import { isPlainObject } from './isPlainObject';

export type UpdateEntitiesParams<State, Entity> = {
  state: State;
  ids: ID[];
  idKey: string;
  newStateOrFn: UpdateStateCallback<Entity> | Partial<Entity> | Partial<State>;
};

export function updateEntities<S extends EntityState<E>, E>({ state, ids, idKey, newStateOrFn }: UpdateEntitiesParams<S, E>) {
  const updatedEntities = {};

  let isUpdatingIdKey = false;
  let idToUpdate: ID;
  let idsToAdd = [];

  for (const id of ids) {
    const oldEntity = state.entities[id];
    const newState = isFunction(newStateOrFn) ? newStateOrFn(oldEntity) : newStateOrFn;

    // if the entity doesn't exist, add it
    if (hasEntity(state.entities, id) === false) {
      // if the id key doesn't exist in the state, add it
      if (newState.hasOwnProperty(idKey) === false) {
        newState[idKey] = id;
      }
      updatedEntities[id] = newState;
      idsToAdd.push(id);
      continue;
    }

    const isIdChanged = newState.hasOwnProperty(idKey) && newState[idKey] !== oldEntity[idKey];
    let newEntity: E;
    idToUpdate = id;

    if (isIdChanged) {
      isUpdatingIdKey = true;
      idToUpdate = newState[idKey];
    }

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
        newEntity = new (oldEntity as any).constructor(merged);
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
    ...state,
    entities: {
      ...stateEntities,
      ...updatedEntities
    },
    ids: idsToAdd.length ? [...updatedIds, ...idsToAdd] : updatedIds
  };
}
