import { EntityState, ID } from '@datorama/akita';

export function hasEntity<E>(entities: EntityState<E>, id: ID) {
  return entities.hasOwnProperty(id);
}
