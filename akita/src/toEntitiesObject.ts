import { PreAddEntity } from './types';

// @internal
export function toEntitiesObject<E>(entities: E[], idKey: string, preAddEntity: PreAddEntity<E>) {
  const acc = {
    entities: {},
    ids: []
  };

  for (const entity of entities) {
    acc.entities[entity[idKey]] = preAddEntity(entity);
    acc.ids.push(entity[idKey]);
  }

  return acc;
}
