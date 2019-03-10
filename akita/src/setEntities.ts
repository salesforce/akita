import { Entities, EntityState, HashMap, ID, ActiveState, MultiActiveState, StateWithActive } from './types';
import { toEntitiesObject } from './toEntitiesObject';
import { toEntitiesIds } from './toEntitiesIds';
import { isArray } from './isArray';
import { hasActiveState, resolveActiveEntity } from './activeState';

export type SetEntities<Entity> = Entity[] | Entities<Entity> | HashMap<Entity>;

export type SetEntitiesParams<State, Entity> = {
  state: State;
  entities: SetEntities<Entity>;
  idKey: string;
};

// @internal
export function isEntityState<Entity>(state): state is Entities<Entity> {
  return state.entities && state.ids;
}

// @internal
export function setEntities<S extends EntityState<E>, E>({ state, entities, idKey }: SetEntitiesParams<S, E>): S {
  let newEntities: HashMap<E>;
  let newIds: ID[];

  if (isArray(entities)) {
    newEntities = toEntitiesObject(entities, idKey);
    newIds = toEntitiesIds(entities, idKey);
  } else if (isEntityState(entities)) {
    newEntities = entities.entities;
    newIds = entities.ids;
  } else {
    // it's an object
    newEntities = entities;
    newIds = Object.keys(newEntities).map(Number);
  }

  const newState = {
    ...state,
    entities: newEntities,
    ids: newIds,
    loading: false
  };

  if (hasActiveState(state)) {
    newState.active = resolveActiveEntity(newState as any);
  }

  return newState;
}
