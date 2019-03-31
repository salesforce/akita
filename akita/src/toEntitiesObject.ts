import { PreAddEntity } from './types';

// @internal
export function toEntitiesObject<E>(entities: E[], idKey: string, preAddEntity: PreAddEntity<E>) {
  const acc = {
    entities: {},
    ids: []
  };

  for (const entity of entities) {
    // evaluate the middleware first to support dynamic ids
    const current = preAddEntity(entity);
    acc.entities[current[idKey]] = current;
    acc.ids.push(current[idKey]);
  }

  return acc;
}
