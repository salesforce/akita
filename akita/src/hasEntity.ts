import { EntityState, ID } from './index';

export function hasEntity<E>(entities: EntityState<E>, id: ID) {
  return entities.hasOwnProperty(id);
}
