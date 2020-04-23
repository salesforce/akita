import { isString } from './isString';
import { isUndefined } from './isUndefined';
import { ItemPredicate } from './types';

/** @internal */
export function findEntityByPredicate<E>(predicate: ItemPredicate<E>, entities: object): string | undefined {
  return Object.keys(entities).find((entityId) => predicate(entities[entityId]));
}

/** @internal */
export function getEntity(id, project) {
  return (entities): any => {
    const entity = entities[id];

    if (isUndefined(entity)) {
      return undefined;
    }

    if (!project) {
      return entity;
    }

    if (isString(project)) {
      return entity[project];
    }

    return (project as Function)(entity);
  };
}
