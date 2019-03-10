import { EntityState, PreAddEntity } from './index';

export type AddEntitiesParams<State, Entity> = {
  state: State;
  entities: Entity[];
  idKey: string;
  options: AddEntitiesOptions;
  preAddEntity: PreAddEntity<Entity>;
};

export type AddEntitiesOptions = { prepend?: boolean };

// @internal
export function addEntities<S extends EntityState<E>, E>({ state, entities, idKey, options = {}, preAddEntity }: AddEntitiesParams<S, E>): S {
  let newEntities = {};
  let newIds = [];

  for (const entity of entities) {
    const entityId = entity[idKey];
    newEntities[entityId] = preAddEntity(entity);
    if (options.prepend) newIds.unshift(entityId);
    else newIds.push(entityId);
  }

  return {
    ...state,
    entities: {
      ...state.entities,
      ...newEntities
    },
    ids: options.prepend ? [...newIds, ...state.ids] : [...state.ids, ...newIds]
  };
}
