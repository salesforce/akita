import { isUndefined } from './isUndefined';
import { isString } from './isString';
import { ItemPredicate } from './types';

// @internal
export function findEntityByPredicate<E>(predicate: ItemPredicate<E>, entities) {
    for(const entityId of Object.keys(entities)) {
      if(predicate(entities[entityId]) === true) {
        return entityId;
      }
    }

    return undefined;
}

// @internal
export function getEntity( id, project ) {
  return function(entities) {
    const entity = entities[id];

    if(isUndefined(entity)) {
      return undefined;
    }

    if(!project) {
      return entity;
    }

    if(isString(project)) {
      return entity[project];
    }

    return (project as Function)(entity);
  };

}
