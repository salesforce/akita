import { isUndefined } from './isUndefined';
import { isString } from './isString';

// @internal
export function getEntity( id, project ) {
  return function( entities ) {
    const entity = entities[id];

    if( isUndefined(entity) ) {
      return undefined;
    }

    if( !project ) {
      return entity;
    }

    if( isString(project) ) {
      return entity[project];
    }

    return (project as Function)(entity);
  };

}
