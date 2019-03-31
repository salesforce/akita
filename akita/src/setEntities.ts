import { Entities, EntityState, HashMap, ID, PreAddEntity } from './types';
import { toEntitiesObject } from './toEntitiesObject';
import { isArray } from './isArray';
import { hasActiveState, resolveActiveEntity } from './activeState';

export type SetEntities<Entity> = Entity[] | Entities<Entity> | HashMap<Entity>;

export type SetEntitiesParams<State, Entity> = {
  state: State;
  entities: SetEntities<Entity>;
  idKey: string;
  preAddEntity: PreAddEntity<Entity>;
  isNativePreAdd?: boolean;
};

// @internal
export function isEntityState<Entity>(state): state is Entities<Entity> {
  return state.entities && state.ids;
}

// @internal
function applyMiddleware<E>(entities: HashMap<E>, preAddEntity: PreAddEntity<E>) {
  let mapped = {};
  for (const id of Object.keys(entities)) {
    mapped[id] = preAddEntity(entities[id]);
  }

  return mapped;
}

// @internal
export function setEntities<S extends EntityState<E>, E>({ state, entities, idKey, preAddEntity, isNativePreAdd }: SetEntitiesParams<S, E>): S {
  let newEntities: HashMap<E>;
  let newIds: ID[];

  if (isArray(entities)) {
    const resolve = toEntitiesObject(entities, idKey, preAddEntity);
    newEntities = resolve.entities;
    newIds = resolve.ids;
  } else if (isEntityState(entities)) {
    newEntities = isNativePreAdd ? entities.entities : applyMiddleware(entities.entities, preAddEntity);
    newIds = entities.ids;
  } else {
    // it's an object
    newEntities = isNativePreAdd ? entities : applyMiddleware(entities, preAddEntity);
    newIds = Object.keys(newEntities).map(id => (isNaN(id as any) ? id : Number(id)));
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
