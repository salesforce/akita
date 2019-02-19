import { DEFAULT_ID_KEY } from './defaultIDKey';

export function toEntitiesIds<E>(entities: E[], idKey = DEFAULT_ID_KEY) {
  const ids = [];
  for (const entity of entities) {
    ids.push(entity[idKey]);
  }
  return ids;
}
