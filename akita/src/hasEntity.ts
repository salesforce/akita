import { EntityState, ID } from './index';

// @internal
export function hasEntity<E>(entities: EntityState<E>, id: ID) {
  return entities.hasOwnProperty(id);
}
