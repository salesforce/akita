import { EntityState, PreAddEntity } from './types';
import { hasEntity } from './hasEntity';

export type AddEntitiesParams<State, Entity> = {
  state: State;
  entities: Entity[];
  idKey: string;
  options: AddEntitiesOptions;
  preAddEntity: PreAddEntity<Entity>;
};

export type AddEntitiesOptions = { prepend?: boolean; loading?: boolean };

// @internal
export function addEntities<S extends EntityState<E>, E>({ state, entities, idKey, options = {}, preAddEntity }: AddEntitiesParams<S, E>) {
  let newEntities = {};
  let newIds = [];
  let hasNewEntities = false;

  for (const entity of entities) {
    if (hasEntity(state.entities, entity[idKey]) === false) {
      // evaluate the middleware first to support dynamic ids
      const current = preAddEntity(entity);
      const entityId = current[idKey];
      newEntities[entityId] = current;
      if (options.prepend) newIds.unshift(entityId);
      else newIds.push(entityId);

      hasNewEntities = true;
    }
  }

  return hasNewEntities
    ? {
        newState: {
          ...state,
          entities: {
            ...state.entities,
            ...newEntities
          },
          ids: options.prepend ? [...newIds, ...state.ids] : [...state.ids, ...newIds]
        },
        newIds
      }
    : null;
}
