import { hasActiveState, isMultiActiveState, resolveActiveEntity } from './activeState';
import { isNil } from './isNil';
import { EntityState, getEntityType, getIDType, HashMap, ID, StateWithActive } from './types';

// @internal
export type RemoveEntitiesParams<S extends EntityState<EntityType, IDType> = EntityState<any, any>, EntityType = getEntityType<S>, IDType extends ID = getIDType<S>> = {
  state: StateWithActive<S>;
  ids: IDType[];
};

// @internal
export function removeEntities<S extends EntityState<EntityType, IDType> = EntityState<any, any>, EntityType = getEntityType<S>, IDType extends ID = getIDType<S>>({
  state,
  ids,
}: RemoveEntitiesParams<S, EntityType, IDType>): S {
  if (isNil(ids)) return removeAllEntities(state);
  const entities = state.entities;
  let newEntities = {} as HashMap<EntityType, IDType>;

  for (const id of state.ids) {
    if (ids.includes(id) === false) {
      newEntities[id] = entities[id];
    }
  }

  const newState = {
    ...state,
    entities: newEntities,
    ids: state.ids.filter((current) => ids.includes(current) === false),
  };

  // FIXME: Remove `as any'
  if (hasActiveState(state as any)) {
    newState.active = resolveActiveEntity(newState as any);
  }

  return newState;
}

// @internal
export function removeAllEntities<S>(state: StateWithActive<S>): S {
  return {
    ...state,
    entities: {},
    ids: [],
    active: isMultiActiveState(state.active) ? [] : null,
  };
}
