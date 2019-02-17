import { Entities, EntityState, hasActiveState, HashMap, ID, isArray, resolveActiveEntity, toEntitiesIds, toEntitiesObject } from '@datorama/akita';

export type SetEntitiesParams<State, Entity> = {
  state: State;
  entities: Entity[] | Entities<Entity>;
  idKey: string;
};

export function setEntities<S extends EntityState<E>, E>({ state, entities, idKey }: SetEntitiesParams<S, E>): S {
  let newEntities: HashMap<E>;
  let newIds: ID[];

  if (isArray(entities)) {
    newEntities = toEntitiesObject(entities, idKey);
    newIds = toEntitiesIds(entities, idKey);
  } else {
    newEntities = entities.entities;
    newIds = entities.ids;
  }

  const newState = {
    ...state,
    entities: newEntities,
    ids: newIds,
    loading: false
  };

  if (hasActiveState(state)) {
    newState.active = resolveActiveEntity(state);
  }

  return newState;
}
